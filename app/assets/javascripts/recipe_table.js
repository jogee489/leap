// Logic for expanding and contracting recipe details.
$(document).ready(function() {
	// Logic for expanding recipe details when + or - is pressed.
    $(".expand").click(function() {
      $(this).closest("tr").next(".recipeDetails").toggle('slow');
      $(this).toggleClass("glyphicon-chevron-down");
      $(this).toggleClass("glyphicon-chevron-up");
    }); 

});