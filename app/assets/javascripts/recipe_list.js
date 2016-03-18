$(document).ready(function() {
  	// delete all of the recipes with the box checked
    $("#btnDelete").click(function() {
      var selected = [];
      // gather the id of all checked recipes
      $('.check-rec:checked').each(function() {
      	var id = $(this).closest('tr').find('#recipe_id').val();
        selected.push(id);
      });
      // Send the ids to delete_multiple through ajax
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

    $('.btn-edit-recipe').click(function() {
      var recBox = $(this).closest('.recipe-box');
      var title = recBox.find('#rec-title');
      var ingredients = recBox.find('#rec-ingredients');
      var directions = recBox.find('#rec-directions');
      var tags = recBox.find('#rec-tags');
      var id = recBox.find('#recipe_id').val();
      
      console.log(title.text());

      if($(this).hasClass('btn-save-updated')){
        $(this).removeClass('btn-save-updated');

        $(this).text('Edit');

        title.attr('contenteditable', 'false');
        ingredients.attr('contenteditable', 'false');
        directions.attr('contenteditable', 'false');
        tags.attr('contenteditable', 'false');


        var json = JSON.stringify({title: title.text(), ingredients: ingredients.text(), directions: directions.text()});

        $.ajax({
          url: "/recipes/update/" + id,
          method: "POST",
          data: {recipe: json},
          timeout: 5500,
          success: function() {
            location.reload();
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log("an error has occured");
            console.log(textStatus);
            console.log(errorThrown);
          }
        });
      } else {
        $(this).addClass('btn-save-updated');

        $(this).text('Save');

        title.attr('contenteditable', 'true');
        ingredients.attr('contenteditable', 'true');
        directions.attr('contenteditable', 'true');
        tags.attr('contenteditable', 'true');

      }
      
    });

    $('.btn-save-updated').click(function() {
      

    });

  });