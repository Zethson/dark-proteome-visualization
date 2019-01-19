dark_proteins.length = 100000

  // create custom bins
  function thresholdArray(bins, max_Value) {
    thresholds = []
    for (i = max_Value/bins; i < max_Value; i = i + max_Value/bins){
      thresholds.push(i)
    }
    return thresholds
  }

  let darkData = {"Membrane": [], "Bias": [], "Disorder": [], "Length": []};
  let brightData = {"Membrane": [], "Bias": [], "Disorder": [], "Length": []};

  for (i = 0; i < dark_proteins.length; i++){
    if (Number(dark_proteins[i]._darkness) > 0.5){
      darkData["Membrane"].push(Number(dark_proteins[i]._membrane))
      darkData["Bias"].push(Number(dark_proteins[i]._compositional_bias))
      darkData["Disorder"].push(Number(dark_proteins[i]._disorder))
    }
    else{
      brightData["Membrane"].push(Number(dark_proteins[i]._membrane))
      brightData["Bias"].push(Number(dark_proteins[i]._compositional_bias))
      brightData["Disorder"].push(Number(dark_proteins[i]._disorder))
    }
  };

// For bin calculation
  let valuesScalePow =  d3.scalePow()
    .exponent(Math.E)
    .domain([0,30])
    .range([1,100]);

  bins = []
  for (i = 1; i <= 30; i++){
    bins.push(valuesScalePow(i))
  }

  let binsDarkData = {
    "Membrane": d3.histogram().domain([0, 100]).thresholds(bins)
    (darkData["Membrane"]),
    "Bias": d3.histogram().domain([0, 100]).thresholds(bins)
    (darkData["Bias"]),
    "Disorder": d3.histogram().domain([0, 100]).thresholds(bins)
    (darkData["Disorder"]),
  }

  let binsBrightData = {
    "Membrane": d3.histogram().domain([0, 100]).thresholds(bins)(brightData["Membrane"]),
    "Bias": d3.histogram().domain([0, 100]).thresholds(bins)(brightData["Bias"]),
    "Disorder": d3.histogram().domain([0, 100]).thresholds(bins)(brightData["Disorder"]),
  }

