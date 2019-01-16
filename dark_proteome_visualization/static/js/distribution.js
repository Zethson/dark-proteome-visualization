
    var margin = {top: 20, right: 80, bottom: 100, left: 100},
        width = +d3.select("#root").style('width').replace("px",'') - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    console.log('width',width);


    d3.csv("dark_proteins_all.csv", function (row) {
        row.Darkness = +row.Darkness;
        row.Length = +row.Length;
        row.Disorder = +row.Disorder;
        row.CompositionalBias = +row.CompositionalBias;
        row.Membrane = +row.Membrane;
        return row;
    }, function(error, data) {
        // Domain
        (function () {
            // create data
            let data_layoutLength = d3.nest().key((d)=>d.Domain).key((d)=>d.Length).entries(data)
                .map(d=>({
                    name: d.key,
                    values: d.values.map(v=>({name: +v.key, value:v.values.length}))
                }));
            let data_layoutDisorder = d3.nest().key((d)=>d.Domain).key((d)=>d.Disorder).sortKeys(d3.ascending).entries(data)
                .map(d=>({
                    name: d.key,
                    values: d.values.map(v=>({name: +v.key, value:v.values.length}))
                }));
            let data_layoutDarkness = d3.nest().key((d)=>d.Domain).key((d)=>d.Darkness).sortKeys(d3.ascending).entries(data)
                .map(d=>({
                    name: d.key,
                    values: d.values.map(v=>({name: +v.key, value:v.values.length}))
                }));


            var draw1 = d3.select("#draw1");
            var draw2 = d3.select("#draw2");
            var draw3 = d3.select("#draw3");
            // color.domain(d3.keys(data[data_layoutLength]));
            console.log('data_layoutLength.map(d=>d.key)',data_layoutLength.map(d=>d.name));
            var color = d3.scale.category10();
            color.domain(data_layoutLength.map(d=>d.name));



            function draw(key, drawData, svg, xName, yName, keys){
                svg.html("");
                let newDrawData = drawData.filter(d=>keys.includes(d.name));
                var canvasG= svg.attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var x = d3.scale.linear()
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");


                var line = d3.svg.line()
                    .interpolate("basis")
                    .x(function(d) { return x(d.name); })
                    .y(function(d) { return y(d.value); });

                x.domain(d3.extent(data.filter(d=>keys.includes(d.Domain)), function(d) { return d[key]; }));

                y.domain([
                    d3.min(newDrawData, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
                    d3.max(newDrawData, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
                ]);

                var zoom = d3.behavior.zoom()
                    .x(x)
                    .y(y)
                    .scaleExtent([1, 32])
                    .on("zoom", ()=>{
                        svg.select(".x.axis").call(xAxis);
                        svg.select(".y.axis").call(yAxis);
                        drawLines();
                    });

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate("+ margin.left +"," + (margin.top+height) + ")")
                    .call(xAxis)
                    .append("text")
                    //.attr("transform", "rotate(-90)")
                    .attr("x", width/2)
                    .attr("y", 40)
                    .attr("dy", ".71em")
                    .style("text-anchor", "middle")
                    .style("font-size", "15px")
                    .style("font-weight", "bold")
                    .text(xName);

                svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr('x', -height/2)
                    .attr("y", -70)
                    .attr("dy", ".71em")
                    .style("text-anchor", "middle")
                    .style("font-size", "15px")
                    .style("font-weight", "bold")
                    .text(yName);

                // draw line
                let drawLines = ()=>{
                    canvasG.html("");
                    var city = canvasG.selectAll(".city")
                        .data(newDrawData)
                        .enter().append("g")
                        .attr("class", "city");

                    city.append("path")
                        .attr("class", "line")
                        .attr("d", function(d) { return line(d.values); })
                        .attr("data-legend",function(d) { return d.name})
                        .style("stroke", function(d) { return color(d.name); });

                    svg.append("rect")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .style("fill", "none")
                        .style("pointer-events", "all")
                        .call(zoom);
                };
                drawLines();
            }
            let keys = data_layoutLength.map(d=>d.name);
            draw('Length',data_layoutLength, draw1, 'length', 'Number of Record', keys);
            draw('Disorder',data_layoutDisorder, draw2, 'Disorder', 'Number of Record', keys);
            draw('Darkness',data_layoutDarkness, draw3, 'Darkness', 'Number of Record', keys);


            keys = ['all', ...keys];
            let legengDiv = d3.select('#domainsLegend');
            keys.forEach(key=>{
                let div = legengDiv.append('div').attr('data-legend',key).style("display", "inline-block").style('cursor', 'pointer')
                    .on('click',function () {
                        let key = d3.select(this).attr('data-legend');
                        let otherKeys = keys.filter(k=>k!=='all');
                        if (key !== 'all') {
                            otherKeys = [key];
                        }
                        draw('Length',data_layoutLength, draw1, 'length', 'Number of Record',otherKeys);
                        draw('Disorder',data_layoutDisorder, draw2, 'Disorder', 'Number of Record',otherKeys);
                        draw('Darkness',data_layoutDarkness, draw3, 'Darkness', 'Number of Record',otherKeys);
                    });

                div.append('div')
                    .attr('class','circle')
                    .style('border', '5px solid'+color(key));
                div.append('span').html(key);

            })
        }());

        // Kingdom
        (function () {
            // create data
            let data_layoutLength = d3.nest().key((d)=>d.Kingdom).key((d)=>d.Length).entries(data)
                .map(d=>({
                    name: d.key,
                    values: d.values.map(v=>({name: +v.key, value:v.values.length}))
                }));
            console.log(data_layoutLength);

            let data_layoutDisorder = d3.nest().key((d)=>d.Kingdom).key((d)=>d.Disorder).sortKeys(d3.ascending).entries(data)
                .map(d=>({
                    name: d.key,
                    values: d.values.map(v=>({name: +v.key, value:v.values.length}))
                }));

            let data_layoutDarkness = d3.nest().key((d)=>d.Kingdom).key((d)=>d.Darkness).sortKeys(d3.ascending).entries(data)
                .map(d=>({
                    name: d.key,
                    values: d.values.map(v=>({name: +v.key, value:v.values.length}))
                }));


            var draw1 = d3.select("#draw4");
            var draw2 = d3.select("#draw5");
            var draw3 = d3.select("#draw6");

            var _color = (domain)=>{
                let scale = d3.scale.ordinal()
                    .domain(domain)
                    .rangeBands([0, 1]);
                let c = d3.scale.linear()
                    .range(["yellow", "purple", "green"])
                    .domain([0, 0.5, 1])
                    .interpolate(d3.interpolateHsl);
                return (k)=>{
                    return c(scale(k));
                };
            };
            var color = _color(data_layoutLength.map(d=>d.name));

            /*var color = d3.scale.category10();
            color.domain(data_layoutLength.map(d=>d.name));*/


            function draw(key, drawData, svg, xName, yName, keys){
                svg.html("");
                let newDrawData = drawData.filter(d=>keys.includes(d.name));
                var canvasG= svg.attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var x = d3.scale.linear()
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var line = d3.svg.line()
                    .interpolate("basis")
                    .x(function(d) { return x(d.name); })
                    .y(function(d) { return y(d.value); });

                x.domain(d3.extent(data.filter(d=>keys.includes(d.Kingdom)), function(d) { return d[key]; }));

                y.domain([
                    d3.min(newDrawData, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
                    d3.max(newDrawData, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
                ]);

                var zoom = d3.behavior.zoom()
                    .x(x)
                    .y(y)
                    .scaleExtent([1, 32])
                    .on("zoom", ()=>{
                        svg.select(".x.axis").call(xAxis);
                        svg.select(".y.axis").call(yAxis);
                        drawLines();
                    });

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate("+ margin.left +"," + (margin.top+height) + ")")
                    .call(xAxis)
                    .append("text")
                    //.attr("transform", "rotate(-90)")
                    .attr("x", width/2)
                    .attr("y", 40)
                    .attr("dy", ".71em")
                    .style("text-anchor", "middle")
                    .style("font-size", "15px")
                    .style("font-weight", "bold")
                    .text(xName);

                svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr('x', -height/2)
                    .attr("y", -70)
                    .attr("dy", ".71em")
                    .style("text-anchor", "middle")
                    .style("font-size", "15px")
                    .style("font-weight", "bold")
                    .text(yName);

                // draw line
                let drawLines = ()=>{
                    canvasG.html("");
                    var city = canvasG.selectAll(".city")
                        .data(newDrawData)
                        .enter().append("g")
                        .attr("class", "city");

                    city.append("path")
                        .attr("class", "line")
                        .attr("d", function(d) { return line(d.values); })
                        .attr("data-legend",function(d) { return d.name})
                        .style("stroke", function(d) { return color(d.name); });

                    svg.append("rect")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .style("fill", "none")
                        .style("pointer-events", "all")
                        .call(zoom);
                };
                drawLines();
            }
            let keys = data_layoutLength.map(d=>d.name);
            draw('Length',data_layoutLength, draw1, 'length', 'Number of Record', keys);
            draw('Disorder',data_layoutDisorder, draw2, 'Disorder', 'Number of Record', keys);
            draw('Darkness',data_layoutDarkness, draw3, 'Darkness', 'Number of Record', keys);

            keys = ['all', ...keys];
            let legengDiv = d3.select('#kingdomLegend');
            keys.forEach(key=>{
                let div = legengDiv.append('div').attr('data-legend',key).style("display", "inline-block").style('cursor', 'pointer')
                    .on('click',function () {
                        let key = d3.select(this).attr('data-legend');
                        let otherKeys = keys.filter(k=>k!=='all');
                        if (key !== 'all') {
                            otherKeys = [key];
                        }
                        draw('Length',data_layoutLength, draw1, 'length', 'Number of Record',otherKeys);
                        draw('Disorder',data_layoutDisorder, draw2, 'Disorder', 'Number of Record',otherKeys);
                        draw('Darkness',data_layoutDarkness, draw3, 'Darkness', 'Number of Record',otherKeys);
                    });

                div.append('div')
                    .attr('class','circle')
                    .style('border', '5px solid'+color(key));
                div.append('span').html(key);

            })

        }());

        // Organism
        (function () {
            let info = d3.select("#info");
            // create data
            let data_layoutLength = d3.nest().key((d)=>d.Organism_ID).key((d)=>d.Length).entries(data)
                .map(d=>({
                    name: d.key,
                    values: d.values.map(v=>({name: +v.key, value:v.values.length}))
                }));
            console.log(data_layoutLength);

            let data_layoutDisorder = d3.nest().key((d)=>d.Organism_ID).key((d)=>d.Disorder).sortKeys(d3.ascending).entries(data)
                .map(d=>({
                    name: d.key,
                    values: d.values.map(v=>({name: +v.key, value:v.values.length}))
                }));

            let data_layoutDarkness = d3.nest().key((d)=>d.Organism_ID).key((d)=>d.Darkness).sortKeys(d3.ascending).entries(data)
                .map(d=>({
                    name: d.key,
                    values: d.values.map(v=>({name: +v.key, value:v.values.length}))
                }));

            var x = d3.scale.linear()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var line = d3.svg.line()
                .interpolate("basis")
                .x(function(d) { return x(d.name); })
                .y(function(d) { return y(d.value); });

            var draw1 = d3.select("#draw7");
            var draw2 = d3.select("#draw8");
            var draw3 = d3.select("#draw9");

            var color = d3.scale.category10();
            color.domain(d3.keys(data[data_layoutLength]));


            draw('Length',data_layoutLength, draw1, 'length', 'Number of Record');
            function draw(key, drawData, svg, xName, yName){
                var zoomG = svg.append("rect")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .style("fill", "none")
                    .style("pointer-events", "all");
                var canvasG= svg.attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                x.domain(d3.extent(data, function(d) { return d[key]; }));

                y.domain([
                    d3.min(drawData, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
                    d3.max(drawData, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
                ]);

                var zoom = d3.behavior.zoom()
                    .x(x)
                    .y(y)
                    .scaleExtent([1, 32])
                    .on("zoom", ()=>{
                        svg.select(".x.axis").call(xAxis);
                        svg.select(".y.axis").call(yAxis);
                        drawLines();
                    });

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate("+ margin.left +"," + (margin.top+height) + ")")
                    .call(xAxis)
                    .append("text")
                    //.attr("transform", "rotate(-90)")
                    .attr("x", width/2)
                    .attr("y", 40)
                    .attr("dy", ".71em")
                    .style("text-anchor", "middle")
                    .style("font-size", "15px")
                    .style("font-weight", "bold")
                    .text(xName);

                svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr('x', -height/2)
                    .attr("y", -70)
                    .attr("dy", ".71em")
                    .style("text-anchor", "middle")
                    .style("font-size", "15px")
                    .style("font-weight", "bold")
                    .text(yName);

                // draw line
                let drawLines = (()=>{
                    zoomG.call(zoom);
                    let fn = ()=>{
                        canvasG.html("");
                        var city = canvasG.selectAll(".city")
                            .data(drawData)
                            .enter().append("g")
                            .attr("class", "city");

                        city.append("path")
                            .attr("class", "line")
                            .attr("d", function(d) { return line(d.values); })
                            .attr("data-legend",function(d) { return d.name})
                            .style("stroke", function(d) { return color(d.name); })
                            .on('click',function () {
                                let name = d3.select(this).attr("data-legend");
                                let coord = d3.mouse(document.body);
                                console.log('coord',coord);
                                info.style('left',(coord[0]+10)+'px')
                                    .style('top',coord[1]+'px')
                                    .html("Organism_ID ："+name);
                            });
                    };
                    fn();
                    return fn;
                })();
                //drawLines();
            }


            draw('Disorder',data_layoutDisorder, draw2, 'Disorder', 'Number of Record');
            draw('Darkness',data_layoutDarkness, draw3, 'Darkness', 'Number of Record');
        }());


    });
