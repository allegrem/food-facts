var data = [];

$('html').click(function(e){
	   var res = $('#results');
	   var box = $('#searchbox');
       if( res[0] === e.target || box[0] === e.target || res.has(e.target).length > 0 || box.has(e.target).length > 0 ){
           return true; 
       }
       else{
           $('#results').slideUp( "slow" );
       }
 });
 
function load_data(){
	var data_temp = $.ajax({
		                url: "../data/data-processed.tsv",
		                async: false
		             }).responseText;
		             
	data = $.csv.toObjects(data_temp,{"separator":"\t"});
	//data = JSON.parse(data_temp);
};

function launch() {

	load_data();
	
	document.getElementById('wait').style.display = 'none'; 	
	
    var searchElement = document.getElementById('searchbox'),
        c_results = document.getElementById('categories_list'),
        p_results = document.getElementById('products_list'),
        results = document.getElementById('results'),
        previousValue = searchElement.value; 
        
    var tooltip = document.getElementById('tip');
        
    var categoriesData = $.ajax({
                    url: "../data/categories_fr.json",
                    async: false
                 }).responseText;
   
    var categories = JSON.parse(categoriesData)["categories"];
  	
  	
    function getResults(keyword) { 
      
        var keyword = keyword.toLowerCase();
        
        var categories_result = [];
        var products_result = [];
        var nb_product = 0;
        
        if(keyword != ""){        	
		    for (var i = 0; i < categories.length && categories_result.length < 20; i++) {
				if((categories[i]["name"].toLowerCase()).indexOf(keyword)!=-1)
				 		categories_result.push(categories[i]);
		    }
		    
		    for (var i = 0; i< data.length && products_result.length < 100 ; i++){
		    	if(data[i]["product_name"]){
					if((data[i]["product_name"].toLowerCase()).indexOf(keyword)!=-1){
					 		products_result.push(data[i]);
					 		products_result[nb_product]['data-idx']=i;
					 		nb_product++;
					 }
				}
		    }
		    
		    displayResults({"products":products_result,"categories":categories_result});
		   	$('#results').stop(true,true).slideDown( 'fast' ); 
		     
		}
		else
		  $('#results').slideUp( 'slow' );   
    }

    function displayResults(response) { // Affiche les résultats d'une requête
    
    	var categories = response["categories"];
    	var products = response["products"];
      
      	document.getElementById ("categories_results").querySelector(".nothing_found").style.display = categories.length ? 'none' : 'block';
      	document.getElementById ("products_results").querySelector(".nothing_found").style.display = products.length ? 'none' : 'block';
      	
      	c_results.innerHTML = ''; 
		p_results.innerHTML = '';       	

        if (categories.length) { 

            var responseLen = categories.length;

            for (var i = 0, div ; i < responseLen ; i++) {

                div = c_results.appendChild(document.createElement('div'));
                div.className = "result";
                
                div.innerHTML = categories[i]["name"] 
                				+ '<br> <span class="details"> '+ "<i>"+ categories[i]["tag"] + "</i>  -  " 
                					+ categories[i]["nb_prod"]+" produit(s) </span>" ;
                
                (function(i){
		            div.onclick = function() {
		            		hideResults();
		            		clicked_category_name = categories[i]['tag'].substring(3);
		            		n = window.allCategories.nodes.filter(function (c) { return c.name == clicked_category_name })[0]
							n['id'] = clicked_category_name
							window.nodeClick(n);
				        };
				 })(i);

            }

        }
        
         if (products.length) { 

            var responseLen = products.length;

            for (var i = 0, div ; i < responseLen ; i++) {

                div = p_results.appendChild(document.createElement('div'));
                div.className = "result";
                div['data-idx'] = products[i]['data-idx'];
                
                div.innerHTML = products[i]["product_name"];
                
                var details = "";
                
                if(products[i]["brands"]) {
                	details += "<p> <i>Marque :</i> "+ products[i]["brands"] + "</p>" ;
               	}
                
                if(products[i]["image_small_url"]){
                	details += '<img src=" '+products[i]["image_small_url"]+ ' " alt="image produit" />' ;
                }
                	
                (function(div,details){
               		div.addEventListener("mouseover",function(){
						tooltip.innerHTML = details;
						tooltip.style.top = div.getBoundingClientRect().top + 'px';
						tooltip.style.display = 'block';
						});
			    })(div,details);
			
					
			    div.addEventListener("mouseout",function(){
    				tooltip.style.display = 'none';
    				tooltip.innerHTML = "";
					});
               	
                div.onclick = function() {
                    chooseProduct(this);
                };
            }
        }
    }

    function hideResults() { 
        searchElement.focus(); 
        $('#tooltip').hide();
        $('#results').slideUp( "slow" );
    }
    
    function chooseProduct(product){
    	item = new Object();
		item['name']=product.innerHTML;
		item['id']=product['data-idx'];
		item['option']='prod';
		selection.push(item);
		updateSelectionFrame();
		addToHeatmap(item);
    }


    searchElement.onkeyup = function(e) {   
       e = e || window.event; // On n'oublie pas la compatibilité pour IE
       if (searchElement.value != previousValue) { // Si le contenu du champ de recherche a changé
            previousValue = searchElement.value;
            getResults(previousValue);
      }
    };
    
    searchElement.onclick = function() {
           getResults(searchElement.value);
    };

};

