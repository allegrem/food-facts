//some global variables
w = 1200
h = 800

//create svg container
svg = d3.select('body').append('svg').attr('width', w).attr('height', h)

//center text
txt = svg.append('text')
  .text('Sodas')
  .attr('x', 20)
  .attr('y', 20)
  .attr('font-family', 'sans-serif')
  .attr('font-size', '30px')
  .attr('fill', 'red')
  

# # create force layout
# force = d3.layout.force()
#   .on "tick", tick
#   .charge (d) -> d.count
#   .linkDistance 80
#   .size [w, h-160]

# # create visualization
# vis = d3.select("body").append("svg:svg")
#   .attr("width", w)
#   .attr("height", h)

# # load json
# root = null
# d3.json "flare.json", (json) ->
#   root = json
#   root.fixed = true
#   root.x = w / 2
#   root.y = h / 2 - 80
#   update()


# tick = ->
#   link.attr "x1", (d) -> d.source.x
#     .attr "y1", (d) -> d.source.y
#     .attr "x2", (d) -> d.target.x
#     .attr "y2", (d) -> d.target.y
#   node.attr "cx", (d) -> d.x
#     .attr "cy", (d) -> d.y

# update = ->  #TODO