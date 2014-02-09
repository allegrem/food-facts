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
    	
    	var properties = ['energy_norm','proteins_norm','carbohydrates_norm','sugars_norm'
    						,'fat_norm','saturatedfat_norm','fiber_norm','sodium_norm'];
    	var nprop = properties.length;					
    	
    	if(option == 'min'){
			for(var i=0;i<nprop;i++){
				var temp = Number.MAX_VALUE;
				for( var j=0;j<products_subset.length;j++){
					if (+products_subset[j][properties[i]]<temp){
						temp = +products_subset[j][properties[i]];
					}
				}
				result[properties[i]]=temp;
			}
		}
		else if(option == 'max'){
			for(var i=0;i<nprop;i++){
				var temp = Number.MIN_VALUE;
				for( var j=0;j<products_subset.length;j++){
					if (+products_subset[j][properties[i]]>temp){
						temp = +products_subset[j][properties[i]];
					}
				}
				result[properties[i]]=temp;
			}
		}
		else if(option == 'mean'){
			for(var i=0;i<nprop;i++){
				var temp = 0;
				for( var j=0;j<products_subset.length;j++){
					temp += +products_subset[j][properties[i]];
				}
				result[properties[i]]=temp/(products_subset.length);
			}
		}
    	
    	return [result];
    }
};

function addToHeatmap(item){
	
	var objects = values_from_tag(item);
	item.data = objects;

	for (var i= 0;i<objects.length; i++){
		addproduit(objects[i]);
	}
	redessin();
};