function butterflyChart() {
  let returnDictionary = {};
  let margin = {top: 60, right: 30, bottom: 60, left: 100};
  let width = 900 - margin.left - margin.right;
  let height = 600 - margin.top - margin.bottom;
  let myChartWidth = width - margin.left - margin.right;
  let myChartHeight = height - margin.top - margin.bottom;
  let my_right = NaN;
  let my_left = NaN;
  let panel = NaN;
  let zeroToggle = true;
  let attribute = "Membrane"

  let xdata = ["100", "80", "60", "40", "20", "0", "20", "40", "60", "80", "100"]; // custom axis labeling, since "scaling" does not properly work for irregular axis
  let xdata6 = ["6", "4.8", "3.6", "2.4", "1.2", "0", "1.2", "2.4", "3.6", "4.8", "6"];

  // values Scaling for bright and dark data respectively
  let xScaleDark  = d3.scaleLinear()
                        .domain([0, darkData["Membrane"].length])
                        .range([0, myChartWidth/2]);

  let xScaleBright =  d3.scaleLinear()
                        .domain([0, brightData["Membrane"].length])
                        .range([0, myChartWidth/2]);

  // Scaling for Y-Axis
  let valuesScalePowLabels =  d3.scaleLog()
      .base(Math.E)
      .domain([1,100])
      .range([0,myChartHeight]);

  let xScale = d3.scaleLinear()
      .domain([0, dark_proteins.length])
      .range([0, myChartWidth/2]);

  // scaling for X Axis (custom), dummy variable since a scaling is needed for Axis creation
  let forXAxis = d3.scaleLinear()
      .domain([0,10])
      .range([0, myChartWidth]);

  let yScale = d3.scaleLinear()
      .domain([0, binsBrightData["Membrane"].length])
      .range([0, myChartHeight]);

// Creates panel
  function buildPanel(yScale, myTicks){
      let svg = d3.select("#content_Steffen").append("svg")
                 .attr("width", width)
                 .attr("height", height);

      let panel = svg.append("g")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // Y Axis in the middle of the plot without ticks and labels, since the labels are covered by the bars on both sides
      panel.append("g")
        .attr("class", "axis_SL axisButterfly_SL")
        .attr("transform", "translate(" + myChartWidth/2 + ",0)")
        .call(d3.axisLeft(yScale).tickValues([]))
      // Y Axis on the left of the plot with ticks and labels
      panel.append("g")
        .attr("class", "yAxis_SL axisButterfly_SL")
        .attr("transform", "translate(" + 0 + ",0)")
        .call(d3.axisLeft(valuesScalePowLabels).tickValues(myTicks))
      // X Axis on the bottom of the plot with custom tick labeling
      panel.append("g")
        .attr("class", "xAxis_SL axisButterfly_SL")
        .attr("transform", "translate(0," + myChartHeight + ")")
        .call(d3.axisBottom(forXAxis).ticks(10).tickFormat(function (d) {return xdata[d]})); // xData contains the custom labeling

        // X-Axis labeling
      panel.append("text")
          .attr("class", "Xaxis-label_SL")
      	  .attr("transform",
      			"translate(" + (myChartWidth/2 ) + " ," + (myChartHeight + 40) + ")")
      	  .text("Percentage of Total");

        // Y-Axis labeling
      	panel.append("text")
            .attr("class", "Yaxis-label_SL")
      		  .attr("transform", "rotate(-90)")
      		  .attr("y", -30)
      		  .attr("x", 60 - (height / 2)  )
      		  .text("Membrane" + " [%]");
        panel.append("text")
            .attr("class", "descriptionHeader_SL darkH_SL")
            .attr("transform",
              "translate(" + (myChartWidth/4 ) + " ," + (-20) + ")")
            .text("Dark Proteome");
        panel.append("text")
            .attr("class", "descriptionHeader_SL brightH_SL")
            .attr("transform",
              "translate(" + (myChartWidth/4 * 3) + " ," + (-20) + ")")
            .text("Bright Proteome");
      return panel;
      }

      // Updates for Graph on Button press
      returnDictionary["update1"] = function myUpdate(){
        attribute = "Membrane"
        updateGraph();
        }
      returnDictionary["update2"] = function myUpdate(){
        attribute = "Bias"
        updateGraph();
        }

      returnDictionary["update3"] = function myUpdate(){
        attribute = "Disorder"
        updateGraph();
        }

        returnDictionary["update5"] = function myUpdate(){
          if (zeroToggle) {
            zeroToggle = false;
          }
          else {
            zeroToggle = true;
          }
          updateGraph();
          }

      // function is called when button is pressed. The respective attribute for
      // the change is handed
      function updateGraph(){
        if (zeroToggle == false){
            myBrightData = binsBrightData[attribute].slice(1,-1)
            myDarkData = binsDarkData[attribute].slice(1,-1)
            panel.selectAll("g.xAxis_SL")
              .call(d3.axisBottom(forXAxis).ticks(10).tickFormat(function (d) {return xdata6[d]}));
            scalingFactor = 100/6;
        }
        else{
          myBrightData = binsBrightData[attribute]
          myDarkData = binsDarkData[attribute]
          panel.selectAll("g.xAxis_SL")
            .call(d3.axisBottom(forXAxis).ticks(10).tickFormat(function (d) {return xdata[d]}));
          scalingFactor = 1;
        }

        my_right.data(myBrightData) // bright data is updated
            .transition()
            .duration(1000)
            .attr("x", function(d, i) {return myChartWidth/2 })
            .attr("y", function(d, i) {return yScale(i)})
            .attr("width", function(d, a) {return xScaleBright(d.length) * scalingFactor});

        my_left.data(myDarkData) // dark data is updated
            .transition()
            .duration(1000)
            .attr("x", function(d, i) {return myChartWidth/2 - (xScaleDark(d.length) * scalingFactor) })
            .attr("y", function(d, i) {return yScale(i)})
            .attr("width", function(d, a) {return xScaleDark(d.length) * scalingFactor});
        panel.select("text.Yaxis-label_SL")
          .text(attribute + " [%]")
      }

    returnDictionary["init"] = function () {
      let myTicks = [2,5,10,20,40,80];
            panel = buildPanel(yScale, myTicks);
            my_right = panel.selectAll(".bar")
                     .data(binsBrightData[attribute])
            	        .enter()
                      .append("rect")
                      .attr("class", "brightBar_SL")
            		      .attr("x", function(d, i) {return myChartWidth/2})
            		      .attr("y", function(d, i) {return yScale(i)})
            		      .attr("width", function(d, a) {return xScaleBright(d.length) })
            		      .attr("height", myChartHeight/binsBrightData[attribute].length);

            my_left = panel.selectAll(".bar")
                     .data(binsDarkData[attribute])
                      .enter()
                      .append("rect")
                      .attr("class", "darkBar_SL")
                      .attr("x", function(d, i) {return myChartWidth/2 - xScaleDark(d.length) })
                      .attr("y", function(d, i) {return yScale(i)})
                      .attr("width", function(d, a) {return xScaleDark(d.length) })
                      .attr("height", myChartHeight/binsBrightData[attribute].length);
    	};
  return returnDictionary;
};

window.onload = function() {
  myPlot = butterflyChart();
  myPlot.init();
  document.getElementById('button1').addEventListener("click", myPlot.update1); // Membrane
  document.getElementById('button2').addEventListener("click", myPlot.update2); // Bias
  document.getElementById('button3').addEventListener("click", myPlot.update3); // Disorder
  document.getElementById('button5').addEventListener("click", myPlot.update5); // Include/Exclude zeros
};
