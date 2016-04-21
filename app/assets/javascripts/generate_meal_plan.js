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
        showCurrentStep(target);
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

    // Get list of foods to have and to avoid.
    var foodsToHave = [];
    var foodsToAvoid = [];
    $('.have-list').find('li').each(function() {
        foodsToHave.push($(this).text());
    });
    $('.avoid-list').find('li').each(function() {
        foodsToAvoid.push($(this).text());
    });

    // Get the list of recipe ids to include.
    var idList = [];
    $('#recipe-id-list li').each(function() {
        idList.push($(this).text());
    });

    // Get recipes for each option
    var breakfast;

    // JSONify the parameters to be sent.
    var data = JSON.stringify({to_have: foodsToHave, to_avoid: foodsToAvoid, recipe_ids: idList});
    $.ajax({
        url: "/search/generate_meal_plan/",
        method: "GET",
        dataType: "html",
        timeout: 5000,
        data: {meal_plan_data: data},
        success: function(data) {
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
    $('div.setup-panel div a').addClass('btn-default');
    $('#' + stepName).removeClass('disabled');
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