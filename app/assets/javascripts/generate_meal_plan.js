/**
 * Javascript file for rendering and handling events
 * on the generate meal plan page.
 */
$(document).ready(function () {

  var amountScrolled = 300;
  // Render starting point on load.
  renderSelectFoods();
  $('.setup-content').hide();

  $(window).scroll(function() {
    if ( $(window).scrollTop() > amountScrolled ) {
      $('.btn-back-to-top').fadeIn('slow');
    } else {
      $('.btn-back-to-top').fadeOut('slow');
    }
  });

  $('.btn-back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 700);
    return false;
  });

  /** Logic for expanding food item list. */
  $(".expand-td").unbind('click').click(function() {
    $(this).parent().next().toggle('slow');
    $(this).toggleClass("expanded"); // Put opacity change in this class
    $(this).find(".expand-icon").toggleClass("glyphicon-chevron-down").toggleClass("glyphicon-chevron-up");
  });

  /* Go to a new step when nav item clicked. */
  $('button.step-app').click(function () {
    var target = $(this).find('a').attr('href');
    if (target == "#step-2") {
      renderFindRecipes();
    } else if (target == "#step-3") {
      renderGenerateMealPlan();
    } else {
      showCurrentStep(target);
    }
    // reset stepwizard font weight to normal.
    $('.stepwizard-step').find('button').css({"font-weight": "normal"});
    $('.stepwizard-step').find('p').css({"font-weight": "normal"});
    // set stepwizard font to bold.
    $(this).css({"font-weight": "bold"});
    $(this).next().css({"font-weight": "bold"});
  });

  // If a recipe in the preview meal plan gets clicked.
  // handles delete event in recipe preview table.
  $('#btn-delete-preview').on('click', function() {
   var actives = $('li.highlight-item');
   actives.remove();
   $(this).addClass('disabled');
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
    var avoid_items = [];
    $('.have-list').find('li').each(function() {
        food_items.push($(this).text());
    });
    $('.avoid-list').find('li').each(function() {
        avoid_items.push($(this).text());
    });
    // Send food_items to find_recipes
    $.ajax({
        url: "/search/find_recipes/",
        method: "POST",
        dataType: "html",
        data: {food_items: JSON.stringify(food_items),
               avoid_items: JSON.stringify(avoid_items)},
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
    var brkOp1 = [];
    $('.modal-body #brkOp1 li').each(function() {
        brkOp1.push($(this).text());
    });
    var brkOp2 = [];
    $('.modal-body #brkOp2 li').each(function() {
        brkOp2.push($(this).text());
    });
    var brkOp3 = [];
    $('.modal-body #brkOp3 li').each(function() {
        brkOp3.push($(this).text());
    });
    var snk1Op1 = [];
    $('.modal-body #snk1Op1 li').each(function() {
        snk1Op1.push($(this).text());
    });
    var snk1Op2 = [];
    $('.modal-body #snk1Op2 li').each(function(e) {
        snk1Op2.push($(this).text());
    });
    var snk1Op3 = [];
    $('.modal-body #snk1Op3 li').each(function() {
        snk1Op3.push($(this).text());
    });
    var lnhOp1 = [];
    $('.modal-body #lnhOp1 li').each(function() {
        lnhOp1.push($(this).text());
    });
    var lnhOp2 = [];
    $('.modal-body #lnhOp2 li').each(function() {
        lnhOp2.push($(this).text());
    });
    var lnhOp3 = [];
    $('.modal-body #lnhOp3 li').each(function() {
        lnhOp3.push($(this).text());
    });
    var snk2Op1 = [];
    $('.modal-body #snk2Op1 li').each(function() {
        snk2Op1.push($(this).text());
    });
    var snk2Op2 = [];
    $('.modal-body #snk2Op2 li').each(function() {
        snk2Op2.push($(this).text());
    });
    var snk2Op3 = [];
    $('.modal-body #snk2Op3 li').each(function() {
        snk2Op3.push($(this).text());
    });
    var dnrOp1 = [];
    $('.modal-body #dnrOp1 li').each(function() {
        dnrOp1.push($(this).text());
    });
    var dnrOp2 = [];
    $('.modal-body #dnrOp2 li').each(function() {
        dnrOp2.push($(this).text());
    });
    var dnrOp3 = [];
    $('.modal-body #dnrOp3 li').each(function() {
        dnrOp3.push($(this).text());
    });


    // JSONify the parameters to be sent.
    var data = JSON.stringify({to_have: foodsToHave, to_avoid: foodsToAvoid, recipe_ids: idList,
            brkOp1: brkOp1, brkOp2: brkOp2, brkOp3: brkOp3, snk1Op1: snk1Op1, snk1Op2: snk1Op2,
            snk1Op3: snk1Op3, lnhOp1: lnhOp1, lnhOp2: lnhOp2, lnhOp3: lnhOp3, snk2Op1: snk2Op1,
            snk2Op2: snk2Op2, snk2Op3: snk2Op3, dnrOp1: dnrOp1, dnrOp2: dnrOp2, dnrOp3: dnrOp3});
    $.ajax({
        url: "/search/generate_meal_plan/",
        method: "POST",
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
    stepFontWeightChange(stepName);
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

function stepFontWeightChange(stepName){
    // reset stepwizard font weight to normal.
    $('.stepwizard-step').find('button').css({"font-weight": "normal"});
    $('.stepwizard-step').find('p').css({"font-weight": "normal"});
    // set stepwizard font to bold.
    $('#' + stepName).css({"font-weight": "bold"});
    $('#' + stepName).next().css({"font-weight": "bold"});
}