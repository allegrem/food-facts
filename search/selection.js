var selection = [];

function updateSelectionFrame(){

	$('#selection').html("");
	
	for (var i=0;i<selection.length;i++){
		$('#selection').append(
			'<div>	<div class="item">'+selection[i]['name'] + '</div> <span class="option">'+selection[i]['option']+'</span>'+
			'<div class="delete" data-idx='+i+'></div> </div>');
	}
}


$(document).on('click', '.delete',function(e){
	   var idx = e.target.getAttribute('data-idx');
	   selection.splice(idx, 1);
	   updateSelectionFrame();
 	}); 

 	
