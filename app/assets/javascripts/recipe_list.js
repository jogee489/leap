$(document).ready(function() {
  	// delete all of the recipes with the box checked
    $("#btnDelete").click(function() {

      var selected = [];

      // gather the id of all checked recipes
      $('.check-rec:checked').each(function() {

      	var id = $(this).closest('tr').find('#recipe_id').val();

        selected.push(id);
      });

      //console.log(selected);

      
      $.ajax({
        url: "/recipes/destroy_multiple/",
       	method: "POST",
      	data: {recipe_ids: JSON.stringify(selected)},
        timeout: 5500,
        success: function() {
          console.log("success");
				},
      	error: function(jqXHR, textStatus, errorThrown) {
        	console.log("an error has occured");
        	console.log(textStatus);
        	console.log(errorThrown);
        }
			});
      if(selected.length>0)
        location.reload();
			
    });
		
		// Toggle check boxes: check all checkboxes and enable delete button.
		// $("#check-all").bind('change', function() {
		// 	$('.check-rec').prop('checked', $("#check-all").is(':checked'));
		// 	var numChecked = $('.check-rec:checked').size();
		// 	if (numChecked == 0) {
		// 		$('#btnDelete').addClass("disabled");
		// 	} else if ($(this).prop("checked")) { // Ensure delete enabled when checked.
		// 		$('#btnDelete').removeClass("disabled");
		// 	}
		// });

		$('.update-button').click(function(event) {
			var div = $(this).closest(".recipeDetails");
			var title = div.find("#title").val();
			var ingredients = div.find("#ingredients").val();
			var directions = div.find("#directions").val();
			var id = div.find("#recipe_id").val();
			var json = JSON.stringify({title: title, ingredients: ingredients, directions: directions});
			console.log(json);
			$.ajax({
        url: "/recipes/update/" + id,
       	method: "POST",
      	data: {recipe: json},
        timeout: 5500,
        success: function() {
          console.log("success");
          div
				},
      	error: function(jqXHR, textStatus, errorThrown) {
        	console.log("an error has occured");
        	console.log(textStatus);
        	console.log(errorThrown);
        }
			});
		});

  });