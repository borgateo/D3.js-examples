var dataset = {
    lower: [0,100],
    upper: [100,0]
};

var duration   = 500,
    transition = 200;

var width = 460,
    height = 300,
    radius = Math.min(width, height) / 2;
var pie = d3.layout.pie().sort(null);

var color = d3.scale.category20();

var arc = d3.svg.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 75);

var svg = d3.select("#svg_donut").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var path = svg.selectAll("path")
    .data(pie(dataset.lower))
    .enter().append("path")
    .attr("class", function(d, i) { return "color" + i })
    .attr("d", arc)
    .each(function(d) { this._current = d; });
    

var progress = 0;
    var timeout = setTimeout(function () {
      clearTimeout(timeout);
      path = path.data(pie(dataset.upper)); // update the data
      path.transition().duration(duration).attrTween("d", function (a) {
        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        var i  = d3.interpolate(this._current, a);
        var i2 = d3.interpolate(progress, 100)
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      }); // redraw the arcs
    }, 200);

