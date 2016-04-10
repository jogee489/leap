$(document).ready(function() {
  	// delete all of the recipes with the box checked
    $("#btn-delete-recipes").click(function() {
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
		// 		$('#btn-delete-recipes').addClass("disabled");
		// 	} else if ($(this).prop("checked")) { // Ensure delete enabled when checked.
		// 		$('#btn-delete-recipes').removeClass("disabled");
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
    // fabio code
    var row = $(this).closest("tr");
       
    if ($('#btn-delete-recipes').hasClass("disabled") && numChecked > 0) {       
        $('#btn-delete-recipes').removeClass("disabled");
        row.css({"opacity": "1"});
     } else if (numChecked == 0) { // disable delete when 0 checked
        $('#btn-delete-recipes').addClass("disabled");
        row.css({"opacity": "0.9"});
     } else if (numChecked < maxChecked) { // not all checked
        $('#check-all').prop("checked", false);
    } else if (numChecked == maxChecked) { //checkall when all checked
        $('#check-all').prop("checked", true);
    }
  });

    $('.btn-save-recipe').click(function() {
      var recBox = $(this).closest('.recipe-box');
      var title = recBox.find('.rec-title').val();
      var ingredients = recBox.find('.rec-ingredients').val();
      var directions = recBox.find('.rec-directions').val();
      var tags = recBox.find('.rec-tags').val();
      var json = JSON.stringify({title: title, directions: directions, ingredients: ingredients, tags: tags});
      console.log(tags);
      $.ajax({
           url: "/recipes/save_recipe_json",
           method: "POST",
           data: {recipe: json},
           timeout: 5500,
           success: function() {
             console.log("success");
             location.reload();
           },
           error: function(jqXHR, textStatus, errorThrown) {
             console.log("an error has occured");
             console.log(textStatus);
             console.log(errorThrown);
           }
        });
    }); 

    $('.btn-edit-recipe').click(function() {
      var recBox = $(this).closest('.recipe-box');
      var title = recBox.find('.rec-title');
      var ingredients = recBox.find('.rec-ingredients');
      var directions = recBox.find('.rec-directions');
      var tags = recBox.find('.rec-tags');
      var id = recBox.find('#recipe_id').val();
      
      if($(this).hasClass('btn-save-updated')){
        $(this).removeClass('btn-save-updated');

        $(this).html('Edit <span class="glyphicon glyphicon-edit"></span>');

        title.css({"border": "none", "pointer-events": "none"});
        ingredients.css({"border": "none", "pointer-events": "none"});
        directions.css({"border": "none", "pointer-events": "none"});
        tags.css({"border": "none", "pointer-events": "none"});


        var json = JSON.stringify({title: title.val(), ingredients: ingredients.val(), directions: directions.val(), tags: tags.val()});

        $.ajax({
          url: "/recipes/update/" + id,
          method: "POST",
          data: {recipe: json},
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
      } else {
        $(this).addClass('btn-save-updated');

        $(this).html('Save <span class="glyphicon glyphicon-save"></span>');

        title.css({"border":"#C1E0FF 1px solid", "pointer-events":"auto"});
        ingredients.css({"border":"#C1E0FF 1px solid", "pointer-events":"auto"});
        directions.css({"border":"#C1E0FF 1px solid", "pointer-events":"auto"});
        tags.css({"border":"#C1E0FF 1px solid", "pointer-events":"auto"});
      }     
    });

    $('.title-toggle').click(function() {
      var searchBar = $('#search');
      searchBar.attr('placeholder', 'Tag Names');
    });

    $('.tag-toggle').click(function() {
      var searchBar = $('#search');
      searchBar.attr('placeholder', 'Recipe Title');
    });
});