if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return (this.indexOf(suffix, this.length - suffix.length) !== -1);
    }
 };


function values_from_tag(selectedItem) {

	 var tag = selectedItem['id'];
	 var name = selectedItem['name'];
	 var option = selectedItem['option'];
	 
	 var products_subset = [];
	 
	 if(option == 'prod'){
	 	return [data[tag]];
	 }
	 
	 for (var i = 0; i< data.length ; i++) {
    	if(data[i]["categories_tags"]){
			if(data[i]["categories_tags"].endsWith("fr:"+tag) || data[i]["categories_tags"].indexOf("fr:"+tag+',')!=-1 ||
			   data[i]["categories_tags"].endsWith("en:"+tag) || data[i]["categories_tags"].indexOf("en:"+tag+',')!=-1	 ){
			 		products_subset.push(data[i]);
			}
		}
    }
    
    if (option == 'all'){
    	return products_subset;
    }
    else if (option == 'min' || option == 'max' || option == 'mean') {
    	result = new Object();
    	result.product_name = tag+'_'+option;
    	
    	/* TO DO HERE : look for min values in the subset and build the corresponding object */
    	
    	return [result];
    }
};

function addToHeatmap(item){
	
	var objects = values_from_tag(item);

	for (var i= 0;i<objects.length; i++){
		addproduit(objects[i]);
	}
	redessin();
};
