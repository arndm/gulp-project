// when the DOM is ready...
$(document).ready(function () {


	$(".dropbtn").click(function(){
	$("#myDropdown").slideToggle();
	})
//----------------------------------------------

$("#gal").click(function(){
		if ($('#forjan').css('display') !== 'none') {
			$("#forjan").toggle();
		}

		if ($('#forfeb').css('display') !== 'none') {
			$("#forfeb").toggle();
		}

		$("#tables").show();

		});

	$(".bday").click(function(){

		var calid = $(this).attr("id");
		var dynaId = "for" + calid;

		$('#' + dynaId).toggle("fade");
		});

	$(".left-arrow").click(function(){
		var backid = $(this).attr("id");
		var backid = backid.toLowerCase();
		var retuId = "for" + backid;

		$('#' + retuId).toggle("slide");
		});






$(".Mitems,.Sitems,.Ditems,.NA").change(function() {
	document.getElementById("foodChecked").innerHTML = '';
     var favourite = $("input[type='checkbox']:checked").map(function(i,chk){
         return chk.value;
     }).get();
     console.log(favourite);


function makeUL(array) {
    // Create the list element:

    var list = document.createElement('ul');


    for(var i = 0; i < array.length; i++) {
        // Create the list item:




        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode(array[i]));

        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}

// Add the contents of options[0] to #foo:

document.getElementById('foodChecked').appendChild(makeUL(favourite));

	});


$(".Mitems").click(function() {

  var bol = $("input:checkbox.Mitems:checked").length >= 1;
  $("input:checkbox.Mitems").not(":checked").attr("disabled",bol);

});

$(".Sitems").click(function() {

  var bol = $("input:checkbox.Sitems:checked").length >= 1;
  $("input:checkbox.Sitems").not(":checked").attr("disabled",bol);

});

$(".Ditems").click(function() {

  var bol = $("input:checkbox.Ditems:checked").length >= 1;
  $("input:checkbox.Ditems").not(":checked").attr("disabled",bol);

});

$(".NA").click(function() {

  var bol = $("input:checkbox:checked").length >= 1;
  $("input:checkbox").not(":checked").attr("disabled",bol);

});







//---------------------------------------------
	$("form#foodForm").submit(function(event) {
		event.preventDefault();
		$("#myDropdown").slideToggle();
		var dbdone ;
		dbdone = 0;
		console.log(dbdone);
		//document.getElementById("#foodFormReply").innerHTML = "Processing . . .";
		$("#foodFormReply").css("display", "none");
    $("#processing").css("display", "block");

		blink('#processing',dbdone);

		function blink(selector,val){
			if(val == 0){
	$(selector).fadeOut('fast', function(){
			$(this).fadeIn('fast', function(){
					blink(this);
			});
	});
}
}




		console.log("form submitted");
		 // Prevents the page from refreshing
		var $this = $(this); // `this` refers to the current form element
		$.post(
				'/submittedData', // Gets the URL to sent the post to
				$this.serialize(), // Serializes form data in standard format
				function(data) {
					console.log(data);
 				 $("#foodFormReply").html(data);
				 $("#processing").css("display", "none");
		     $("#foodFormReply").css("display", "block");
				 dbdone = 1;
				 	console.log(dbdone);
				 /** code to handle response **/ }

							);

	});




	$("form#feedbackForm").submit(function(event) {
		event.preventDefault();

		console.log("Feedback form submitted");
		 // Prevents the page from refreshing
		var $this = $(this); // `this` refers to the current form element
		$.post(
				'/feedback', // Gets the URL to sent the post to
				$this.serialize(), // Serializes form data in standard format
				function(data) {
					console.log(data);

				  $("#feedbackResult").html(data);
			 /** code to handle response **/ }
				// The format the response should be in
		);

	});

//	});




	$('.test').click(function() {
	var x = 1;
	x = $(this).attr('id');
	$("#MyEdit").html(x);

});

    var $panels = $('#slider .scrollContainer > div');
    var $container = $('#slider .scrollContainer');

    // if false, we'll float all the panels left and fix the width
    // of the container
    var horizontal = false;

    // float the panels left if we're going horizontal
    if (horizontal) {
        $panels.css({
            'float' : 'left',
            'position' : 'relative' // IE fix to ensure overflow is hidden
        });

        // calculate a new width for the container (so it holds all panels)
        $container.css('width', $panels[0].offsetWidth * $panels.length);
    }

    // collect the scroll object, at the same time apply the hidden overflow
    // to remove the default scrollbars that will appear
    var $scroll = $('#slider .scroll').css('overflow', 'hidden');

    // apply our left + right buttons
    //$scroll
    //   .before('<img class="scrollButtons left" src="" />')
    //   .after('<img class="scrollButtons right" src="" />');

    // handle nav selection
    function selectNav() {
        $(this)
            .parents('ul:first')
                .find('a')
                    .removeClass('selected')
                .end()
            .end()
            .addClass('selected');
    }

    $('#slider .navigation').find('a').click(selectNav);

    // go find the navigation link that has this target and select the nav
    function trigger(data) {
        var el = $('#slider .navigation').find('a[href$="' + data.id + '"]').get(0);
        selectNav.call(el);
    }

    if (window.location.hash) {
        trigger({ id : window.location.hash.substr(1) });
    } else {
        $('ul.navigation a:first').click();
    }

    // offset is used to move to *exactly* the right place, since I'm using
    // padding on my example, I need to subtract the amount of padding to
    // the offset.  Try removing this to get a good idea of the effect
    var offset = parseInt((horizontal ?
        $container.css('paddingTop') :
        $container.css('paddingLeft'))
        || 0) * -1;


    var scrollOptions = {
        target: $scroll, // the element that has the overflow

        // can be a selector which will be relative to the target
        items: $panels,

        navigation: '.navigation a',

        // selectors are NOT relative to document, i.e. make sure they're unique
        prev: 'img.left',
        next: 'img.right',

        // allow the scroll effect to run both directions
        axis: 'xy',

        onAfter: trigger, // our final callback

        offset: offset,

        // duration of the sliding effect
        duration: 500,

        // easing - can be used with the easing plugin:
        // http://gsgd.co.uk/sandbox/jquery/easing/
        easing: 'swing'
    };

    // apply serialScroll to the slider - we chose this plugin because it
    // supports// the indexed next and previous scroll along with hooking
    // in to our navigation.
    $('#slider').serialScroll(scrollOptions);

    // now apply localScroll to hook any other arbitrary links to trigger
    // the effect
    $.localScroll(scrollOptions);

    // finally, if the URL has a hash, move the slider in to position,
    // setting the duration to 1 because I don't want it to scroll in the
    // very first page load.  We don't always need this, but it ensures
    // the positioning is absolutely spot on when the pages loads.
    scrollOptions.duration = 1;
    $.localScroll.hash(scrollOptions);

});
