$(document).ready(function() {
    
    // Logic for saving a single recipe.
    $(".save-recipe").click(function() {
      var div = $(this).closest(".recipeDetails");
      var title = div.find("#title").val();
      var ingredients = div.find("#ingredients").val();
      var directions = div.find("#directions").val();
      var recipeJSON = JSON.stringify({title: title, ingredients: ingredients, directions: directions});
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

    // Remove a singlular recipe
    $(".remove-recipe").click(function() {
      var detailsTable = $(this).closest(".recipeDetails");
      detailsTable.prev().fadeOut();
      detailsTable.fadeOut();
    });

    // Save all the recipes.
    $(".save-all-recipes").click(function() {
      // create JSON to hold all recipe information
      var recipeList = [];
      $(".recipeDetails").each(function() {
        var title = $(this).find("#title").val();
        var ingredients = $(this).find("#ingredients").val();
        var directions = $(this).find("#directions").val();
        var recipeJSON = JSON.stringify({title: title, ingredients: ingredients, directions: directions});
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
        complete: function() {
        }
      });
    });
  });
