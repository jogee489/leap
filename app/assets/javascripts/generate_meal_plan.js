/**
 * Javascript file for rendering and handling events
 * on the generate meal plan page.
 */

$(document).ready(function () {
    // Render starting point on load.
    renderSelectFoods();
    $('.setup-content').hide();

    /* Go to a new step when nav item clicked. */
    $('button.step-app').click(function () {
        var target = $(this).find('a').attr('href');
        console.log(target);
        showCurrentStep(target);
    });

    /* */
    $('div.setup-panel div a.btn-primary').trigger('click');
    // Add recipe title to proper position in the preview table.
    $('.add-to').on('click', function (){
      // Get button id.
      var btnId = this.id;
      // Get meal name and option. eg. breakfast option 2.
      var option = btnId.split("-")[1];
      // Get selected recipe name.
      var selected_id = [];
      var selected_recipe_names = [];
      // gather the ids and names of all checked recipes
      $('.check-rec:checked').each(function() {
        var recipe_id = $(this).closest('tr').find('#recipe_id').val();
        var recipe_name = $(this).closest('tr').find('td').find('label').text();

        selected_recipe_names.push(recipe_name);
        selected_id.push(recipe_id);
      });
      
      var i = 0
      $(selected_recipe_names).each(function() {
       var name = selected_recipe_names[i];
       i++;
       var aaa = $('<li/>') // TODO: Does this need to be in a var?
         .text(name)
         .addClass("food-item list-group-item")
         .appendTo("#" + option);
      });
    });

    // If a recipe in the preview meal plan gets clicked.
    // handles delete event in recipe preview table.
    $('#btn-delete-preview').on('click', function() {
     var actives = '';
     actives = $('li.highlight-item');
     actives.remove();
    });
     
});

/* Logic for rendering and showing step-1: select foods */
function renderSelectFoods() {
    updateStepLink("select-food-step");
    $.ajax({
        url: "/search/select_foods/",
        method: "GET",
        dataType: "html",
        timeout: 5000,
        success: function(data) {
            console.log("success");
            $("#step-1").html(data);
            showCurrentStep("#step-1");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("an error has occured");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

/* Logic for rendering and showing step-2: find recipes */
function renderFindRecipes() {
    updateStepLink("select-recipes-step");
    // Retrieve each food to have
    var food_items = [];
    $('.have-list').find('li').each(function() {
        food_items.push($(this).text());
    });
    // Send food_items to find_recipes
    $.ajax({
        url: "/search/find_recipes/",
        method: "POST",
        dataType: "html",
        data: {food_items: JSON.stringify(food_items)},
        timeout: 5000,
        success: function(data) {
            console.log("success");
            $("#step-2").html(data);
            showCurrentStep("#step-2");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("an error has occured");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

/* Logic for rendering and showing step-3: generate meal plan */
function renderGenerateMealPlan() {
    updateStepLink("generate-step");
    $.ajax({
        url: "/search/generate_meal_plan/",
        method: "GET",
        dataType: "html",
        timeout: 5000,
        success: function(data) {
            console.log("success");
            $("#step-3").html(data);
            showCurrentStep("#step-3");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("an error has occured");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
/* Display the proper divs for the current step */
function showCurrentStep(stepNumberDiv) {
    $('div.generate-container').hide();
    $(stepNumberDiv).show();
}

/* Ensure the setup wizard links have the proper classes */
function updateStepLink(stepName) {
    $('div.setup-panel div a').removeClass('btn-primary').addClass('btn-default');
    $('#' + stepName).addClass('btn-primary').removeClass('disabled');
}

function checkErrors() {
    $(".form-group").removeClass("has-error");
    for(var i = 0; i < curInputs.length; i++) {
        if (!curInputs[i].validity.valid) {
            isValid = false;
            $(curInputs[i]).closest(".form-group").addClass("has-error");
        }
    }
    if (isValid) {
        nextStepWizard.removeAttr('disabled').trigger('click');
    }
}