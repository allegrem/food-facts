# some global variables
w = 800
h = 500
MAX_CHILDREN = 10

nodes = []
links = []

allCategories = {}

currentRoot = null
previousRoot = null


# perform one step of the simulation
tick = ->
  node
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
  .charge -1000
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


# when the user clicks on a node (circle only)
nodeClick = (node) ->
  if previousRoot
    # remove previous root
    nodes.splice nodes.indexOf(previousRoot), 1

    # remove nodes connected to previousRoot
    for l in links when l.source.id is previousRoot.id and l.target.id isnt currentRoot.id
      nodes.splice nodes.indexOf(nodes.filter((c) -> c.id is l.target.id)[0]), 1

    # remove links connected to previousRoot 
    links = _.reject links, (l) -> l.source.id is previousRoot.id
    force.links links

  # update root variables
  previousRoot = currentRoot
  currentRoot = node

  # add the new children
  i = 0
  for child in node.links
    cat = allCategories.nodes.filter((c) -> c.name is child.name)[0]
    newNode = {id: cat.name, links: cat.links}
    nodes.push newNode
    links.push {source: node, target: newNode}
    break  if ++i is MAX_CHILDREN

  # refresh the simulation
  start()


# refresh the simulation
start = ->
  # reload the links
  link = link.data force.links(), (d) -> d.source.id + "-" + d.target.id
  # when a link is added
  link.enter()
    .insert "line", ".node" 
    .attr "class", "link"
  # when a link is removed
  link.exit().remove()

  # reload the nodes
  node = node.data force.nodes(), (d) -> d.id
  # when a node is added
  g = node.enter()
    .append 'g'
    .attr 'class', 'node'
    .on 'click', nodeClick
  g.append 'circle'
    .attr 'r', 8
  g.append 'text'
    .attr 'x', 12
    .attr 'dy', '.35em'
    .text (d) -> d.id
  # when a node is removed
  node.exit().remove()

  # restart the simulation
  force.start()


# load json and display the first categories
loadJSON = (json) ->
  allCategories = json

  # root category
  root_node = {id: 'categories'}
  nodes.push root_node
  currentRoot = root_node

  # get the list of the initial children
  for i in [0...MAX_CHILDREN]
    n = {id: json.nodes[i].name, links: json.nodes[i].links}
    nodes.push n
    links.push {source: root_node, target: n}

  # start the animation
  start()


# here we go
d3.json 'flare.json', loadJSON
