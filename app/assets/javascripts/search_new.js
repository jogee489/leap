$(function () {
	$('#btn-search-recipe').click(function() {

		var foodsToHaveList = $('.have-list').find('.food-item');
		var foodsToAvoidList = $('.avoid-list').find('.food-item');

		var avoidList = [];
		var haveList = [];

		foodsToAvoidList.each(function() {
			avoidList.push($(this).text());
		});

		foodsToHaveList.each(function() {
			haveList.push($(this).text());
		});

		$.ajax({
        type: "POST",
        url: "/recipes/search_online",
       	timeout: 0,
        data: {foods_to_include: haveList,
        	   foods_to_exclude: avoidList},
       	success: function() {
       		window.location.replace("/recipes/display_online_results")
       	}

      });

	});
});

  $(function () {
    $('body').on('click', '.list-group .list-group-item', function () {
        $(this).toggleClass('highlight-item');
    });
    $('#btn-move-left').click(function(){
      if($('.list-right ul li.highlight-item').size()>0){
        $('#delete-to-have').removeClass('disabled');
      }
      var numOfToAvoid = $('.avoid-list').find('.food-item').size();
      if(numOfToAvoid==$('.list-right ul li.highlight-item').size()){
        $('#delete-to-avoid').addClass('disabled');
      }
      actives = $('.list-right ul li.highlight-item');
      actives.clone().appendTo('.list-left ul');
      actives.remove();
    });
    $('#btn-move-right').click(function(){
      if($('.list-left ul li.highlight-item').size()>0){
        $('#delete-to-avoid').removeClass('disabled');
      }
      var numOfToHave = $('.have-list').find('.food-item').size();
      if(numOfToHave==$('.list-left ul li.highlight-item').size()){
        $('#delete-to-have').addClass('disabled');
      }
      actives = $('.list-left ul li.highlight-item');
      actives.clone().appendTo('.list-right ul');
      actives.remove();
    });    

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
    $('#delete-to-have').click(function(){    
      var numOfToHave = $('.have-list').find('.food-item').size();  
      var n = $('.list-left ul li.highlight-item').size();
      if(n==0){}
      else{                
        $('.list-left ul li.highlight-item').remove();
        if(numOfToHave==1){
          $('#delete-to-have').addClass('disabled');
        }else if(numOfToHave==n){
          $('#delete-to-have').addClass('disabled');
        }
      }
    });
    $('#delete-to-avoid').click(function(){ 
      var numOfToAvoid = $('.avoid-list').find('.food-item').size();            
      var n = $('.list-right ul li.highlight-item').size();
      if(n==0){}
      else{                
        $('.list-right ul li.highlight-item').remove();
        if(numOfToAvoid==1){
          $('#delete-to-avoid').addClass('disabled');
        } else if(numOfToAvoid==n){
          $('#delete-to-avoid').addClass('disabled');
        }
      }     
    });
});
// This controls the food selection table
$(document).ready(function () {
  // Show all items of a category.
  $(".expand").click(function() {
    var myExpand = this.id;
    
    var myExpandId = this.id.split("_");
    var myDetailsClass = '.'+myExpandId[0]+"_items";
    // Show that recipe detail of that index.     
    //alert(myDetailsClass);
    $(myDetailsClass).toggle('fast');
    // Change gliphicon arrow up and down.
    var id='#'+myExpandId[0]+'_icon';
    
    if($(id).hasClass("glyphicon-chevron-down")){       
      $(id).addClass("glyphicon-chevron-up");
      $(id).removeClass("glyphicon-chevron-down");
    }else{
      $(id).addClass("glyphicon-chevron-down");
      $(id).removeClass("glyphicon-chevron-up");
    }
  });
  // Enable buttons when check boxes are checked.
  // and handles food items selections.
  $('.food-item').click(function() {
    $(this).toggleClass('highlight-item');
    var numChked = $('.highlight-item').size();
     if(numChked) {       
       $('#btn-avoid').removeClass("disabled");
       $('#btn-have').removeClass("disabled");
     } else if(numChked==0) {
       $('#btn-avoid').addClass("disabled");
       $('#btn-have').addClass("disabled");
     }
  });
  // Button to have
  $('#btn-have').click(function () {
    var actives = '';
    actives = $('.food_row td li.highlight-item');        
    actives.clone().appendTo('.list-left ul');
    $('#btn-have').addClass("disabled");
    $('#btn-avoid').addClass("disabled");
    // Deselect all food items.
    $('.food-item ').removeClass('highlight-item');
    
    // Enable delete button in to-have-panel.
    $('#delete-to-have').removeClass("disabled");
    // Enable left right button.
    $('#btn-move-left').removeClass("disabled");
    $('#btn-move-right').removeClass("disabled");

  });
  // Button to avoid.
  $('#btn-avoid').click(function () {
    var actives = '';
    actives = $('.food_row td li.highlight-item');        
    actives.clone().appendTo('.list-right ul');
    $('#btn-have').addClass("disabled");
    $('#btn-avoid').addClass("disabled");
    // Deselect all food items.
    $('.food-item ').removeClass('highlight-item');

    // Enable delete button in to-have-panel.
    $('#delete-to-avoid').removeClass("disabled")
    // Enable left right button.
    $('#btn-move-left').removeClass("disabled");
    $('#btn-move-right').removeClass("disabled");
  });

  $('#btn-cancel-search').click(function(){
    location.reload();
  });
});