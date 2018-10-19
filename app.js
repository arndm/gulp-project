var express           =     require('express')
  , passport          =     require('passport')
  , util              =     require('util')
  , GoogleStrategy    =     require('passport-google-oauth').OAuth2Strategy
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , session           =     require('express-session')
  , MongoStore        =      require('connect-mongo')(session)
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , format            =     require('util').format
  , mongodb           =     require('mongodb')
  , ejs               =     require('ejs')
  , dateFormat        =     require('dateformat')
  , cfenv             =     require('cfenv')
  , app               =     express()
  , creds             =     require('config');

  // Setup app and paths

  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', ejs.renderFile);


    app.use(express.static(__dirname + '/public'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    //app.use(session({ secret: 'keyboard cat', key: 'sid'}));
   app.use(session({
      secret: 'keyboard cat',
      cookie: { maxAge: 15 * 60 * 60 * 1000 },
      saveUninitialized: true, // don't create session until something stored
      resave: false,
      store: new MongoStore({
      url: creds.DB_URL,
      autoRemove: 'native'
      //  mongoOptions: advancedOptions // See below for details
      })
    }));


    app.use(passport.initialize());
    app.use(passport.session());


//Connecting to mongodb
var MongoClient = mongodb.MongoClient;
var url = creds.DB_URL;

//------------------------------------

//Define your variables

var user = null;                  // Profile Id coming from Google or Facebook
var splittedName = null;          // Names splited into first and last
var user_item = {};               // JSON object to insert into MOngo Items collecction
var userExists = 0;


//----------------------


// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//Use FacebookStrategy within passport ---------------------------- F A C E B O O K--------------------------------------

passport.use(new FacebookStrategy({
    clientID: creds.FB_CLIENTID,
    clientSecret: creds.FB_CLIENT_SECRET ,
    callbackURL: creds.FB_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      //Further DB code.

      user = profile.id;
      var name = profile.displayName;
      var obj = {userId: user , Name: name};
      console.log(obj);

      //Database Operations for Facebook User: Insert profile Id and Name if doesn't exist. If exise set a variable only <userExists>

      MongoClient.connect(url, function (err, db) {
          if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
          } else {
            //HURRAY!! We are connected.
            console.log('Connection established to', url);
        }



      var collection_items      = db.collection('Items');

      //Operation for Items table: find, if not found, insert
      collection_items.find({userId: user}).toArray(function (err, result) {
      if (err) {
        console.log(err);
        //Close connection
        db.close();
      } else if (result.length) {
        console.log('Found:');
        userExists = 1;

        //Close connection
        db.close();
      } else {
        console.log('No document(s) found with defined "find" criteria!');
        collection_items.insert(obj, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log('Inserted documents into the "Items" collection');
          }
        });
        //Close connection
      db.close();
      }
    });

  }); //end of MongoDb


      return done(null, profile);
    });
  }
));

//-------------------------------------------------------------------------------------------------

// Use the GoogleStrategy within Passport ---------------------------- G O O G L E--------------------------------------
passport.use(new GoogleStrategy({
    clientID: creds.GOOGLE_CLIENTID,
    clientSecret: creds.GOOGLE_CLIENT_SECRET ,
    callbackURL: creds.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      //Further DB code.


      user = profile.id;
      var name = profile.displayName;
      var obj = {userId: user , Name: name};
      console.log(obj);

      //Database Operations for Facebook User: Insert profile Id and Name if doesn't exist. If exise set a variable only <userExists>

      MongoClient.connect(url, function (err, db) {
          if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
          } else {
            //HURRAY!! We are connected.
            console.log('Connection established to', url);
        }



      var collection_items = db.collection('Items');
      //Operation : find, if not found, insert
      collection_items.find({userId: user}).toArray(function (err, result) {
      if (err) {
        console.log(err);
        //Close connection
        db.close();
      } else if (result.length) {
        console.log('Found:');
        userExists = 1;

        //Close connection
        db.close();
      } else {
        console.log('No document(s) found with defined "find" criteria!');
        collection_items.insert(obj, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log('Inserted documents into the "Items" collection');
          }
        });
        //Close connection
        db.close();
      }
    });
  }); //end of MongoDb


      return done(null, profile);
    });
  }
));








//-----------------------------------------------------------------------------------------------------------------------------//

// **************************************Router code************************************************

