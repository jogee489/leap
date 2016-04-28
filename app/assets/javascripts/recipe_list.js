/**
 * recipe_list.js contains all the javascript associated with displaying,
 * and handling events on the recipe_list page.
 */
$(document).ready(function() {
  	/* delete all of the recipes with the box checked */
    $("#btn-delete-recipes").click(function() {
      if (confirm("Are you sure you want to delete the selected Recipes?")) {

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
        if (selected.length > 0) {
          location.reload();
        }
      }
    });

  /* Individual checkbox click. */
  $('.check-rec').bind('change', function() {
    var numChecked = $('.check-rec:checked').size();
    var maxChecked = $('.check-rec').size();
    var parentTr = $(this).parent().parent().parent();

    var row = $(this).closest("tr");
       
    if ($('#btn-delete-recipes').hasClass("disabled") && numChecked > 0) {       
        $('#btn-delete-recipes').removeClass("disabled");
        //row.css({"opacity": "1"});
     } else if (numChecked == 0) { // disable delete when 0 checked
        $('#btn-delete-recipes').addClass("disabled");
        //.css({"opacity": "0.9"});
     } else if (numChecked < maxChecked) { // not all checked
        $('#check-all').prop("checked", false);
    } else if (numChecked == maxChecked) { //checkall when all checked
        $('#check-all').prop("checked", true);
    }
  });

  /* Logic for saving a recipe and it's information */
  $('.btn-save-recipe').click(function() {
    var recBox = $(this).closest('.recipe-box');
    var title = recBox.find('.rec-title').val();
    var ingredients = recBox.find('.rec-ingredients').val();
    var directions = recBox.find('.rec-directions').val();
    var tags = recBox.find('.rec-tags').val();
    
    if(!validateRecipe(title, ingredients, directions)){
      alert("Please fill out all required fields");
      return;
    }

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

  /* Logic for enabling editing of a specific recipe */
  $('.btn-edit-recipe').click(function() {
    var recBox = $(this).closest('.recipe-box');
    var title = recBox.find('.rec-title');
    var ingredientsList = recBox.find('.rec-ingredients').find('li');
    var directions = recBox.find('.rec-directions');
    var tags = recBox.find('.rec-tags');
    var id = recBox.find('#recipe_id').val();
    
    if($(this).hasClass('btn-save-updated')){

      var ingredientsTextArea = recBox.find('textarea.rec-ingredients');

      //if one of the required fields are empty, don't allow the save
      if(!validateRecipe(title.val(), ingredientsTextArea.val(), directions.val())){
        alert("Please fill out all required fields");
        return;
      }

      //ensure that the title wasn't changed
      var titleBar = recBox.closest('tr').prev().find('label');
      //if it was, set the titleBar's value to the newTitle
      if(titleBar.text() != title.val()){
        titleBar.text(title.val());
      }

      // scroll all textareas to top
      $("textarea").each(function(){
        $(this).scrollTop(0);
      });
      
      $(this).removeClass('btn-save-updated');
      $(this).html('Edit <span class="glyphicon glyphicon-edit"></span>');
      title.css({"border": "none"});
      ingredientsTextArea.css({"border": "none"});
      directions.css({"border": "none"});
      tags.css({"border": "none"});

      title.prop("readonly", true);
      ingredientsTextArea.prop("readonly", true);
      directions.prop("readonly", true);
      tags.prop("readonly", true);

      $("h1").each(function(){
        if ($(this).text() != 'Tags') {
          $(this).html($(this).html().replace("*",""));
        }
      });

      var json = JSON.stringify({title: title.val(), ingredients: ingredientsTextArea.val(), directions: directions.val(), tags: tags.val()});
      
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

      var ingredients = "";
    
      for(var i = 0; i < ingredientsList.length; i++){
        if(i != ingredientsList.length - 1){
          ingredients += (ingredientsList[i].innerText + "\n");
        }
        else {
          ingredients += (ingredientsList[i].innerText);
        }
      }
      //if the textarea does not exist, convert the ingredients list to an editable textarea
      if(!recBox.find('textarea.rec-ingredients').length){
        var ingredientsTextArea = $("<textarea class='form-control rec-ingredients'></textarea>").text(ingredients);
        ingredientsList.closest('ul').after(ingredientsTextArea);
        ingredientsList.closest('ul').hide();
      }
      else {
        var ingredientsTextArea = recBox.find('textarea.rec-ingredients');
      }
    
      
      $(this).addClass('btn-save-updated');
      $(this).html('Save <span class="glyphicon glyphicon-save"></span>');
      title.css({"border":"rgb(193, 224, 255) 1px solid"});
      ingredientsTextArea.css({"border":"rgb(193, 224, 255) 1px solid"});
      directions.css({"border":"rgb(193, 224, 255) 1px solid"});
      tags.css({"border":"rgb(193, 224, 255) 1px solid"});



      title.prop("readonly", false);
      ingredientsTextArea.prop("readonly", false);
      directions.prop("readonly", false);
      tags.prop("readonly", false);

      title.focus();

      $("h1").each(function(){
        if ($(this).text() != 'Tags') {
          $(this).text('*' + $(this).text());
        }
      });
      
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

    function validateRecipe(title, ingredients, directions){
      if(title.trim() == "" || ingredients.trim() == "" || directions.trim() == ""){
        return false;
      }

      else {
        return true;
      }

    }
});