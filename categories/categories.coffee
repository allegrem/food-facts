# some global variables
w = 800
h = 500
MAX_CHILDREN = 10
currentIndex = 0

nodes = []
links = []

allCategories = {}

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
  .linkDistance 150
  .charge -600
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
  # empty the graph
  links = []
  nodes = [node]
  force.links links
  force.nodes nodes

  # load more children if the user clicks again on the root
  if node is previousRoot
    currentIndex += MAX_CHILDREN  if node.links.length > currentIndex + MAX_CHILDREN
  else
    currentIndex = 0

  # add the new children
  i = 0
  for child in node.links.slice currentIndex
    if nodes.filter((n) -> n.id is child.name).length is 0
      cat = allCategories.nodes.filter((c) -> c.name is child.name)[0]
      newNode = cat
      newNode['id'] = cat.name
      nodes.push newNode
      links.push {source: node, target: newNode}
      i++
    break  if i is MAX_CHILDREN


  # mark previous root and update it
  if previousRoot
    nodes.filter((n) -> n.id is previousRoot.name)[0]['previousRoot'] = 1
    console.log nodes.filter((n) -> n.id is previousRoot.name)[0]
  # newNode['previousRoot'] = if previousRoot and child.name is previousRoot.name then 1 else 0
  previousRoot = node

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
    .attr 'class', 'node clickable'
    .attr 'category', (d) -> d.id
    .on 'click', nodeClick
  g.append 'circle'
    .attr 'r', 8
  g.append 'text'
    .attr 'x', 12
    .attr 'dy', '.35em'
    .text (d) -> "#{d.name} (#{d.count})"
  # when a node is removed
  node.exit().remove()

  # restart the simulation
  force.start()


# load json and display the first categories
loadJSON = (json) ->
  allCategories = json

  # root category
  root_node = {id: 'all', name: 'all', count: allCategories.nodes.length}
  nodes.push root_node
  currentRoot = root_node

  # get the list of the initial children
  for i in [0...MAX_CHILDREN]
    n = json.nodes[i]
    n['id'] = json.nodes[i].name
    nodes.push n
    links.push {source: root_node, target: n}

  # start the animation
  start()


# here we go
d3.json 'flare.json', loadJSON
