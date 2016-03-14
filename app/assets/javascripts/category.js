$(document).click(function(e) {
    if (!$(e.target).is('.popup-marker', 'popup-image')) {
        $('.popup-marker').popover('hide');
    }
});
  var reloadPage = function() {
    location.reload();
  }     
  //hide the add field until the add button is clicked
  $(function() {
    selectRow();
    $('.input-group').hide()
  })
 

  //display add text field
  $(function () {
    $('.btn-add-food').off().click(function() {
      var menu = $(this).parent();
      var body = menu.parent();
      var list = body.find(".list-group");
      var textField = body.find(".input-group");
      var textBox = textField.find(".form-control")
      

      if(!textField.is(":visible")){
        list.animate({height: 176}, 0, function() {
          textField.toggle(400);
          textBox.focus();
        });
      } else {
        textField.toggle(400, function () {
          list.animate({height: 210}, 0);
       });
      }});
    });

  //function to add food item if text field is filled out
  $(function () {
    $('.btn-plus-food').off().click(function() {
      var group = $(this).parent();
      var body = group.parent().parent() 
      var list = group.parent().next()
      var categoryID = group.parent().parent().parent().find("#category_id").val()
      var textField = group.find(".form-control");
      var input = textField.val();
      if($.trim(input).length == 0) {
        $(this).attr('data-content', "Please enter a value for the food item name!");
        $(this).popover('show');
      } else {
        var name = $.trim(input)

        var json = '{"name":"' + name + '", "category_id":"' + categoryID + '"}';   	
        textField.val("");

        var successFunction = function(){
          textField.parent().toggle(400, function () {
            list.animate({height: 210}, 0, function() {
              reloadPage();
            });
          });
        }

        var failFunction = function(sender) {
          var foodItems = $.find('.list-group-item')
          console.log(foodItems);
          var found = null;
          $.each(foodItems, function(i, val){
            if (val.innerText == name){
              found = $(val);
            }
          });
          var cat = found.closest(".foods-panel").find(".panel-title")[0];
          console.log(cat);
          var catName = cat.innerText;
          sender.attr('data-content', (name + " already exists in " + catName  + " category!"));
          sender.popover('show');
        }

        ajaxCall("/food_items/save_food_item_json", "POST", {food_item: json}, $(this), successFunction, failFunction);

        }
      });


});


  
  // MODIFIED by fabs. Function to add a class to a row if it has been selected, and darken the row
  function selectRow() {
    $('body').on('click', '.list-group .list-group-item', function () {
      $(this).toggleClass('highlight-item');
    });
  }

  //function to delete all selected foods in specified container
  $(function() {
    $(".btn-delete-food").off().click(function() {
      var list = $(this).parent().parent().find(".list-group")
      var selectedFoods = list.find(".list-group-item.highlight-item");
      var selectedID = [];
      // gather the id of all selected items
      selectedFoods.each(function() {
        var id = $(this).find('#food_item_id').val();
        selectedID.push(id);
      });
      console.log(selectedID);
      ajaxCall("/food_items/delete_multiple_food_items", "POST", {food_item: selectedID});
      selectedFoods.fadeOut(400, function() {
          selectedFoods.remove();
        });
      });
    });



  //delete entire category when trash button is clicked
  $(function() {
    $(".btn-delete-cat").off().click(function() {
      var heading = $(this).parent();
      var panel = heading.parent();
      var container = $(this).closest(".foods-div")
      var categoryId = heading.find("#category_id").val();
      if(confirm("Are you sure you want to delete this Category?")){
        panel.fadeOut(400, function() {
          container.remove();
          ajaxCall("/categories/destroy", "POST", {id:categoryId});
      });


      }
    })
  })

 

  //add a new category if textfield has text
$(function() {
    $('.btn-add-cat').click(function() {
      var textField = $(this).parent().find('.form-control');
      var input = textField.val();
      console.log(input);
      if($.trim(input).length == 0) {
        $(this).attr('data-content', "Please enter a value for the category name!")
        $(this).popover('show');
      } else {
        var name = $.trim(input);
        var successFunction = function() {
          reloadPage();
        }
        var failFunction = function(sender){
          sender.attr('data-content', "Category already exists!");
          sender.popover('show');
        }
        ajaxCall("/categories/save_category", "POST", {name: name}, $(this),  successFunction, failFunction);
      }
  });
});

function ajaxCall(url, method, data, sender, successFunction, failFunction){
  successFunction = successFunction || function() {};
  failFunction = failFunction || function() {};
  $.ajax({
        url: url,
        method: method,
        data: data,
        timeout: 5500,
        success: successFunction,
        error: function() {
          failFunction(sender)
        }
      });
}

//Instantiate the popover for the add category button
$(function() {
  $('.btn-add-cat').popover({
    html: true,
    trigger: 'manual'
}).click(function(e) {
    $('.popup-marker').not(this).popover('hide');
    });
});

//Instantiate the popover for the add food item button
$(function() {
  $('.btn-plus-food').popover({
    html: true,
    trigger: 'manual'
}).click(function(e) {
  $('.popup-marker').not(this).popover('hide');
});
});


