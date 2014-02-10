var margin = { top: 150, right: 100, bottom: 50, left: 350 },
  cellSize=15;
  col_number=8;
  row_number=0;
  width = 2*cellSize*col_number, // - margin.left - margin.right,
  height = cellSize*row_number , // - margin.top - margin.bottom,
  //gridSize = Math.floor(width / 24),
  legendElementWidth = cellSize * 2,
  colorBuckets = 21,
  colors = ['#005824','#1A693B','#347B53','#4F8D6B','#699F83','#83B09B','#9EC2B3','#B8D4CB','#D2E6E3','#EDF8FB','#FFFFFF','#F1EEF6','#E6D3E1','#DBB9CD','#D19EB9','#C684A4','#BB6990','#B14F7C','#A63467','#9B1A53','#91003F'];


  var colLabel_temp = $.ajax({
		                url: "../heatmap/collabel.tsv",
		                async: false
		             }).responseText;

  var colLabel_data = $.csv.toArray(colLabel_temp,{"separator":"\n"});


  

var values = [];
var hcrow = [];
var hccol = [1,2,3,4,5,6,7,8];
var rowLabel = [];
var colLabel = colLabel_data;
/*
for (var j = 0; j < 8; j++) {
  values[j] = {row: 1, col: j+1, value: 9-2*j};
  values[j+8] = {row: 2, col: j+1, value: j};
  values[j+16] = {row: 3, col: j+1, value: 5-2*j};
  hccol[j] = hccol_data[j];
  colLabel[j] = colLabel_data[j];
}
hcrow[0] = hcrow_data[0];
hcrow[1] = hcrow_data[1];
hcrow[2] = hcrow_data[2];
rowLabel[0] = rowLabel_data[0];
rowLabel[1] = rowLabel_data[1];
rowLabel[2] = rowLabel_data[2];
row_number+=3; */
height = cellSize*row_number; 
//render(values);


function addproduit(produit) {
   
  var lon = hcrow.length;
  hcrow[lon] = produit;
  rowLabel[lon] = produit.product_name;
  values[8*lon] = {row: lon+1, col: 1, value: +produit.energy_norm, raw: +produit.energy_100g, product: produit};
  values[8*lon+1] = {row: lon+1, col: 2, value: +produit.proteins_norm, raw: +produit.proteins_100g, product: produit};
  values[8*lon+2] = {row: lon+1, col: 3, value: +produit.carbohydrates_norm, raw: +produit.carbohydrates_100g, product: produit};
  values[8*lon+3] = {row: lon+1, col: 4, value: +produit.sugars_norm, raw: +produit.sugars_100g, product: produit};
  values[8*lon+4] = {row: lon+1, col: 5, value: +produit.fat_norm, raw: +produit.fat_100g, product: produit};
  values[8*lon+5] = {row: lon+1, col: 6, value: +produit.saturatedfat_norm, raw: +produit.saturatedfat_100g, product: produit};
  values[8*lon+6] = {row: lon+1, col: 7, value: +produit.fiber_norm, raw: +produit.fiber_100g, product: produit};
  values[8*lon+7] = {row: lon+1, col: 8, value: +produit.sodium_norm, raw: +produit.fiber_100g, product: produit};

  row_number++;
  height = cellSize*row_number;
}

function effacer() {
  d3.select("#chart svg").remove();
}


function ajouter(){
  update(values);
}

/* function render(data) { */

  var colorScale = d3.scale.quantile()
      .domain([ -10 , 0, 10])
      .range(colors);
  
function initChart(){
   svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      ;
   rowSortOrder=false;
   colSortOrder=false;
  
   rowLabels = svg.append("g");

   colLabels = svg.append("g")
      .selectAll(".colLabelg")
      .data(colLabel)
      .enter()
      .append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", function (d, i) { return hccol.indexOf(i+1) * cellSize *2 +8; })
      .style("text-anchor", "left")
      .attr("transform", "translate("+cellSize/2 + ",-6) rotate (-90)")
      .attr("class",  function (d,i) { return "colLabel mono c"+i;} )
      .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
      .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
      .on("click", function(d,i) {colSortOrder=!colSortOrder;  sortbylabel("c",i,colSortOrder);})
      ;

   heatMap = svg.append("g").attr("class","g3");
};

  initChart();
        

  function legend(){
	  bottomLegend = svg.selectAll(".legend")
		  .data([-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10])
		  .enter().append("g")
		  .attr("class", "legend");
	 
	  bottomLegend.append("rect")
		.attr("x", function(d, i) { return legendElementWidth * i - margin.left; })
		.attr("y", height+(cellSize*1))
		.attr("width", legendElementWidth)
		.attr("height", cellSize)
		.style("fill", function(d, i) { return colors[i]; });
	 
	  bottomLegend.append("text")
		.attr("class", "mono")
		.text(function(d) { return d; })
		.attr("width", legendElementWidth)
		.attr("x", function(d, i) { return legendElementWidth * i - margin.left; })
		.attr("y", height + (cellSize*3));
		
 	}
 	
 	var bottomLegend = legend();

