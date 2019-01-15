  var width = 900;
  var height = 400;
  var barWidth = 30;

  var margin = {top: 20, right: 10, bottom: 20, left: 10};

  var width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;

  var totalWidth = width + margin.left + margin.right;
  var totalheight = height + margin.top + margin.bottom;
   
//  console.log(dark_proteins);
  console.log(cat);

  window.onload = function() {
  myGraph = BoxPlot(param);

 function BoxPlot(a){
  
  var dark    = [];
  for(i=0; i< cat.length; i++)
	dark[i] = [];

  var nondark = [];
  for(i=0; i< cat.length; i++)
	nondark[i] = [];
  
  for(i=0; i<dark_proteins.length; i++) {
	for(j=0; j<cat.length; j++) {
	    if ((dark_proteins[i]["_domain"] == cat[j]) && (Number(dark_proteins[i]["_darkness"]) <= 0.5))
//		    dark[j].push(dark_proteins[i]);		 //asa push corect, dar tot randul
            dark[j].push(Number(dark_proteins[i][a]))
		if ((dark_proteins[i]["_domain"] == cat[j]) && (Number(dark_proteins[i]["_darkness"]) > 0.5))
//			nondark[j].push(dark_proteins[i]);   //asa push corect, dar tot randul
            nondark[j].push(Number(dark_proteins[i][a]));
    }
  }
  
  console.log(dark);
  console.log(nondark);
  
  var groupCounts = {};
  k1 = 0;
  k2 = 0;
  for(i=0; i< 2 * cat.length; i++) {
    var key = i.toString();
    groupCounts[key] = [];
	
	if(i%2 == 0){
		groupCounts[key] = dark[k1];
	    k1++;
	}
	else {
		groupCounts[key] = nondark[k2];
	    k2++;
	}
  }
  
  console.log(groupCounts);

  // Sort group counts so quantile methods work
  for(var key in groupCounts) {
    var groupCount = groupCounts[key];
    groupCounts[key] = groupCount.sort(sortNumber);
  }

  // Setup a color scale for filling each box d3.schemeCategory20
  var colorScale = d3.scaleOrdinal()
    .domain(Object.keys(groupCounts))
	.range(["#696969","#dcdcdc","#696969","#dcdcdc","#696969","#dcdcdc","#696969","#dcdcdc"]);

  // Prepare the data for the box plots
  var boxPlotData = [];
  for (var [key, groupCount] of Object.entries(groupCounts)) {

    var record = {};
    var localMin = d3.min(groupCount);
    var localMax = d3.max(groupCount);
	
	var key1 = [];
	for(i = 0; i<cat.length; i++){
		key1[2*i] = cat[i] + "_D"
	    key1[2*i +1] = cat[i] + "_ND"
	}
	
    record["key"] = key;
    record["counts"] = groupCount;
    record["quartile"] = boxQuartiles(groupCount);
    record["whiskers"] = [localMin, localMax];
    record["color"] = colorScale(key);

    boxPlotData.push(record);
  }

  // Compute an ordinal xScale for the keys in boxPlotData
  var xScale = d3.scalePoint()
    .domain(Object.keys(groupCounts))
    .rangeRound([0, width])
    .padding([0.5]);

  // Compute a global y scale based on the global counts
  var min1 = [];
  var max1 = [];
  var min2 = [];
  var max2 = [];
  for(i=0; i<cat.length;i++){
	  min1[i] = d3.min(dark[i]);
      max1[i] = d3.max(dark[i]);
	  min2[i] = d3.min(nondark[i]);
	  max2[i] = d3.max(nondark[i]);
  }
	  
  var min = Math.min(d3.min(min1), d3.min(min2));
  var max = Math.max(d3.max(max1), d3.max(max2));
  console.log(min);
  console.log(max);
  var yScale = d3.scaleLinear()
    .domain([min, max])
    .range([0, height]);

  // Setup the svg and group we will draw the box plot in
  var svg = d3.select("body").append("svg")
    .attr("width", totalWidth)
    .attr("height", totalheight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Move the left axis over 25 pixels, and the top axis over 35 pixels
  var axisG = svg.append("g").attr("transform", "translate(25,0)");
  var axisTopG = svg.append("g").attr("transform", "translate(35,0)");

  // Setup the group the box plot elements will render in
  var g = svg.append("g")
    .attr("transform", "translate(20,5)");

  // Draw the box plot vertical lines
  var verticalLines = g.selectAll(".verticalLines")
    .data(boxPlotData)
    .enter()
    .append("line")
    .attr("x1", function(datum) {
        return xScale(datum.key) + barWidth/2;
      }
    )
    .attr("y1", function(datum) {
        var whisker = datum.whiskers[0];
        return yScale(whisker);
      }
    )
    .attr("x2", function(datum) {
        return xScale(datum.key) + barWidth/2;
      }
    )
    .attr("y2", function(datum) {
        var whisker = datum.whiskers[1];
        return yScale(whisker);
      }
    )
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .attr("fill", "none");

  // Draw the boxes of the box plot, filled in white and on top of vertical lines
  var rects = g.selectAll("rect")
    .data(boxPlotData)
    .enter()
    .append("rect")
    .attr("width", barWidth)
    .attr("height", function(datum) {
        var quartiles = datum.quartile;
        var height = yScale(quartiles[2]) - yScale(quartiles[0]);
        return height;
      }
    )
    .attr("x", function(datum) {
        return xScale(datum.key);
      }
    )
    .attr("y", function(datum) {
        return yScale(datum.quartile[0]);
      }
    )
    .attr("fill", function(datum) {
      return datum.color;
      }
    )
    .attr("stroke", "#000")
    .attr("stroke-width", 1);

  // Now render all the horizontal lines at once - the whiskers and the median
  var horizontalLineConfigs = [
    // Top whisker
    {
      x1: function(datum) { return xScale(datum.key) },
      y1: function(datum) { return yScale(datum.whiskers[0]) },
      x2: function(datum) { return xScale(datum.key) + barWidth },
      y2: function(datum) { return yScale(datum.whiskers[0]) }
    },
    // Median line
    {
      x1: function(datum) { return xScale(datum.key) },
      y1: function(datum) { return yScale(datum.quartile[1]) },
      x2: function(datum) { return xScale(datum.key) + barWidth },
      y2: function(datum) { return yScale(datum.quartile[1]) }
    },
    // Bottom whisker
    {
      x1: function(datum) { return xScale(datum.key) },
      y1: function(datum) { return yScale(datum.whiskers[1]) },
      x2: function(datum) { return xScale(datum.key) + barWidth },
      y2: function(datum) { return yScale(datum.whiskers[1]) }
    }
  ];

  for(var i=0; i < horizontalLineConfigs.length; i++) {
    var lineConfig = horizontalLineConfigs[i];

    // Draw the whiskers at the min for this series
    var horizontalLine = g.selectAll(".whiskers")
      .data(boxPlotData)
      .enter()
      .append("line")
      .attr("x1", lineConfig.x1)
      .attr("y1", lineConfig.y1)
      .attr("x2", lineConfig.x2)
      .attr("y2", lineConfig.y2)
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("fill", "none");
  }

  // Setup a scale on the left
  var axisLeft = d3.axisLeft(yScale);
  axisG.append("g")
    .call(axisLeft);

  // Setup a series axis on the top
  var axisTop = d3.axisTop(xScale);
  axisTopG.append("g")
    .call(axisTop);

	function boxQuartiles(d) {
  	return [
    	d3.quantile(d, .25),
    	d3.quantile(d, .5),
    	d3.quantile(d, .75)
  	];
	}
    
  // Perform a numeric sort on an array
  function sortNumber(a,b) {
    return a - b;
  }
 };  
};  