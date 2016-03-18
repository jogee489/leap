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
        type: POST,
        url: "/recipes/search_online",
       	timeout: 20000,
        data: {foods_to_include: haveList,
        	   foods_to_exclude: avoidList},
       	success: function() {
       		console.log('success');
       	}

      });

	});
});