##### WARM UP #####

# some global variables
w = 800
h = 500

nodes = null
links = null


# create force layout
force = d3.layout.force()
  .nodes nodes
  .links links
  .size [w, h]
  .linkDistance 200
  .charge -1000
  .on "tick", tick


# create svg container
svgContainer = d3.select('body').append('svg').attr('width', w).attr('height', h)
svgContainer.append('rect').attr('height', h).attr('width', w).attr('style', 'fill:white; stroke-width:3; stroke: black')


# more global variables
link = svgContainer.selectAll(".link")
node = svgContainer.selectAll(".node")



##### DRAWING FUNCTIONS #####

# perform one step of the simulation
tick = ->
  link
    .attr "x1", (d) -> d.source.x
    .attr "y1", (d) -> d.source.y
    .attr "x2", (d) -> d.target.x
    .attr "y2", (d) -> d.target.y
  node
    .attr "transform", (d) -> "translate(" + d.x + "," + d.y + ")"


# start the simulation
start = ->
  link = link.data force.links(), (d) -> d.source.id + "-" + d.target.id
  link.enter().insert("line", ".node").attr("class", "link")
  link.exit().remove()

  node = node.data force.nodes(), (d) -> d.id
  node.enter().append("circle").attr("class", (d) -> "node " + d.id).attr("r", 8)
  node.exit().remove()

  force.start()



##### LOAD JSON #####

initJSON = (json) ->
  # get the list of the initial children
  links = []
  for i in [0..10]
    links.push {source: 'Catégories', target: json.nodes[i].name}

  # compute the distinct nodes from the links.
  nodes = {}
  links.forEach (link) ->
    link.source = nodes[link.source] || (nodes[link.source] = {name: link.source})
    link.target = nodes[link.target] || (nodes[link.target] = {name: link.target})

  # create the link
  link = svgContainer.selectAll(".link")
    .data(force.links())
    .enter().append("line")
    .attr("class", "link");

  # create the nodes
  node = svgContainer.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .attr("class", "node")
    # .on("mouseover", mouseover)
    .on("click", nodeClick)
    # .call(force.drag)  #uncomment to make this node draggable

  # create the circle
  node.append("circle")
    .attr("r", 8);

  # create the label
  node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text (d) -> d.name  


# load JSON
$.getJSON 'flare.json', initJSON