// Change ordering of cells

  function sortbylabel(rORc,i,sortOrder){
       var t = svg.transition().duration(3000);
       var log2r=[];
       var sorted; // sorted is zero-based index
       d3.selectAll(".c"+rORc+i) 
         .filter(function(ce){
            log2r.push(ce.value);
          })
       ;
       if(rORc=="r"){ // sort log2ratio of a gene
         sorted=d3.range(col_number).sort(function(a,b){ if(sortOrder){ return log2r[b]-log2r[a];}else{ return log2r[a]-log2r[b];}});
         t.selectAll(".cell")
           .attr("x", function(d) { return sorted.indexOf(d.col-1) * cellSize *2; })
           ;
         t.selectAll(".colLabel")
          .attr("y", function (d, i) { return sorted.indexOf(i) * cellSize*2 +8; })
         ;
       }else{ // sort log2ratio of a contrast
         sorted=d3.range(row_number).sort(function(a,b){if(sortOrder){ return log2r[b]-log2r[a];}else{ return log2r[a]-log2r[b];}});
         t.selectAll(".cell")
           .attr("y", function(d) { return sorted.indexOf(d.row-1) * cellSize; })
           ;
         t.selectAll(".rowLabel")
          .attr("y", function (d, i) { return sorted.indexOf(i) * cellSize; })
         ;
       }
  }

  d3.select("#order").on("change",function(){
    order(this.value);
  });
  
  function order(value){
   if(value=="hclust"){
    var t = svg.transition().duration(3000);
    t.selectAll(".cell")
      .attr("x", function(d) { return hccol.indexOf(d.col) * cellSize *2; })
      .attr("y", function(d) { return hcrow.indexOf(d.row) * cellSize; })
      ;

    t.selectAll(".rowLabel")
      .attr("y", function (d, i) { return hcrow.indexOf(i+1) * cellSize; })
      ;

    t.selectAll(".colLabel")
      .attr("y", function (d, i) { return hccol.indexOf(i+1) * cellSize *2 +8; })
      ;

   }else if (value=="probecontrast"){
    var t = svg.transition().duration(3000);
    t.selectAll(".cell")
      .attr("x", function(d) { return (d.col - 1) * cellSize *2; })
      .attr("y", function(d) { return (d.row - 1) * cellSize; })
      ;

    t.selectAll(".rowLabel")
      .attr("y", function (d, i) { return i * cellSize; })
      ;

    t.selectAll(".colLabel")
      .attr("y", function (d, i) { return i * cellSize *2 +8; })
      ;

   }else if (value=="probe"){
    var t = svg.transition().duration(3000);
    t.selectAll(".cell")
      .attr("y", function(d) { return (d.row - 1) * cellSize; })
      ;

    t.selectAll(".rowLabel")
      .attr("y", function (d, i) { return i * cellSize; })
      ;
   }else if (value=="contrast"){
    var t = svg.transition().duration(3000);
    t.selectAll(".cell")
      .attr("x", function(d) { return (d.col - 1) * cellSize *2; })
      ;
    t.selectAll(".colLabel")
      .attr("y", function (d, i) { return i * cellSize *2 +8; })
      ;
   }
  }
  
  var sa=d3.select(".g3")
      .on("mousedown", function() {
          if( !d3.event.altKey) {
             d3.selectAll(".cell-selected").classed("cell-selected",false);
             d3.selectAll(".rowLabel").classed("text-selected",false);
             d3.selectAll(".colLabel").classed("text-selected",false);
          }
         var p = d3.mouse(this);
         sa.append("rect")
         .attr({
             rx      : 0,
             ry      : 0,
             class   : "selection",
             x       : p[0],
             y       : p[1],
             width   : 1,
             height  : 1
         })
      })
      .on("mousemove", function() {
         var s = sa.select("rect.selection");
      
         if(!s.empty()) {
             var p = d3.mouse(this),
                 d = {
                     x       : parseInt(s.attr("x"), 10),
                     y       : parseInt(s.attr("y"), 10),
                     width   : parseInt(s.attr("width"), 10),
                     height  : parseInt(s.attr("height"), 10)
                 },
                 move = {
                     x : p[0] - d.x,
                     y : p[1] - d.y
                 }
             ;
      
             if(move.x < 1 || (move.x*2<d.width)) {
                 d.x = p[0];
                 d.width -= move.x;
             } else {
                 d.width = move.x;       
             }
      
             if(move.y < 1 || (move.y*2<d.height)) {
                 d.y = p[1];
                 d.height -= move.y;
             } else {
                 d.height = move.y;       
             }
             s.attr(d);
      
                 // deselect all temporary selected state objects
             d3.selectAll('.cell-selection.cell-selected').classed("cell-selected", false);
             d3.selectAll(".text-selection.text-selected").classed("text-selected",false);

             d3.selectAll('.cell').filter(function(cell_d, i) {
                 if(
                     !d3.select(this).classed("cell-selected") && 
                         // inner circle inside selection frame
                     (this.x.baseVal.value)+cellSize *2 >= d.x && (this.x.baseVal.value)<=d.x+d.width && 
                     (this.y.baseVal.value)+cellSize >= d.y && (this.y.baseVal.value)<=d.y+d.height
                 ) {
      
                     d3.select(this)
                     .classed("cell-selection", true)
                     .classed("cell-selected", true);

                     d3.select(".r"+(cell_d.row-1))
                     .classed("text-selection",true)
                     .classed("text-selected",true);

                     d3.select(".c"+(cell_d.col-1))
                     .classed("text-selection",true)
                     .classed("text-selected",true);
                 }
             });
         }
      })
      .on("mouseup", function() {
            // remove selection frame
         sa.selectAll("rect.selection").remove();
      
             // remove temporary selection marker class
         d3.selectAll('.cell-selection').classed("cell-selection", false);
         d3.selectAll(".text-selection").classed("text-selection",false);
      })
      .on("mouseout", function() {
         if(d3.event.relatedTarget && d3.event.relatedTarget.tagName=='html') {
                 // remove selection frame
             sa.selectAll("rect.selection").remove();
                 // remove temporary selection marker class
             d3.selectAll('.cell-selection').classed("cell-selection", false);
             d3.selectAll(".rowLabel").classed("text-selected",false);
             d3.selectAll(".colLabel").classed("text-selected",false);
         }
      })
      ;
