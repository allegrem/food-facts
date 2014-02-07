var pressTimer;

$('#ring a').mouseenter(function() {
	$(this).addClass('hover');
});

$('#ring a').mouseleave(function() {
	$(this).removeClass('hover');
});

$('#ring a').each(function(){
  $(this).mouseup(function(){
    window.location.href=$(this).attr('href');
  });
});

$('#ring').mouseup(function() {
 	$('#ring').fadeOut('fast');})
 .mouseleave(function() {
  	$('#ring').fadeOut('fast');
});

$(document).on('mousedown', '.clickable',function(e){
	   pressTimer = window.setTimeout(function() {
		   var elt = $(e.target);
		   var x = elt.offset().left + elt.outerWidth()/2;
		   var y = elt.offset().top + elt.outerHeight()/2;
		   $("#ring").css('top' , (y-150) +'px');
		   $("#ring").css('left', (x-150) +'px');  
		   $("#ring").fadeIn('fast');
       },300) // clic pendant 300 ms avant d'afficher le ring
 	   return false; 
 	})
 	.on('mouseup', '.clickable',function(){
	   clearTimeout(pressTimer);
 	   return false;
 	});
 	
