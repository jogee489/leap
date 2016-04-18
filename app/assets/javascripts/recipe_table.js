/**
 * recipe_table.js contains all the javascript associated with displaying,
 * and handling events on the recipe_table page.
 */

$(document).ready(function() {
	// Logic for expanding recipe details when + or - is pressed.
    $("tr.app-table-tr").click(function() {
      $(this).next(".app-table-details").toggle('slow');
      //$(this).css({"opacity": "1"}); // Should be handled by toggling a class
      $(this).toggleClass("expanded"); // Put opacity change in this class
      $(this).find(".expand-icon").toggleClass("glyphicon-chevron-down").toggleClass("glyphicon-chevron-up");
    });

    /* Stop the label from toggling the recipe view */
    $('label').click(function(event) {
    	event.stopPropagation(); //Prevents event from bubbling up.
    })

	// Individual checkbox click. DUPLICATE???
	$('.check-rec').bind('change', function() {
		var numChecked = $('.check-rec:checked').size();
		var maxChecked = $('.check-rec').size();
			 
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