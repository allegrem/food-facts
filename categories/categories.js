// Generated by CoffeeScript 1.3.3
(function() {
  var MAX_CHILDREN, currentIndex, force, h, link, links, loadJSON, node, nodes, previousRoot, start, svgContainer, tick, w;

  w = 800;

  h = 500;

  MAX_CHILDREN = 10;

  currentIndex = 0;

  nodes = [];

  links = [];

  window.allCategories = {};

  previousRoot = null;

  tick = function() {
    node.attr('transform', function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
    return link.attr("x1", function(d) {
      return d.source.x;
    }).attr("y1", function(d) {
      return d.source.y;
    }).attr("x2", function(d) {
      return d.target.x;
    }).attr("y2", function(d) {
      return d.target.y;
    });
  };

  force = d3.layout.force().nodes(nodes).links(links).size([w, h]).linkDistance(150).charge(-600).on("tick", tick);

  svgContainer = d3.select('#graph').append('svg').attr('width', w).attr('height', h);

  svgContainer.append('rect').attr('height', h).attr('width', w).attr('style', 'fill:white');

  link = svgContainer.selectAll('.link');

  node = svgContainer.selectAll('.node');

  window.nodeClick = function(node) {
    var cat, child, i, newNode, _i, _len, _ref;
    links = [];
    nodes = [node];
    force.links(links);
    force.nodes(nodes);
    if (node === previousRoot) {
      if (node.links.length > currentIndex + MAX_CHILDREN) {
        currentIndex += MAX_CHILDREN;
      }
    } else {
      currentIndex = 0;
    }
    i = 0;
    _ref = node.links.slice(currentIndex);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (nodes.filter(function(n) {
        return n.id === child.name;
      }).length === 0) {
        cat = window.allCategories.nodes.filter(function(c) {
          return c.name === child.name;
        })[0];
        newNode = cat;
        newNode['id'] = cat.name;
        nodes.push(newNode);
        links.push({
          source: node,
          target: newNode
        });
        i++;
      }
      if (i === MAX_CHILDREN) {
        break;
      }
    }
    previousRoot = node;
    return start();
  };

  start = function() {
    var g;
    link = link.data(force.links(), function(d) {
      return d.source.id + "-" + d.target.id;
    });
    link.enter().insert("line", ".node").attr("class", "link");
    link.exit().remove();
    node = node.data(force.nodes(), function(d) {
      return d.id;
    });
    g = node.enter().append('g').attr('class', 'node clickable').attr('category', function(d) {
      return d.id;
    }).on('click', nodeClick);
    g.append('circle').attr('r', 8);
    g.append('text').attr('x', 12).attr('dy', '.35em').text(function(d) {
      return "" + d.name + " (" + d.count + ")";
    });
    node.exit().remove();
    return force.start();
  };

  loadJSON = function(json) {
    var currentRoot, i, n, root_node, _i;
    window.allCategories = json;
    root_node = {
      id: 'all',
      name: 'all',
      count: window.allCategories.nodes.length
    };
    nodes.push(root_node);
    currentRoot = root_node;
    for (i = _i = 0; 0 <= MAX_CHILDREN ? _i < MAX_CHILDREN : _i > MAX_CHILDREN; i = 0 <= MAX_CHILDREN ? ++_i : --_i) {
      n = json.nodes[i];
      n['id'] = json.nodes[i].name;
      nodes.push(n);
      links.push({
        source: root_node,
        target: n
      });
    }
    return start();
  };

  d3.json('../categories/flare.json', loadJSON);

}).call(this);
