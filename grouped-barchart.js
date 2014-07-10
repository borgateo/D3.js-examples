/* 
** Note: This is not a plugin. it's just a bunch of functions to get some inspiration
** Author: Matteo Borgato 
** year: 2014
*/
var getDummyData = function () {
    
    var data;
    var n     = 48;   // number of samples
    var m     = 2;    // number of series
    var min   = 0;
    var max   = 2500; // maximum value
    var time  = new Date();
    time.setHours(0,0,0,0);
    var views;

    return d3.range( m ).map( function() {
        return d3.range(n).map( function() {
           views = Math.floor( Math.random() * (max - min) + min);
           time  = new Date( time.getTime() + (30 * 60 * 1000) );
           return {
               "views" : views,
                "program" : "Title "+ time.getHours() +":"+ time.getMinutes()
           };
        });
    });

};

/* Given the dataset -> fetch the max and floor to the nearest hunder
** Used to y-axes scale
*/
var getMax = function (dataset) {
 //var array = Object.keys(dataset).map(function (key) { return dataset[key]; });
    var max    = 0;
    var temp   = {};
    for (var i = 0; i < dataset.length; i++) {
        for (var key in dataset[i]) {
            temp = dataset[i];
            if (temp.hasOwnProperty(key) && temp[key].views > max) {
               max = temp[key].views;
            }
        }
    }

    // Rounding integers to nearest hundred  
    var len = Math.log(max) / Math.LN10;
    var div = Math.pow(10, Math.floor(len));
    return Math.ceil(max / div) * div;
};


/* render it with D3
** @param: 
** - data: JSON data
*/
var renderGraph = function (data) {
  // --- config ----
  var graphTitle =  "Here the Title";
  var logo       = {
    source: "images/logo.png",
    height: 75,
    width: 240
  };
  var barsOpt    = [
    {
      title: "first bar",
      color: "#003C57"
    } , {
      title: "second bar",
      color: "#C00000"
    } 
  ]; // you can add more elements to group more barcharts
  
  var axis = {
    x: "x-axis",
    y: "y-axis",
    fontSize: "18px",
    colour: "#000",
    xGridColour: "#F0F0F0",
    yGridColour: "#E5E5E5"
  };
  //--------------

  // Prepare the dummy data
  var n     = data[0].length; // number of samples
  var m     = data.length;    // number of series
  var min   = 0;
  var max   = getMax(data);

  // 48 bars -> w: 1300 h: 800
  // min = 800 x 300
  var margin = {
      top: 100,
      right: 30,
      bottom: 300,
      left: 75
  };
  var width  = 18 * n + 500 - margin.left - margin.right;
  var height = 18 * n - margin.top - margin.bottom;

  var y = d3.scale.linear()
    .domain([min, max])
    .range([height, 0]);

  var x0 = d3.scale.ordinal()
    .domain(d3.range(n))
    .rangeBands([0, width], 0.6);

  var x1 = d3.scale.ordinal()
    .domain(d3.range(m))
    .rangeBands([0, x0.rangeBand()]);


  var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


  var makeXaxis = function() {
    return d3.svg.axis()
      .scale(x0)
      .orient("bottom")
      .ticks(5);
  };

  var makeYaxis = function() {
    return d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5);
  };

  // append it to HTML
  var svg = d3.select("body").html("").append("svg:svg")
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .style({"font-family": "Arial", "font-size": "11px"})
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("svg:g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // HEADER 
  // logo
  var head = svg.append("g")
    .attr("class", "head")
    .attr("height", 50)
    .attr("width", width)
    .attr("transform", "translate(0, " + -(margin.top / 2) +")");
  head.append("text")
    .attr("text-anchor", "start")
    .style({"font-size": "28px", "font-weight": "bold", "fill": "#003D55"})
    .text('stream');
  head.append("text")
    .attr("text-anchor", "start")
    .style({"font-size": "28px", "font-weight": "bold", "fill": "#00ACD4"})
    .attr("x", 110)
    .attr("text-anchor", "start")
    .text('hub');

  // title
  head.append("text")
    .style({"font-size": "25px"})
    .attr("x", logo.width + 20)
    .attr("text-anchor", "start")
    .text(graphTitle);


  // y-Axis
  svg.append("g")
    .attr("class", "y axis")
    .style({ 'stroke': 'none', 'fill': 'none'})
    .call(yAxis)
    .selectAll('text')
    .style({"fill": axis.colour, "stroke": "none" });

  // x-Axis
  var offset = height + 10;
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + offset + ")")
    .style({ 'stroke': 'none', 'fill': 'none'})
    .call(xAxis)
    .selectAll('text')
    .text(function(d, i) {
      return data[0][i].program+" ";
    })
    .style({"text-anchor": "end", "fill": axis.colour, "stroke": "none" })
    .attr("dx", "-1em")
    .attr("dy", "-.6em")
    .attr("transform", function(d) {
      return "rotate(-90)";
    });

  // grids
  svg.append("g")
    .attr("class", "grid")
    .style({ 'stroke': axis.xGridColour, 'fill': 'none'})
    .attr("transform", "translate(12, 0)")
    .call(makeXaxis()
      .tickSize(height + margin.bottom - 70, 0, 0)
      .tickFormat("")
    );
  svg.append("g")
    .style({ 'stroke': axis.yGridColour, 'fill': 'none'})
    .attr("class", "grid")
    .call(makeYaxis()
      .tickSize(-width, 0, 0)
      .tickFormat("")
    );

  // bars
  var bar = svg.append("g").selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .style("fill", function(d, i) {
      return barsOpt[i].color;
    })
    .attr("transform", function(d, i) { return "translate(" + x1(i) + ",0)"; })
    .selectAll("rect")
    .data(function(d, i) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return x0(i);
    })
    .attr("y", function(d, i) {
      // console.log('value-y:', d.views);
      return y(d.views);
    })
    .attr("width", x1.rangeBand())
    .attr("height", function(d) {
      return height - y(d.views);
    });
   

  // Legend
  var legend = svg.append("g")
    .attr("class", "legend")
    .attr("height", 50)
    .attr("width", 200)
    .attr("transform", "translate(0, -30)");

  legend.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 100)
    .attr("height", 20)
    .style("fill", "#E0F1F1");

  var squares = legend.append("g")
    .attr("class", "legend")
    .attr("height", 50)
    .attr("width", 200)
    .attr("transform", "translate(8, 5)");

  squares.selectAll('rect')
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return i * 50;
    })
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d, i) {
      return barsOpt[i].color;
    });

  squares.selectAll('text')
    .data(data)
    .enter()
    .append("text")
    .attr("x", function(d, i) {
        return i * 50 + 12;
    })
    .attr("y", 9)
    .text(function(d, i) {
      return barsOpt[i].title;
    });

  // X-axis label
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", height + margin.bottom - 40)
    .style("font-size", axis.fontSize)
    .text(axis.x);

  // Y-axis label
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", -margin.left+10)
    .attr("x", -height/2)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("font-size", axis.fontSize)
    .text(axis.y);


  // grids class
  svg.selectAll(".grid")
    .selectAll("path")
    .style({ 'stroke-width': '0'});
};
