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
		hideResults();
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
	 	clicked[0].classList.remove('hover');
		})
		.mouseleave(function() {
	  	$('#ring').fadeOut('fast');
	  	clicked[0].classList.remove('hover');
	});

	$(document).on('mousedown', '.clickable',function(e){
		   pressTimer = window.setTimeout(function() {
		       var x,y;
			   var elt = clicked = $(e.target).closest('.clickable');
			   if(elt[0].getBBox){
			     x = elt.offset().left + elt[0].getBBox().width/2;
			   	 y = elt.offset().top + elt[0].getBBox().height/2;
			   }else{
			 	    x = elt.offset().left + elt.outerWidth()/2 -50;
			   		y = elt.offset().top + elt.outerHeight()/2;
			   }
			   
			   elt[0].classList.add("hover");
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
 	
