// Logic for expanding and contracting recipe details.
/*$(document).ready(function() {
	$(".expand").click(function() {
		$(this).closest("tr").next(".recipeDetails").toggle('slow');
		$(this).toggleClass("glyphicon-chevron-down");
	});

	// Handle checkboxes for the recipes.
	$('.check-rec').bind('change', function() {
		var numChecked = $('.check-rec:checked').size();
		var maxChecked = $('.check-rec').size();
		 
		if ($('#btnDelete').hasClass("disabled") && numChecked > 0) {       
	  	$('#btnDelete').removeClass("disabled");
	  } else if (numChecked == 0) { // disable delete when none selected
	  	$('#btnDelete').addClass("disabled");
	  } else if (numChecked < maxChecked) { // not all checkboxes checked.
			$('#check-all').prop("checked", false);
		} else if (numChecked == maxChecked) { // all are checked.
			$('#check-all').prop("checked", true);
		}
	});
});*/