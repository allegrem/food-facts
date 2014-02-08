if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return (this.indexOf(suffix, this.length - suffix.length) !== -1);
    }
 };


function values_from_tag(selectedItem) {

	 var tag = selectedItem['tag'];
	 var name = selectedItem['name'];
	 var option = selectedItem['option'];
	 
	 var products_subset = [];
	 
	 for (var i = 0; i< data.length ; i++) {
    	if(data[i]["categories_tags"]){
			if(data[i]["categories_tags"].endsWith(tag) || data[i]["categories_tags"].indexOf(tag+',')!=-1 ){
			 		products_subset.push(data[i]);
			}
		}
    }
    
    if (option == 'all'){
    	return products_subset;
    }
    else if (option == 'min') {
    	result = new Object();
    	result.product_name = tag+'_'+option;
    	
    	/* TO DO HERE : look for min values in the subset and build the corresponding object */
    	
    	return [result];
    }
};
