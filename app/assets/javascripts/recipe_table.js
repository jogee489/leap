// Logic for expanding and contracting recipe details.
$(document).ready(function() {
	// Logic for expanding recipe details when + or - is pressed.
    $(".expand-rec").click(function() {
      $(this).closest("tr").next(".recipeDetails").toggle('slow');
      $(this).toggleClass("glyphicon-chevron-down");
      $(this).toggleClass("glyphicon-chevron-up");
    }); 


	// Individual checkbox click.
	$('.check-rec').bind('change', function() {
		var numChecked = $('.check-rec:checked').size();
		var maxChecked = $('.check-rec').size();
			 
		if ($('#btnDelete').hasClass("btn-app-disabled") && numChecked > 0) {       
		  	$('#btnDelete').removeClass("btn-app-disabled");
		 } else if (numChecked == 0) { // disable delete when 0 checked
		  	$('#btnDelete').addClass("btn-app-disabled");
		 } else if (numChecked < maxChecked) { // not all checked
				$('#check-all').prop("checked", false);
		} else if (numChecked == maxChecked) { //checkall when all checked
				$('#check-all').prop("checked", true);
		}
	});

	
});