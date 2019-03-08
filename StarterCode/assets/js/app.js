// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("assets/data/data.csv")
    .then(function(healthData){

        // Parse & Cast
        healthData.forEach(d=>{
            d.age = +d.age;
            d.smokes = +d.smokes;
        })

        // Scale Functions
        var xScale = d3.scaleLinear()
            .domain([d3.min(healthData, d=>d.age) - .8, d3.max(healthData, d=> d.age)])
            .range([0,width]);

        var yScale = d3.scaleLinear()
            .domain([d3.min(healthData, d=>d.smokes) - .8, d3.max(healthData, d => d.smokes)])
            .range([height,0]);

        // Make Axxis
        var bottomAxis = d3.axisBottom(xScale);
        var leftAxis = d3.axisLeft(yScale);

        // Append Axis
        chartGroup.append("g")
            .attr("transform",`translate(0, ${height})`)
            .call(bottomAxis);
        chartGroup.append("g")
            .call(leftAxis);

        // Circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", d=> xScale(d.age))
            .attr("cy", d=> yScale(d.smokes))
            .attr("r","18")
            .attr("fill","skyblue")
            .attr("opacity", ".85");

        var circlesGroup = chartGroup.selectAll()
            .data(healthData)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.age))
            .attr("y", d => yScale(d.smokes))
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .style('fill', 'white')
            .text(d => (d.abbr));

        // Tool Tip
        var toolTip = d3.tip()
            .attr("class","tooltip")
            .offset([-10,-50])
            .html(function(d){
                return(`${d.state}: Average Age of ${d.age},<br> ${d.smokes}% of People Smoke.`);
            });
        
        chartGroup.call(toolTip);

        // Event Listeners
        circlesGroup.on("click", function(d){
            toolTip.show(d,this);
        })
            .on("mouseout", function(d){
                toolTip.hide(d);
            });

        // Axis Labels
        chartGroup.append("text")
            .attr("transform","rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Percentage That Smoke");
        
        chartGroup.append("text")
            .attr("transform",`translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Average Age");

        circlesGroup
            .data(healthData)
            .enter()
            .append("text")
            .text(function(d) { return d.abbr; });
    });
