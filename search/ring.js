(function() {

	var pressTimer;
	var clicked;

	$('#ring a').mouseenter(function() {
		$(this).addClass('hover');
	});

	$('#ring a').mouseleave(function() {
		$(this).removeClass('hover');
	});

	$('#ring a').each(function(){
	  $(this).mouseup(function(){
		//window.location.href=$(this).attr('href');
		item = new Object();
		item['name']=clicked.attr('category');
		item['id']=clicked.attr('category');
		item['option']=$(this).attr('data-option');
		selection.push(item);
		updateSelectionFrame();
		addToHeatmap(item);
	  });
	});

	$('#ring').mouseup(function() {
	 	$('#ring').fadeOut('fast');
	 	clicked.removeClass('hover');
		})
		.mouseleave(function() {
	  	$('#ring').fadeOut('fast');
	  	clicked.removeClass('hover');
	});

	$(document).on('mousedown', '.clickable',function(e){
		   pressTimer = window.setTimeout(function() {
			   var elt = clicked = $(e.target).closest('.clickable');
			   var x = elt.offset().left + elt[0].getBBox().width/2;
			   var y = elt.offset().top + elt[0].getBBox().height/2;
			   elt.addClass('hover');
			   $("#ring").css('top' , (y-150) +'px');
			   $("#ring").css('left', (x-150) +'px');  
			   $("#ring").fadeIn('fast');
		   },300) // clic pendant 300 ms avant d'afficher le ring
	 	   return false; 
	 	})
	 	.on('mouseup', '.clickable',function(){
		   clearTimeout(pressTimer);
	 	   return false;
	 	})
	 	.on('mouseleave', '.clickable',function(){
		   clearTimeout(pressTimer);
	 	   return false;
	 	});
})();
 	
