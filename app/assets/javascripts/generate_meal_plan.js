$(document).ready(function () {
    // Render starting point on load.
    renderSelectFoods();

    var navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content');
            
    allWells.hide();

    // Go to a new step when nav item clicked.
    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this);

        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-primary').addClass('btn-default');
            $item.addClass('btn-primary');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
        }
    });

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
    updateStepLink("step-1");
    $.ajax({
        url: "/search/select_foods/",
        method: "GET",
        dataType: "html",
        timeout: 5000,
        success: function(data) {
            console.log("success");
            $("#step-1").html(data);
            $("#step-1").show();
            $("#step-2").hide();
            $("#step-3").hide();
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
    updateStepLink("step-2");
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
            $("#step-1").hide();
            $("#step-2").html(data);
            $("#step-2").show();
            $("#step-3").hide();
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
    updateStepLink("step-3");
    $.ajax({
        url: "/search/generate_meal_plan/",
        method: "GET",
        dataType: "html",
        timeout: 5000,
        success: function(data) {
            console.log("success");
            $("#step-1").hide();
            $("#step-2").hide();
            $("#step-3").html(data);
            $("#step-3").show();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("an error has occured");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

/* Ensure the setup wizard links have the proper classes */
function updateStepLink(stepNumber) {
    $('div.setup-panel div a').removeClass('btn-primary').addClass('btn-default');
    $('.stepwizard-step a[href="#' + stepNumber + '"]').addClass('btn-primary').removeClass('disabled');
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