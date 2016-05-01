$(document).ready(function () {

    /* Logic for moving onto the next step. */
    $('#btn-find-food-next').click(function() {
      renderGenerateMealPlan();
    });

    /* Add selected recipes to the specified section of the meal plan */
    $('button.option').click(function() {
      // Get meal name and option. eg. breakfast option 2.
      var option = this.id.split("-")[1];
      // Get the ids of recipes currently included.
      var current_ids = [];
      $('ul#recipe-id-list li').each(function() {
        current_ids.push($(this).text());
      });
      // Get the list of recipes in the meal option.
      var current_recipes = [];
      $('.modal-body #' + option + ' li').each(function() {
        current_recipes.push($(this).text());
      });

      var selected_id = [];
      var selected_recipe_names = [];
      // gather the ids and names of all checked recipes
      $('.check-rec:checked').each(function() {
        var recipe_id = $(this).closest('tr').find('#recipe_id').val();
        var recipe_name = $(this).closest('tr').find('td').find('label').text();
        selected_recipe_names.push(recipe_name);
        selected_id.push(recipe_id);
        $(this).prop('checked', false);
        $(this).closest(".app-table-tr").css({"opacity": "0.9"});
      });

      // Add selcted recipes to desired meal
      $(selected_recipe_names).each(function(index, value) {
        // Do not allow duplicates in a meal option.
        if ($.inArray(selected_recipe_names[index], current_recipes) == -1) {
          $('<li>').text(value).addClass("food-item list-group-item").appendTo(".modal-body #" + option);
        }
        // Add id to the list if the recipe is unique.
        if ($.inArray(selected_id[index], current_ids) == -1) {
          $('<li>').text(selected_id[index]).appendTo('#recipe-id-list');
        }

        /* Attack onclick to highlight food item when clicked. */
        $('div.modal-body .food-item').unbind('click').click(function() {
          $(this).toggleClass('highlight-item');
          var numChked = $('div.modal-body .highlight-item').size();
          if(numChked) {
            $('#btn-delete-preview').removeClass("disabled");
          } else if (numChked == 0) {
            $('#btn-delete-preview').addClass("disabled");
          }
        });
        
      }); 

    });
  });