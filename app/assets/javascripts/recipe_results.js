$(document).ready(function() {

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
      // Gather the information of all of the selected recipes.
      $(".check-rec:checked").each(function() {
        var recipeData = $(this).closest("tr").next();
        var title = recipeData.find(".rec-title").val();
        var directions = recipeData.find(".rec-directions").val();
        var tags = recipeData.find(".rec-tags").val();
        var ingredients = ingredientsToString(recipeData.find("li"));
        
        // Add JSON of recipe to the recipe list.
        var recipeJSON = JSON.stringify({title: title, ingredients: ingredients, directions: directions, tags: tags});
        recipeList.push(recipeJSON);
      });
      // Send recipe list to recipe controller.
      $.ajax({
        url: "/recipes/save_recipe_list",
        method: "POST",
        dataType: "json",
        data: {recipeList: recipeList},
        timeout: 5500,
        /* Getting error 'unexpected end of input' in json parser.*/
        success: function(data) {
          console.log("success");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("an error has occured");
            console.log(textStatus);
            console.log(errorThrown);
        },
        complete: function() {
          // Redirect to manage recipes if no more recipes in list.
          checkListSize();
        }
      });
      // Removed saved recipes from list
      $('.check-rec:checked').each(function() {
        var tableRow = $(this).closest("tr");
        tableRow.next().remove();
        tableRow.remove();
      });
    });

    /* Enable editing of recipes */
    $('.btn-edit-recipe').click(function() {
      var recBox = $(this).closest('.recipe-box');
      var title = recBox.find('.rec-title');
      var ingredientsUL = recBox.find('.rec-ingredients');
      var directions = recBox.find('.rec-directions');
      var tags = recBox.find('.rec-tags');
      var id = recBox.find('#recipe_id').val();

      // scroll all textareas to top
      $("textarea, ul").each(function(){
        $(this).scrollTop(0);
    });

    var ingredients = ingredientsToString(ingredientsUL.find('li'));
    
    if ($(this).hasClass('btn-save-updated')) {
      // If one of the required fields are empty, don't allow the save
      if (!validateRecipe(title.val(), ingredients, directions.val())) {
        alert("Please fill out all required fields");
        return;
      }

      // Ensure that the title wasn't changed
      var titleBar = recBox.closest('tr').prev().find('label');
      // If it was, set the titleBar's value to the newTitle
      if (titleBar.text() != title.val()) {
        titleBar.text(title.val());
      }

      // Update the style.
      $(this).removeClass('btn-save-updated');
      $(this).html('Edit <span class="glyphicon glyphicon-edit"></span>');
      title.css({"border": "none"});
      ingredientsUL.css({"border": "none"});
      directions.css({"border": "none"});
      tags.css({"border": "none"});
      title.prop("readonly", true);
      ingredientsUL.attr("contenteditable", "false");
      directions.prop("readonly", true);
      tags.prop("readonly", true);

      recBox.find("h1").each(function(){
        if ($(this).text() != 'Tags') {
          $(this).html($(this).html().replace("* ",""));
        }
      });
      
    } else {
      $(this).addClass('btn-save-updated');
      $(this).html('Save <span class="glyphicon glyphicon-save"></span>');
      title.css({"border":" rgb(193, 224, 255) 1px solid"});
      ingredientsUL.css({"border":" rgb(193, 224, 255) 1px solid"});
      directions.css({"border":" rgb(193, 224, 255) 1px solid"});
      tags.css({"border":" rgb(193, 224, 255) 1px solid"});

      title.prop("readonly", false);
      ingredientsUL.attr("contenteditable", "true");
      directions.prop("readonly", false);
      tags.prop("readonly", false);

      title.focus();

      recBox.find("h1").each(function() {
        if ($(this).text() != 'Tags') {
          $(this).text('* ' + $(this).text());
        }
      });
      
    }     
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

  /* Handle select all pressed */
  $(".btn-select-all").click(function() {
    var selectAll = $(this);
    // Select all when text is 'Select All' otherwise deselect all.
    if (selectAll.is(':has(span.glyphicon-unchecked)')) {
      $(".check-rec").prop('checked', true);
      selectAll.html('Select All <span class="glyphicon glyphicon-check"></span>');
      $(".btn-select-all").parent().next().find(".app-table-tr").css({"opacity": "1"});
      // Enable delete and save if they are disabled.
      if ($('#btn-delete-recipes').hasClass("disabled")) {
        $('#btn-delete-recipes').removeClass("disabled");
        $('#btn-save-recipes').removeClass("disabled");
      }
    } else {
      selectAll.html('Select All <span class="glyphicon glyphicon-unchecked"></span>');
      $(".btn-select-all").parent().next().find(".app-table-tr").css({"opacity": "0.9"});
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

/**
 * Ensure that the required recipe inputs are not blank.
 *
 * @params title the title to check
 * @params ingredients the ingredients to check
 * @params directions the directions to check
 */
function validateRecipe(title, ingredients, directions) {
  if (title.trim() == "" || ingredients.trim() == "" || directions.trim() == "") {
    return false;
  } else {
    return true;
  }
}

/**
 * Take the ingredients list and convert it to a string to be saved.
 *
 * @params ingredientsList the list of the ingredient.
 */
function ingredientsToString(ingredientsList) {
  var ingredients = '';
  // Add each ingredient to the ingredients.
  for (var i = 0; i < ingredientsList.length; i++) {
    if(i != ingredientsList.length - 1){
      ingredients += (ingredientsList[i].innerText + "\n");
    } else {
      ingredients += (ingredientsList[i].innerText);
    }
  }
  return ingredients;
}