/* } */

function update(data){

	d3.select("#chart svg").attr("height", height + margin.top + margin.bottom);
	
	

 svg.selectAll(".rowLabel")
 		.data(rowLabel)
      .enter()
      .append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", function (d, i) { return rowLabel.indexOf(d) * cellSize; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + cellSize / 1.5 + ")")
      .attr("class", function (d,i) { return "rowLabel mono r"+i;} ) 
      .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
      .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
      .on("click", function(d,i) {rowSortOrder=!rowSortOrder; sortbylabel("r",i,rowSortOrder);})
      ;
      
 d3.select(".g3").selectAll(".cell")
        .data(data,function(d){return d.row+":"+d.col;})
        .enter()
        .append("rect")
        .attr("x", function(d) { return hccol.indexOf(d.col) * cellSize *2; })
        .attr("y", function(d) { return hcrow.indexOf(d.product) * cellSize; })
        .attr("class", function(d){return "cell cell-border cr"+(d.row-1)+" cc"+(d.col-1);})
        .attr("width", cellSize*2)
        .attr("height", cellSize)
        .style("fill", function(d) { return colorScale(d.value); })
        .on("mouseover", function(d){
               //highlight text
               d3.select(this).classed("cell-hover",true);
               d3.selectAll(".rowLabel").classed("text-highlight",function(r,ri){ return ri==(d.row-1);});
               d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col-1);});
        
               //Update the tooltip position and value
               d3.select("#tooltip")
                 .style("left", (d3.event.pageX+10) + "px")
                 .style("top", (d3.event.pageY-10) + "px")
                 .select("#value")
                 .text("lables:"+rowLabel[d.row-1]+","+colLabel[d.col-1]+"\nvaleur:"+d.raw+"\nrow-col-idx:"+d.col+","+d.row+"\ncell-xy "+this.x.baseVal.value+", "+this.y.baseVal.value);  
               //Show the tooltip
               d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseout", function(){
               d3.select(this).classed("cell-hover",false);
               d3.selectAll(".rowLabel").classed("text-highlight",false);
               d3.selectAll(".colLabel").classed("text-highlight",false);
               d3.select("#tooltip").classed("hidden", true);
        })
        ;
        
        svg.selectAll(".legend").remove();
        legend();
}

function removeFromChart(produit){
	
	var index = hcrow.indexOf(produit);

	if (index > -1) {
 	   hcrow.splice(index, 1);
 	   rowLabel.splice(index, 1);
 	   values.splice(8*index,8);
 	   row_number--;
  	   height = cellSize*row_number;
	}
	
	for( var i=8*index;i<values.length;i++){
		values[i].row -= 1;
	}
	
}
