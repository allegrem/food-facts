# some global variables
w = 800
h = 600

# create svg container
svgContainer = d3.select('body').append('svg').attr('width', w).attr('height', h)
svgContainer.append('rect').attr('height', h).attr('width', w).attr('style', 'fill:white; stroke-width:3; stroke: black')



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
    .attr 'font-size', '50px'

# apply child style with the right angle
setChildAttribute = (e, angle) ->
  bounding = e[0][0].getBoundingClientRect()
  e.attr 'x', w/2 - bounding.width/2 + 200 * Math.sin angle
    .attr 'y', h/2 + 200 * Math.cos angle

# draw a link between the two elements
drawLink = (e1, e2) ->
  svgContainer.append('line')
    .attr('x1', e1.attr('x'))
    .attr('y1', e1.attr('y'))
    .attr('x2', e2.attr('x'))
    .attr('y2', e2.attr('y'))
    .attr('style', 'stroke:black; stroke-width: 1px')


# main category
mainCat = appendText 'Sodas'
setMainAttribute mainCat

children = ['Coca-Cola', 'Pepsi', 'Orangina', 'Fanta', 'Canada Dry']
i = 0
for c in children
  el = appendText c
  setChildAttribute el, i * 6.28 / children.length
  i++

refresh()
