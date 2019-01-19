


data_virus = []
data_eukaryota = []
data_bacteria = []
data_archaea = []

// Create list of 10000 for every domain. Limit has to be 10000 since the performance would be too bad
for (i = 0; i < dark_proteins.length; i++){
  if ((data_virus.length < 10000) && (dark_proteins[i]._domain == "Viruses")){
    data_virus.push(dark_proteins[i])
  }
  else if ((data_eukaryota.length < 10000) && (dark_proteins[i]._domain == "Eukaryota")){
    data_eukaryota.push(dark_proteins[i])
  }
  else if ((data_bacteria.length < 10000) && (dark_proteins[i]._domain == "Bacteria")){
    data_bacteria.push(dark_proteins[i])
  }
  else if ((data_archaea.length < 10000) && (dark_proteins[i]._domain == "Archaea")){
    data_archaea.push(dark_proteins[i])
  }
}

// Options for the plot (domains and attributes)
var domainMap = { "Eukaryota": data_eukaryota,
                  "Viruses": data_virus,
                  "Bacteria": data_bacteria,
                  "Archaea": data_archaea
                }

var attributeMap = {"Membrane": "_membrane",
                    "Disorder": "_disorder",
                    "Compositional bias": "_compositional_bias"
                    }


// Main function
function createDensityPlot(domainMap, attributeMap){
// Important variables
  var margin = {top: 70, right: 70, bottom: 170, left: 70};
  var svgHeight = 800;
  var svgWidth = 800;
  var myChartWidth = svgWidth - margin.left - margin.right;
  var myChartHeight = svgHeight - margin.top - margin.bottom;
  var dot_radius = 3;
  var currentAttribute = NaN;
  var currentDomain = NaN;


  // create scale objects
  var xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, myChartWidth]);
  var yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([myChartHeight, 0]);



  // create axis objects
  var xAxis = d3.axisBottom(xScale)
    .ticks(10, "s");
  var yAxis = d3.axisLeft(yScale)
    .ticks(10, "s");



    var svg = d3.select('#content').append("svg")
          .attr("width", svgWidth)
          .attr("height", svgHeight)


// Creates and updates the complete chart
var updateChart = function(data, key){

  // create a clipping region
svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", myChartWidth)
    .attr("height", myChartHeight);


var div = d3.select("#content").append("div")
    .attr("class", "tooltip");


// Place Axis
var g_XAxis = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + (margin.top + myChartHeight) + ')')
  .attr("class", "axisScatter")
  .call(xAxis);
var g_YAxis = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr("class", "axisScatter")
  .call(yAxis);


  // X-Axis labeling
	svg.append("text")
	  .attr("transform",
			"translate(" + (svgWidth/2 ) + " ," + (myChartHeight + 110) + ")")
    .attr("class", 'axisLabel')
	  .text(key + " [%]");

  // Y-Axis labeling
	svg.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 30)
		  .attr("x",0 - (svgHeight / 2) + 50)
      .attr("class", 'axisLabel')
		  .text("Darkness [%]");



  // encapsulating points and invisible background (+ clipping)
  var plot_surface = svg.append("g")
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr("clip-path", "url(#clip)")
    .classed("plot_surface", true);




  // Pan and zoom
var zoom = d3.zoom()
    .scaleExtent([0.95, 10])
    //.translateExtent([[-20, -20], [620, 620]])
    .on("zoom", zoomed);


    //invisible background rectangle for zoom and dragging
    plot_surface.append("rect")
    .attr("class", "zoomRect")
    .attr("width", myChartWidth)
    .attr("height", myChartHeight)
    //.style("fill", "transparent")

  // actual datapoints
  var points = plot_surface.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .classed("dot", true)
        .attr('cx', function(d) {return xScale(Number(d[attributeMap[key]]))})
        .attr('cy', function(d) {return yScale(Number(d["_darkness"]) * 100)}) // darkness is between 0 and 1, whereas the rest is 0 to 100 --> scaling times 100
        .attr('r', dot_radius)
        .attr("fill-opacity","0.4")
        .attr('pointer-events', 'all')
        .on('mouseover', function(d) { // show tooltip
            div.transition()
              .duration(200)
              .style("opacity", 1);
            div.html("ID: " + d._primary_accession + "<br>" + "Kingdom: " + d._kingdom) // Tooltip
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px");})
        .on("mouseout", function(d) {
            div.transition()
             .duration(400)
             .style("opacity", 0);});
  plot_surface
  .call(zoom)// call zoom
  .call(zoom.transform, d3.zoomIdentity.translate(10, 5).scale(0.97)); // set inital zoom level


  // Zoom function
  function zoomed() {
// create new scale ojects based on event
    var updated_xScale = d3.event.transform.rescaleX(xScale);
    var updated_yScale = d3.event.transform.rescaleY(yScale);
// update axes
    g_XAxis.call(xAxis.scale(updated_xScale));
    g_YAxis.call(yAxis.scale(updated_yScale));
    points.data(data)
     .attr('cx', function(d) {return updated_xScale(Number(d[attributeMap[key]]))})
     .attr('cy', function(d) {return updated_yScale(Number(d["_darkness"]) * 100)});
    }




}

    // create dropdon menu for attribute
    var dropdownChangeAttribute = function() {
        var newAttribute = d3.select(this).property('value');
        currentAttribute = newAttribute;
        svg.selectAll("*").remove();
        updateChart(domainMap[currentDomain] ,newAttribute); // update chart
    };

    var myAttributes = Object.keys(attributeMap); // list of attribute keys

    var dropdownAttribute = d3.select("#my-menu-attribute")
                    .insert("select", "svg")
                    .on("change", dropdownChangeAttribute);

    dropdownAttribute.selectAll("option")
      .data(myAttributes)
      .enter().append("option")
      .attr("value", function (d) { return d; })
      .text(function (d) {return d;});





      // create dropdon menu for domain data set
    var dropdownChangeDomain = function() {
        var newDomain = d3.select(this).property('value');
        currentDomain = newDomain;
        var newData   = domainMap[newDomain];
        svg.selectAll("*").remove();
        updateChart(newData, currentAttribute);// update chart
    };

    var myDomains = Object.keys(domainMap);

    var dropdownDomain = d3.select("#my-menu-domain")
                    .insert("select", "svg")
                    .on("change", dropdownChangeDomain);

    dropdownDomain.selectAll("option")
      .data(myDomains)
      .enter().append("option")
      .attr("value", function (d) { return d; })
      .text(function (d) {return d});


    currentDomain = "Eukaryota" // initial Values for the Scatter plot
    currentAttribute = "Membrane"

    var initialData = domainMap[currentDomain];
    updateChart(initialData, currentAttribute);


};

  window.onload = function() {
    myPlot = createDensityPlot(domainMap, attributeMap);
  };
