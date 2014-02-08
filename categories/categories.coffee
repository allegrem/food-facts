##### WARM UP #####

# some global variables
w = 800
h = 500
link = {}
node = {}


# create svg container
svgContainer = d3.select('body').append('svg').attr('width', w).attr('height', h)
svgContainer.append('rect').attr('height', h).attr('width', w).attr('style', 'fill:white; stroke-width:3; stroke: black')



##### DRAWING FUNCTIONS #####

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
drawLink = (main, child, weight) ->
  mainBound = main[0][0].getBoundingClientRect()
  childBound = child[0][0].getBoundingClientRect()

  x1 = parseInt(main.attr('x')) + mainBound.width*2
  y1 = main.attr('y') - mainBound.height
  x2 = parseInt(child.attr('x')) + childBound.width
  y2 = child.attr('y') - childBound.height/2

  if y2 < y1 - 10
    x2 += (childBound.height + 5) * (x2-x1) / (y2-y1)
    y2 += (childBound.height + 5)
    x1 -= (mainBound.height + 15) * (x2-x1) / (y2-y1)
    y1 -= mainBound.height + 15
  else if y2 > y1 + 10
    x2 -= (childBound.height + 5) * (x2-x1) / (y2-y1)
    y2 -= (childBound.height + 5)
    x1 += (mainBound.height + 15) * (x2-x1) / (y2-y1)
    y1 += mainBound.height + 15

  svgContainer.append('line')
    .attr 'x1', x1
    .attr 'y1', y1
    .attr 'x2', x2
    .attr 'y2', y2
    .attr 'style', "stroke:black; stroke-width: #{weight}px"


tick = ->
  link
    .attr "x1", (d) -> d.source.x
    .attr "y1", (d) -> d.source.y
    .attr "x2", (d) -> d.target.x
    .attr "y2", (d) -> d.target.y
  node
    .attr "transform", (d) -> "translate(" + d.x + "," + d.y + ")"




##### LOAD JSON #####

initJSON = (json) ->
  # get the list of the initial children
  links = []
  for i in [0..5]
    links.push {source: 'Catégories', target: json.nodes[i].name}

  # compute the distinct nodes from the links.
  nodes = {}
  links.forEach (link) ->
    link.source = nodes[link.source] || (nodes[link.source] = {name: link.source})
    link.target = nodes[link.target] || (nodes[link.target] = {name: link.target})

  # create force layout
  force = d3.layout.force()
    .nodes d3.values(nodes)
    .links links
    .size [w, h]
    .linkDistance 200
    .charge -300
    .on "tick", tick
    .start()

  # create the link
  link = svgContainer.selectAll(".link")
    .data(force.links())
    .enter().append("line")
    .attr("class", "link");

  node = svgContainer.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .attr("class", "node")
    # .on("mouseover", mouseover)
    # .on("mouseout", mouseout)
    # .call(force.drag)  #uncomment to make this node draggable

  # create the node
  node.append("circle")
    .attr("r", 8);

  # create the label
  node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text (d) -> d.name  


# load JSON
$.getJSON 'flare.json', initJSON
