$('#ring').mouseleave(function() {
  $('#ring').fadeOut('slow');
});

$(document).on('click', '.clickable',function(e){
	   var elt = $(e.target);
	   var x = elt.offset().left + elt.outerWidth()/2;
	   var y = elt.offset().top + elt.outerHeight()/2;
       $("#ring").css('top' , (y-150) +'px');
       $("#ring").css('left', (x-150) +'px');  
       $("#ring").fadeIn('fast');
 });
