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

    $('body').on('click', '.have-avoid-list .list-group-item', function () {
        $(this).toggleClass('highlight-item');
    });
    $('.left-right').click(function(){
      var rightLeft_string;
      var leftRight_string;
      var haveAvoid_string;
      var avoidHave_string;
      var move_btn = $(this).attr('id');

      if(move_btn=='btn-move-left'){
        rightLeft_string = 'right';
        leftRight_string = 'left';
        haveAvoid_string = 'have';
        avoidHave_string = 'avoid';
      }else if(move_btn=='btn-move-right'){
        rightLeft_string = 'left';
        leftRight_string = 'right';
        haveAvoid_string = 'avoid';
        avoidHave_string = 'have';
      }
      if($('.list-'+rightLeft_string+' ul li.highlight-item').size()){
        $('#delete-to-'+haveAvoid_string).removeClass('disabled');
      }
      if($('.'+avoidHave_string+'-list').find('.food-item').size()==$('.list-'+rightLeft_string+' ul li.highlight-item').size()){
        $('#delete-to-'+avoidHave_string).addClass('disabled');
      }
      actives = $('.list-'+rightLeft_string+' ul li.highlight-item');
      actives.clone().appendTo('.list-'+leftRight_string+' ul');
      actives.remove();
    })

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

    $('.panel-delete').click(function(){
      var n; // Number of selections.
      var leftRight_string; // left or right.
      var haveAvoid_string; // have or avoid.
      var avoidHave_string; // right or left.
      var target_num_food_items;
      var delete_btn = $(this).attr('id');
      var panel_string;      

      if(delete_btn=='delete-to-have'){
        leftRight_string = 'left';
        haveAvoid_string = 'have';
        avoidHave_string = 'avoid';       
      } else if (delete_btn=='delete-to-avoid'){
        leftRight_string = 'right';
        haveAvoid_string = 'avoid'; 
        avoidHave_string = 'have';    
      }

      panel_string = '.list-'+leftRight_string+' ul li.highlight-item';
      n = $(panel_string).size();
      target_num_food_items = $('.'+haveAvoid_string+'-list').find('.food-item').size();
      the_other_food_items = $('.'+avoidHave_string+'-list').find('.food-item').size();
      
      var btn_string = '#delete-to-'+haveAvoid_string;
      if(n){     
        $(panel_string).remove(); // Remove highlighted items
        if(target_num_food_items==1 || target_num_food_items==n){
          $(btn_string).addClass('disabled');
        }
        if(the_other_food_items==0){
          $('#btn-move-left').addClass('disabled');
          $('#btn-move-right').addClass('disabled');
          // Disable search button.
          $('#btn-search-recipe').addClass('disabled');
        }
      } 
    });
  // Show all items of a category.
  $(".app-table-tr").click(function() {
    var myExpand = this.id;
    
    var myExpandId = this.id.split("_");
    var myDetailsClass = '.'+myExpandId[0]+"_items";
    // Show that recipe detail of that index.     
    //alert(myDetailsClass);
    $(myDetailsClass).toggle('fast');
    // Change gliphicon arrow up and down.
    var id='#'+myExpandId[0]+'_icon';
    
    if($(id).hasClass("glyphicon-chevron-down")){  
      $(this).css({"opacity": '1'});
      $(id).addClass("glyphicon-chevron-up");
      $(id).removeClass("glyphicon-chevron-down");
    }else{
      $(this).css({"opacity": '0.9'});
      $(id).addClass("glyphicon-chevron-down");
      $(id).removeClass("glyphicon-chevron-up");
    }
  });

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

  $('.btn-have-avoid').click(function(){
    var btn_have_avoid_id = $(this).attr('id');
    var haveAvoid_string;
    var avoidHave_string;
    var leftRight_string;

    if(btn_have_avoid_id=='btn-have'){
      haveAvoid_string='have';
      avoidHave_string='avoid';
      leftRight_string='left';
    }else if(btn_have_avoid_id=='btn-avoid'){
      haveAvoid_string='avoid';
      avoidHave_string='have';
      leftRight_string='right';
    }

    var actives = '';
    actives = $('.food_row td li.highlight-item');

    // Food names selected to add into PANEL
    var foods=[];
    for(var i=0;i<actives.length;i++){
      foods[i]=actives[i].innerHTML;
    }

    // Foods already exists in PANEL
    var inPanel = $('.'+haveAvoid_string+'-list').find('.food-item')
    var theOtherPanel = $('.'+avoidHave_string+'-list').find('.food-item')

    // get food items which are already in the panel.
    var alreadyHad = [];
    for(var j=0;j<inPanel.length;j++){
      alreadyHad[j]=inPanel[j].innerHTML;
    }

    // get food items in the other panel.
    var shouldntHave = [];
    for(var j=0;j<theOtherPanel.length;j++){
      shouldntHave[j]=theOtherPanel[j].innerHTML;
    }

    // Prevent duplicates from adding to panel.
    var duplicate=[];
    var dup_ids=[];
    for(i=0;i<foods.length;i++){
      for(j=0;j<alreadyHad.length;j++){
        if(foods[i]==alreadyHad[j]){
          duplicate.push(foods[i]); 
          dup_ids.push(i);        
        }
      }
    }
    // Remove if duplicates
    for(i=dup_ids.length-1;i>=0;i--){
       actives.splice(dup_ids[i],1);
    }
    // Food names selected to add into PANEL
    var foods=[];
    for(var i=0;i<actives.length;i++){
      foods[i]=actives[i].innerHTML;
    }

    // Prevent to-have and to-avoid panels have the same foods.
    var inTheOtherPanel=[];
    var inTheOtherPanel_ids=[];
    for(i=0;i<foods.length;i++){
      for(j=0;j<shouldntHave.length;j++){
        if(foods[i]==shouldntHave[j]){
          inTheOtherPanel.push(foods[i]); 
          inTheOtherPanel_ids.push(i);        
        }
      }
    }



    // Remove if already to-avoid or to-have.
    for(i=inTheOtherPanel_ids.length-1;i>=0;i--){
       actives.splice(inTheOtherPanel_ids[i],1);
    }


    actives.clone().appendTo('.list-'+leftRight_string+' ul');
    $('#btn-have').addClass("disabled");
    $('#btn-avoid').addClass("disabled");

    // Deselect all food items.
    $('.food-item ').removeClass('highlight-item');
    
    // Enable delete button in to-have-panel.
    if(actives.length>0){
      $('#delete-to-'+haveAvoid_string).removeClass("disabled");  
    }
  
    // Enable left right button.
    $('#btn-move-left').removeClass("disabled");
    $('#btn-move-right').removeClass("disabled");

    // Enable search button.
    $('#btn-search-recipe').removeClass('disabled');

  });

  $('#btn-cancel-search').click(function(){
    location.reload();
  });


});