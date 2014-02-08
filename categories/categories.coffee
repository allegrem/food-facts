# some global variables
w = 800
h = 500

nodes = []
links = []


# perform one step of the simulation
tick = ->
  node
    # .attr "cx", (d) -> d.x
    # .attr "cy", (d) -> d.y
    .attr 'transform', (d) -> "translate(" + d.x + "," + d.y + ")"
  link
    .attr "x1", (d) -> d.source.x
    .attr "y1", (d) -> d.source.y
    .attr "x2", (d) -> d.target.x
    .attr "y2", (d) -> d.target.y


# create force layout
force = d3.layout.force()
  .nodes nodes
  .links links
  .size [w, h]
  .linkDistance 120
  .charge -400
  .on "tick", tick


# create svg container
svgContainer = d3
  .select 'body'
  .append 'svg'
  .attr 'width', w
  .attr 'height', h
svgContainer
  .append 'rect'
  .attr 'height', h
  .attr 'width', w
  .attr 'style', 'fill:white; stroke-width:3; stroke: black'


# more global variables
link = svgContainer.selectAll '.link'
node = svgContainer.selectAll '.node'


# refresh the simulation
start = ->
  # reload the links
  link = link.data force.links(), (d) -> d.source.id + "-" + d.target.id
  # when a link is added
  link.enter()
    .insert "line", ".node" 
    .attr "class", "link"
  # when a link is removed
  link.exit()
    .remove()

  # reload the nodes
  node = node.data force.nodes(), (d) -> d.id
  # when a node is added
  g = node.enter()
    .append 'g'
    .attr 'class', 'node'
  g.append 'circle'
    .attr 'r', 8
  g.append 'text'
    .attr 'x', 12
    .attr 'dy', '.35em'
    .text (d) -> d.id
  # when a node is removed
  node.exit()
    .remove()

  # restart the simulation
  force.start()


# load json and display the first categories
loadJSON = (json) ->
  # root category
  root_node = {id: 'categories'}
  nodes.push root_node

  # get the list of the initial children
  for i in [0..4]
    n = {id: json.nodes[i].name}
    nodes.push n
    links.push {source: root_node, target: n}

  start()


# here we go
d3.json 'flare.json', loadJSON


# node = svgContainer.selectAll(".node")
#   .data(force.nodes())
#   .enter().append("g")
#   .attr("class", "node")
#   # .on("mouseover", mouseover)
#   # .on("click", nodeClick)
#   # .call(force.drag)  #uncomment to make this node draggable