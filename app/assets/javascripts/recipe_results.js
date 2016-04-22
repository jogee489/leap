$(document).ready(function() {
    
    // Logic for saving a single recipe.
    $(".btn-save-recipe").click(function() {

      var div = $(this).closest(".recipeDetails");
      var title = div.find(".rec-title").val();
      var ingredients = div.find(".rec-ingredients").find('li').val();
      console.log(ingredients);
      var directions = div.find(".rec-directions").val();
      var tags = div.find(".rec-tags").val();
      var recipeJSON = JSON.stringify({title: title, ingredients: ingredients, directions: directions, tags: tags});
      $.ajax({
        url: "/recipes/save_recipe_json",
        method: "POST",
        data: {recipe: recipeJSON},
        timeout: 5500,
        success: function() {
          console.log("success");
          div.prev().hide();
          div.hide();
          div.html("Saved Successfully!");
          div.fadeIn("slow");
          div.fadeOut("slow");
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log("an error has occured");
          console.log(textStatus);
          console.log(errorThrown);
        }
      });
    });

    // Remove the selected recipes.
    $("#btn-delete-recipes").click(function() {
      if(confirm("Are you sure you want to delete the selected Recipes?")){

        $('.check-rec:checked').each(function() {
          var tableRow = $(this).closest("tr");
          tableRow.next().remove();
          tableRow.remove();
          checkListSize();
        });
      }
    });

    // Save the selected recipes.
    $("#btn-save-recipes").click(function() {
      var recipeList = [];
      $(".check-rec:checked").each(function() {
        var recipeData = $(this).closest("tr").next();
        var title = recipeData.find(".rec-title").text();
        var ingredientsList = recipeData.find("li");
        console.log(ingredients);
        var directions = recipeData.find(".rec-directions").text();
        var tags = recipeData.find(".rec-tags").text();

        var ingredients = "";

        for(var i = 0; i < ingredientsList.length; i++){
          if(i != ingredientsList.length - 1){
            ingredients += (ingredientsList[i].innerText + "\n");
          }
          else {
            ingredients += (ingredientsList[i].innerText);
          }
        }

        console.log(ingredients);


        var recipeJSON = JSON.stringify({title: title, ingredients: ingredients, directions: directions, tags: tags});
        recipeList.push(recipeJSON);
      });
      $.ajax({
        url: "/recipes/save_recipe_list",
        method: "POST",
        dataType: "json",
        data: {recipeList: recipeList},
        timeout: 5500,
        success: function(data) {
          console.log("success");
          // Redirect to manage recipes if no more recipes in list.
          checkListSize();
        },
        error: function(error) {
          console.log(error);
        },
      });
      // Removed saved recipes from list
      $('.check-rec:checked').each(function() {
        var tableRow = $(this).closest("tr");
        tableRow.next().remove();
        tableRow.remove();
      });
    });

    $('.btn-edit-recipe').click(function() {
      var recBox = $(this).closest('.recipe-box');
      var title = recBox.find('.rec-title');
      var ingredients = recBox.find('.rec-ingredients');
      var directions = recBox.find('.rec-directions');
      var tags = recBox.find('.rec-tags');

      console.log(recBox);
      console.log(title);
      console.log(ingredients);
      
      if($(this).hasClass('btn-save-updated')){
        $(this).removeClass('btn-save-updated');

        $(this).html('Edit <span class="glyphicon glyphicon-edit"></span>');

        title.attr('contenteditable', 'false');
        ingredients.attr('contenteditable', 'false');
        directions.attr('contenteditable', 'false');
        tags.attr('contenteditable', 'false');

        title.css({"border": "none"});
        ingredients.css({"border": "none"});
        directions.css({"border": "none"});
        tags.css({"border": "none"});

      } else {
        $(this).addClass('btn-save-updated');

        $(this).html('Save <span class="glyphicon glyphicon-save"></span>');

        title.attr('contenteditable', 'true');
        ingredients.attr('contenteditable', 'true');
        directions.attr('contenteditable', 'true');
        tags.attr('contenteditable', 'true');

        title.css({"border-color": "#C1E0FF", 
             "border-width":"1px", 
             "border-style":"solid"});
        ingredients.css({"border-color": "#C1E0FF", 
             "border-width":"1px", 
             "border-style":"solid"});
        directions.css({"border-color": "#C1E0FF", 
             "border-width":"1px", 
             "border-style":"solid"});
        tags.css({"border-color": "#C1E0FF", 
             "border-width":"1px", 
             "border-style":"solid"});

      }
      
    });

    // Save all the recipes.
    $(".save-all-recipes").click(function() {
      // create JSON to hold all recipe information
      var recipeList = [];
      $(".recipeDetails").each(function() {
        var title = $(this).find(".rec-title").val();
        var ingredients = $(this).find(".rec-ingredients").val();
        var directions = $(this).find(".rec-directions").val();
        var tags = $(this).find(".rec-tags").val();
        var recipeJSON = JSON.stringify({title: title, ingredients: ingredients, directions: directions});
        console.log(title);
        recipeList.push(recipeJSON);
      });
      $.ajax({
        url: "/recipes/save_recipe_list",
        method: "POST",
        dataType: "json",
        data: {recipeList: recipeList},
        timeout: 5500,
        success: function(data) {
          console.log("success");
        },
        error: function(error) {
          console.log("an error has occured\n" + error);
          console.log(error);
        },
      });
    });

    // Handle class changes when individual checkbox pressed.
    $(".check-rec").bind('change', function() {
      var numChecked = $('.check-rec:checked').size();
      var maxChecked = $('.check-rec').size();
      // Remove disabled class if recipes selected and has class disabled
      if ($('#btn-delete-recipes').hasClass("disabled") && numChecked > 0) {
        $('#btn-delete-recipes').removeClass("disabled");
        $('#btn-save-recipes').removeClass("disabled");
       } else if (numChecked == 0) { // disable delete when none checked
        $('#btn-delete-recipes').addClass("disabled");
        $('#btn-save-recipes').addClass("disabled");
       }
       // Update select all button
       if (numChecked == maxChecked){
        $(".btn-select-all").html('Select All <span class="glyphicon glyphicon-check"></span>');
       } else {
        $(".btn-select-all").html('Select All <span class="glyphicon glyphicon-unchecked"></span>');
       }
    });

    // Select all pressed.
    $(".btn-select-all").click(function() {
      var ingredients = $(document).find('li.ingredient');
      console.log(ingredients);

      for(var i = 0; i < ingredients.length; i++){
        console.log(ingredients[i].innerText);
      }

      var selectAll = $(".btn-select-all");
      // Select all when text is 'Select All' otherwise deselect all.
      if ($(this).is(':has(span.glyphicon-unchecked)')) {
        $(".check-rec").prop('checked', true);
        selectAll.html('Select All <span class="glyphicon glyphicon-check"></span>');
        // Enable delete and save if they are disabled.
        if ($('#btn-delete-recipes').hasClass("disabled")) {
          $('#btn-delete-recipes').removeClass("disabled");
          $('#btn-save-recipes').removeClass("disabled");
        }
      } else {
        selectAll.html('Select All <span class="glyphicon glyphicon-unchecked"></span>');
        $(".check-rec").prop('checked', false);
        $('#btn-delete-recipes').addClass("disabled");
        $('#btn-save-recipes').addClass("disabled");
      }
    });

    /** Search for more recipes and replace the current recipe table */
    $('#btn-search-again').click(function() {
      var recipe_links = $('#recipe_links').val();
      $.ajax({
        type: "POST",
        url: "/recipes/search_again",
        timeout: 0,
        dataType: 'json',
        data: { recipe_links: recipe_links },
        success: function(data) {
          window.location.replace("/recipes/display_online_results?recipe_links=" + data.recipe_links)
        },
        error: function() {
          alert("No additional recipes were found");
        }
      });
    });

  });
/**
 * Check the size of the recipe list. Redirect to the manage recipes page when
 * no more recipes are present.
*/
function checkListSize() {
  console.log("checking size...")
  if ($(".check-rec").length == 0) {
     window.location.replace("/recipes/list");
  }
}
