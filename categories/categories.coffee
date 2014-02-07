# some global variables
w = 400
h = 200

# don't know why, but sometimes you need to force refresh
refresh = -> $("body").html $("body").html()

# create and append a text object in SVG
appendText = (cat) -> 
  r = svgContainer.append 'text'
    .text cat
    .attr 'font-family', 'sans-serif'
    .attr 'font-size', '30px'
    .attr 'id', cat

# apply main category style (centered)
setMainAttribute = (e) ->
  bounding = e[0][0].getBoundingClientRect()
  e.attr 'x', w/2 - bounding.width/2
    .attr 'y', h/2


# create svg container
svgContainer = d3.select('body').append('svg').attr('width', w).attr('height', h)
svgContainer.append('rect').attr('height', h).attr('width', w).attr('style', 'fill:white; stroke-width:3; stroke: black')


# main category
mainCat = appendText 'Sodas'
setMainAttribute mainCat


refresh()
