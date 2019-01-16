(function () {
  let width, height;
  let chartWidth, chartHeight;
  let margin;

  let data;

  let createPlot = function () {
    
    loadData("proteome")
    //loadData("protein")
    setSize();
    drawChart(data);
  }

function loadData(type) {
  if (type == "proteome") {
    data = [];
    for (let i = 0; i < dark_proteomes.length; i++) {
      data.push({
        uncertainty : dark_proteomes[i]._uncertainty,
        length : dark_proteomes[i]._length,
        disorder: dark_proteomes[i]._disorder,
        primary_accession: dark_proteomes[i]._primary_accession,
        compositional_bias: dark_proteomes[i]._compositional_bias,
        membrane: dark_proteomes[i]._membrane
      });
    }
  } else {
    data = [];
    for (let i = 0; i < dark_proteomes.length; i++) {
      data.push({
        domain : dark_proteomes[i]._domain,
        kingdom : dark_proteomes[i]._kingdom,
        organism_id : dark_proteomes[i]._organism_id,
        darkness : dark_proteomes[i]._darkness,
        length : dark_proteomes[i]._length,
        disorder: dark_proteomes[i]._disorder,
        primary_accession: dark_proteomes[i]._primary_accession,
        compositional_bias: dark_proteomes[i]._compositional_bias,
        membrane: dark_proteomes[i]._membrane
      });
    }
  }

}

function drawChart(data) {
  let xAxis = d3.scaleBand().range([0, width], 1),
      yAxis = {},
      line = d3.line(),
      axis = d3.axisLeft(),
      keys = d3.keys(data[0])
    ;

  // Get axis, create scales
  xAxis.domain(keys);
  for (let i = 0; i < keys.length; i++) {
    console.log(d3.extent(data, function(obj) {return obj[keys[i]];}));
    yAxis[keys[i]] = d3.scaleLinear().domain(d3.extent(data, function(obj) {
      let val = +obj[keys[i]];
      return (isNaN(val)) ? 1 : val;
    })).range([height, 0]);
  }
  console.log(yAxis);

  // Draw lines
  svg.append("g")
    .selectAll("path")
      .data(data)
        .enter()
        .append("path")
        .attr("d", function path(d) {
          //console.log( line(keys.map(function(dim) { return [xAxis(dim), yAxis[dim](d[dim])]})));
          return line(keys.map(function(dim) { return [xAxis(dim), yAxis[dim](d[dim])]}))})
        .attr("stroke", "blue")
        .style("stroke-opacity", "0.01")
        .attr("fill", "none");
 console.log("Plotting executed");

  var g = svg.selectAll(".dim")
      .data(keys)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + xAxis(d) + ")"; });

  g.append("g")
      .each(function(d) { d3.select(this).call(axis.scale(yAxis[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -10)
      .text(function(d) { return d; });

}

  /**
   * defines sizes and margins for the svg
   */
  function setSize() {
      width = 1200;
      height = 660;

      margin = {top: 0, left: 0, bottom: 0, right: 0};

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

 console.log("Created svg, start plotting")

 createPlot();

}());
