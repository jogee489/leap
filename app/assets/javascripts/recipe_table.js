/**
 * recipe_table.js contains all the javascript associated with displaying,
 * and handling events on the recipe_table page.
 */

$(document).ready(function() {

	$(".app-table-tr").on('mouseover', function () {
    $(this).css({"opacity": "1"});
  }).on('mouseout', function () {
    if (!$(this).hasClass("expanded") && $(this).find('.check-rec').prop('checked') == false) {
      $(this).css({"opacity": "0.9"});
    }
  });

	// Logic for expanding recipe details when chevron pressed.
	$(".expand-td").unbind('click').click(function() {
		$(this).parent().next().toggle('slow');
		
		// change opacity
    var trOpacity = $(this).parent().css('opacity');

    if ($(this).parent().hasClass("expanded")) {
    	if ($(this).next().find('.check-rec').is(':checked')) {
    		$(this).parent().css({"opacity": "1"});
    	} else {
    		$(this).parent().css({"opacity": "0.9"});
    	}
      $(this).parent().removeClass("expanded");
    } else {
    	$(this).parent().css({"opacity": "1"});
      $(this).parent().addClass("expanded");
    }

    //if (trOpacity == '0.9'){
    //  $(this).parent().css({"opacity": "1"});
    //  $(this).parent().addClass("expanded");
    //} else if(trOpacity == '1') {
    //  $(this).parent().css({"opacity": "0.9"});
    //  $(this).parent().removeClass("expanded");
    //}

		$(this).find(".expand-icon").toggleClass("glyphicon-chevron-down").toggleClass("glyphicon-chevron-up");
	});

	// Individual checkbox click. DUPLICATE???
	$('.check-rec').bind('change', function() {
		var numChecked = $('.check-rec:checked').size();
		var maxChecked = $('.check-rec').size();

		// change opacity
		var titleTr = $(this).closest(".app-table-tr");
    var trOpacity = titleTr.css('opacity');

    if (!$(this).closest(".app-table-tr").hasClass("expanded")) {
      if ($(this).is(':checked')) {
        $(this).closest(".app-table-tr").css({"opacity": "1"});
      } else {
        $(this).closest(".app-table-tr").css({"opacity": "0.9"});
      }
    }
			 
		if ($('#btnDelete').hasClass("disabled") && numChecked > 0) {       
		  	$('#btnDelete').removeClass("disabled");
		 } else if (numChecked == 0) { // disable delete when 0 checked
		  	$('#btnDelete').addClass("disabled");
		 } else if (numChecked < maxChecked) { // not all checked
				$('#check-all').prop("checked", false);
		} else if (numChecked == maxChecked) { //checkall when all checked
				$('#check-all').prop("checked", true);
		}
	});

});