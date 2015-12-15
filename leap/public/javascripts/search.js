/*************************************************************************
 * Javascript functions associated with the search controllers and views *
 *************************************************************************/

$(document).ready(function() {
	// press search button when enter is pressed
	$('#search').keypress(function(e) {
		if(e.keyCode==13) {
			$('#searchButton').click();
		}
	});
});

/**
 * Fucntion for ajax calling the webcrawler and scraping data to be rendered on the page.
 */
function searchRecipe() {
	var searchString = $("#search").val();
	if (!isBlank(searchString)) {
		$("#recipe").html("<div>searching for recipes....</div>");
		$.ajax({
	        url: '/search/show?searchString=' + searchString,
	        cached: 'false',
	        success: function(html) {
	            $("#recipe").html(html);
	            $("#search").val("");
	        },
	        error: function(data) {
	            console.log("An error has occured.\n" + data);
	        }
		});
	}
}

/*
function saveRecipe(recipe){
	console.log(recipe);
	$.ajax({
		url: '/search/saveRecipe?recipe=' + recipe,
		cached: 'false',
		success: function(html) {
			alert("Recipe Saved");
			$("#save-button-" + index).disable();
		},
		error: function(data) {
			console.log("An error has occured.\n" + data);
		}
	});
}*/