$(function () {
  /*** Possibly move many methods to a new js files since they are also used by other paged. ***/
  /** Logic for calling webcrawling method */
  $('#btn-search-recipe').click(function() {

    var foodsToHaveList = $('.have-list').find('.food-item');
    var foodsToAvoidList = $('.avoid-list').find('.food-item');
    var avoidList = [];
    var haveList = [];
    // Add foods to avoid to avoidList
    foodsToAvoidList.each(function() {
      avoidList.push($(this).text());
    });
    //Add foods to have to haveList
    foodsToHaveList.each(function() {
      haveList.push($(this).text());
    });
    // Send request for recipes via ajax.
    $.ajax({
        type: "POST",
        url: "/recipes/search_online",
        timeout: 0,
        data: { foods_to_include: haveList,
                foods_to_exclude: avoidList },
        success: function() {
          window.location.replace("/recipes/display_online_results")
        }
      });
  });

  /** Highlight selected food item. */
  $('body').on('click', '.have-avoid-list .list-group-item', function () {
      $(this).toggleClass('highlight-item');
  });

  /** Move food items from have list to avoid list */
  $('#btn-move-right').click(function() {
    var $foodItems = $('ul.have-list li.highlight-item');
    // Check to see if food items need moved, return otherwise.
    if ($foodItems.length == 0) {
      return;
    }
    // Move food items to the avoid list.
    $foodItems.appendTo($('ul.avoid-list'));
    // Disable/enable buttons if appropriate.
    if ($('ul.have-list li').length == 0) {
      $('#delete-to-have').addClass('disabled');
    }
    $('#delete-to-avoid').removeClass('disabled');
  });

  /** Move food items from avoid list to have list */
  $('#btn-move-left').click(function() {
    var $foodItems = $('ul.avoid-list li.highlight-item');
    // Check to see if food items need moved, return otherwise.
    if ($foodItems.length == 0) {
      return;
    }
    // Move food items to the have list.
    $foodItems.appendTo($('ul.have-list'));
    // Disable/enable buttons if appropriate.
    if ($('ul.avoid-list li').length == 0) {
      $('#delete-to-avoid').addClass('disabled');
    }
    $('#delete-to-have').removeClass('disabled');
  });

  /******* I have no idea what this is used for **************/
  $('.dual-list .selector').click(function () {
    var $checkBox = $(this);
    if (!$checkBox.hasClass('highlight-item')) {
        $checkBox.addClass('highlight-item').closest('.well').find('ul li:not(.active)').addClass('active');
        $checkBox.children('i').removeClass('glyphicon-unchecked').addClass('glyphicon-check');
    } else {
        $checkBox.removeClass('highlight-item').closest('.well').find('ul li.active').removeClass('active');
        $checkBox.children('i').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
    }
  });

  /** Remove food items from either to have or to avoid list. */
  $('.panel-delete').click(function() {
    var $ul = $(this).parent().next();
    var highlighted = $ul.find('li.highlight-item');
    // Remove highlighted food items from list.
    highlighted.each(function() {
      $(this).remove();
    });
    // Disable this button if no more food items remain.
    if ($ul.children().length == 0) {
      $(this).addClass('disabled');
      // Disable buttons if both lists are empty.
      if ($('ul.have-avoid-list li').length == 0) {
        // Disable buttons
        $('#btn-move-left, #btn-move-right, #btn-search-recipe').addClass('disabled');
      }
    }
  });

  /** Show all items of a category. */
  $(".app-table-tr").click(function() {
    // Show that recipe detail clicked tr.
    $(this).next().toggle('fast');
    // Change gliphicon arrow up and down.
    var $id = $(this).find('.glyphicon');
    $id.toggleClass("glyphicon-chevron-up glyphicon-chevron-down");

    if ($id.hasClass("glyphicon-chevron-up")) {
      /* This should be handled by css, not js */
      $(this).css({"opacity": '1'});
    } else {
      /* This should be handled by css, not js */
      $(this).css({"opacity": '0.9'});
    }
  });

  /** Hightlist food items in category list and toggle have/avoid buttons. */
  $('.food-item').click(function() {
    $(this).toggleClass('highlight-item');
    var numChked = $('.highlight-item').size();
     if(numChked) {
       $('#btn-avoid, #btn-have').removeClass("disabled");
     } else if (numChked == 0) {
       $('#btn-avoid, #btn-have').addClass("disabled");
     }
  });

  /** Add selected foods to 'to have' list. */
  $('#btn-have').click(function() {
    $foodsToHaveList = retriveFoodItemList();
    $foodsToHaveList.clone().appendTo('ul.have-list');
    $('#delete-to-have').removeClass("disabled");
  });

  /** Add selected foods to 'to avoid' list. */
  $('#btn-avoid').click(function() {
    $foodsToAvoidList = retriveFoodItemList();
    $foodsToAvoidList.clone().appendTo($('ul.avoid-list'));
    $('#delete-to-avoid').removeClass("disabled");
  });
  
  /** Reload page when cancel button is pressed. */
  $('#btn-cancel-search').click(function() {
    location.reload();
  });

});

/**
 * Find list of highlighted food items that are not already in either the 'to have'
 * or 'to avoid' lists.
 *
 * @return A list of foodItems to be added to the 'to have' or 'to avoid' list.
 */
function retriveFoodItemList() {
  $foodItems = $('td li.highlight-item');
  currentFoods = []; // Array containing text of each food item

  $('ul.have-avoid-list li').each(function() {
    currentFoods.push($(this).text());
  });
  // Remove food items that are present in have/avoid list.
  $foodsToAdd = $foodItems.filter(function() {
    return $.inArray($(this).text(), currentFoods) === -1;
  });

  // Update classes of buttons and unhighlight food items.
  $foodItems.removeClass('highlight-item');
  $('#btn-have, #btn-avoid').addClass("disabled");
  $('#btn-move-left, #btn-move-right, #btn-search-recipe').removeClass("disabled");
  return $foodsToAdd;
}