//Get data from login page
app.get('/login', function(req, res){

  res.render('gulp-login.html');
});

//If user tries to load Gulp directly wothout loggin in,redirect to login page else render the Gulp main page

app.get('/home', function(req, res){
  if (user == null){
    res.redirect('/login')
  }

//res.render('indexgulp.html');
res.render( 'indexgulp',{ user: req.user } );
var userName = req.user.displayName;

splittedName = userName.split(' ',2);
//console.log(splittedName[0]);
});


// Get the various items selected by the user and send an appropriate response

app.post('/submittedData',function(req,res){

var nameInsub = req.user.displayName;
var userIdsub = req.user.id;
  //get Current Timestamp
var splitNamesd = nameInsub.split(' ',2);

  var now = new Date();
  var timeNow = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

  var Item_1 = '';
  var Item_2 = '';
  var Item_3 = '';
  var Item_4 = '';



  var food = req.body.items;
  console.log(food);
  var foodStr = food.toString();
  console.log("foodStr" + foodStr);
  //console.log(req.body.items(0));
  //console.log(len);
  var food_items = foodStr.split(",");

  Item_1 = food_items[0];
  Item_2 = food_items[1];
  Item_3 = food_items[2];
  Item_4 = food_items[3];

  //Prepare to send response

  var firstNamesd = splitNamesd[0].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  res.writeHead(200, {"Content-Type": "text/plain"});


  console.log( Item_1 +Item_2 +Item_3 +Item_4 );
  MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        //HURRAY!! We are connected.
        console.log('Connection established to', url);
    }



  var collection_items = db.collection('Items');
  //Operation : add items to the existing document basefon userId
  collection_items.update({userId: userIdsub}, {$set: {ITEM_1:Item_1 , ITEM_2:Item_2, ITEM_3:Item_3, ITEM_4:Item_4, Date_Time: new Date()}}, function (err, numUpdated) {
  if (err) {
    console.log(err);
    res.write("Sorry, could not connect to MongoDb. Please contact the administrator or try again after some time");
    res.end();
  } else if (numUpdated) {
    console.log('Updated Successfully  document(s).');
    res.write("Sorry " + firstNamesd + "!" + "We are not taking orders currently!" + "<br/><br/> Keep a check on the Notifications tab for the upcoming events");
    res.end();
  } else {
    console.log('No document found with defined "find" criteria!');
  }
  //Close connection
  db.close();
});
}); //end of MongoDb





});


//--------------------------Handle feedback from contact page*********************************************************

app.post('/feedback',function(req,res){

  var feedbackText = req.body;

  var userNamefeed = req.user.displayName;
  console.log("From feed: " + userNamefeed);
  var userIdfeed   = req.user.id;

  var splitNamefb = userNamefeed.split(' ',2);

  var firstNamefb = splitNamefb[0].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

  //console.log(req.body.items(0));
  //console.log(len);
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("Thank you for your feedback " + firstNamefb + "!");
  res.end();
   //var FeedName = splittedName[0] + ' ' + splittedName[1];

  var feedB = {UserId : userIdfeed, Name : userNamefeed ,Feedback : feedbackText.text};



  MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        //HURRAY!! We are connected.
        console.log('Connection established to', url);
    }

    var collection_feedback   = db.collection('Feedback');
    //Insert feedback into Feedback collection
    collection_feedback.insert(feedB, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted documents into the "feedback" collection');
      }
    });
    //Close connection
    db.close();


  });//end of mongo

});

//Passport Router
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

//For facebook

app.get('/auth/facebook', passport.authenticate('facebook'));

//authenticate google

app.get('/auth/google/callback',
  passport.authenticate('google', {
       successRedirect : '/home',
       failureRedirect: '/login',
       successFlash: true
  }),
  function(req, res) {
    res.redirect('/login');
  });

//authenticate facebook

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
       successRedirect : '/home',
       failureRedirect: '/login',
       successFlash: true
  }),
  function(req, res) {
    res.redirect('/login');
  });

// Logout from the gulp page and redirect to login page
app.get('/logout', function(req, res){
  req.session.destroy();
  console.log("got logout");
  req.logout();
  res.redirect('/login');
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

//For bluemix

var appEnv = cfenv.getAppEnv();
var port = process.env.VCAP_APP_PORT;

// start server on the specified port and binding host
app.listen(port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
