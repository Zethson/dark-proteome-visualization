(function () {
  // Declare general variables
  let width, height,
      chartWidth, chartHeight,
      margin,
      selected,
      data;

  // Function to create plot
  let createPlot = function () {
    setSize();
    drawChart(dark_proteomes);
  }


function drawChart(data) {
  let xAxis = d3.scaleBand().range([0, chartWidth], 1),
      yAxis = {},  // this maps the attribute name to it's axis
      line = d3.line(),
      axis = d3.axisLeft(),
      keys = d3.keys(data[0]);  // array with names of attributes
  // Delete non-numeric keys
  let index = keys.indexOf('_primary_accession');
  if (index > -1) {
    keys.splice(index, 1);
  }

  // selected map's the selected value-ranges of the attributes
  selected = keys.map(function(p) { return [0,0]; });

  // Get axis, create scales
  xAxis.domain(keys);
  for (let i = 0; i < keys.length; i++) {
    yAxis[keys[i]] = d3.scaleLinear().domain(d3.extent(data, function(obj) {
      let val = +obj[keys[i]];
      return (isNaN(val)) ? data[0][keys[i]] : val;
    })).range([chartHeight, 0]);
  }

  // Draw lines
  lines = chartLayer.append("g")
    .selectAll("path")
      .data(data)
        .enter()
        .append("path")
        .attr("d", function path(d) {
          //console.log( line(keys.map(function(dim) { return [xAxis(dim), yAxis[dim](d[dim])]})));
          return line(keys.map(function(dim) { return [xAxis(dim), yAxis[dim](d[dim])]}))})
        .attr("stroke", "deeppink")
        .style("stroke-opacity", "0.01")
        .attr("fill", "none");

  var g = chartLayer.selectAll(".dim")
                    .data(keys)
                    .enter().append("g")
                    .attr("transform", function(d) { return "translate(" + xAxis(d) + ")"; });

  // write up axis titles
  g.append("g")
      .each(function(d) {
         d3.select(this)
           .call(axis.scale(yAxis[d])); });
  g.append("text")
   .style("text-anchor", "middle")
   .attr("y", -9)
   .style('fill', 'white')
   .attr("cursor", "move")
   .text(function(d) { return d.substring(1); });

  // use brushing to perform axis-wise selections
  g.append("g")
    .attr("class", "brush")
    .each(function(d) {
       d3.select(this).call(yAxis[d].brush = d3.brushY().extent([[-10, 0], [10, chartHeight]])
         .on("brush start", selectInit)
         .on("brush", selectionOnAxis));
    })
    .selectAll("rect")
      .attr("x", -10)
      .attr("width", 15);

  function selectInit() {
    d3.event.sourceEvent.stopPropagation();
  }
  
  function selectionOnAxis() {
    // get selection per axis
    for (let i = 0; i < keys.length; ++i) {
      if (d3.event.target==yAxis[keys[i]].brush) {
        selected[i] = d3.event.selection.map(yAxis[keys[i]].invert, yAxis[keys[i]]);
      }
    }
  
    // toggle which lines are displayed on basis of selection indices
    lines.style("display", function(d) {
      return keys.every(function(p, i) {
        if (selected[i][0] == 0 && selected[i][0] == 0) {
          return true;
        } else {
          return selected[i][1] <= d[p] && d[p] <= selected[i][0];
        }
      }) ? null : "none";
    });
  }
}

function setSize() {
  width = 1200;
  height = 660;

  margin = {top: 50, left: 50, bottom: 50, right: 50};

  chartWidth = width - (margin.left + margin.right);
  chartHeight = height - (margin.top + margin.bottom);

  svg.attr("width", width).attr("height", height);

  chartLayer
      .attr("width", chartWidth)
      .attr("height", chartHeight)
      .attr("transform", "translate(" + [margin.left, margin.top] + ")")
}

var svg = d3.select("#content")
  .append("svg");
var chartLayer = svg.append("g")
  .classed("chartLayer", true);


createPlot();

}());
