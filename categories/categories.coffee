# some global variables
w = 1280
h = 800

# create force layout
force = d3.layout.force()
  .on "tick", tick
  .charge (d) -> d.count
  .linkDistance 80
  .size [w, h-160]

# create visualization
vis = d3.select("body").append("svg:svg")
  .attr("width", w)
  .attr("height", h)

# load json
root = null
d3.json "flare.json", (json) ->
  root = json
  root.fixed = true
  root.x = w / 2
  root.y = h / 2 - 80
  update()

tick = ->  #TODO
update = ->  #TODO