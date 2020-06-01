d3.select("#someDiv").style("border", "2px solid magenta");
d3.select("#someCheckbox").attr("checked",true);

// d3.select("circle").attr("class", "active");
d3.select("circle").classed("active", false);

var someNumbers = [12,56,89, 13,35];
var smallerNumbers = someNumbers.filter(
    function (el) { return el <= 40 ? this : null });

d3.select("#chaining").selectAll(".data")
    .data(someNumbers)
    .enter()
    .append("div")
    .html(function (d) { return d });

// var circleNode = document.getElementById("circle");
// const animateCircle = () => {
//     let startTime = 0;
//     const totalTime = 1000; // 1000ms = 1s
//     const animateStep = (timestamp) => {
//         if (!startTime) startTime = timestamp;
//         // progress goes from 0 to 1 over 1s
//         const progress = (timestamp - startTime) / totalTime;
//         // move right 100 px
//         circleNode.setAttributeNS(null, "r", 50 + (100 * progress));
//         if (progress < 1) {
//             window.requestAnimationFrame(animateStep);
//         }
//     }
//     window.requestAnimationFrame(animateStep);
// };
d3.select("svg")
  .append("circle")
  .attr("r", 20)
  .attr("cx", 20)
  .attr("cy", 20)
  .style("fill", "blue");

d3.select("svg")
  .append("text")
  .attr("id", "a")
  .attr("x", 20)
  .attr("y", 20)
  .style("opacity", 0)
  .text("HELLO WORLD");

d3.select("svg")
    .append("circle")
    .attr("r", 100)
    .attr("cx", 400)
    .attr("cy", 400)
    .style("fill", "lightblue");

d3.select("svg")
    .append("text")
    .attr("id", "b")
    .attr("x", 400)
    .attr("y", 400)
    .style("opacity", 0)
    .text("Uh, hi.");

d3.select("#a").transition().delay(1000).style("opacity",1);
d3.select("#b").transition().delay(3000).style("opacity", 0.75);
d3.selectAll("circle").transition().delay(2000).attr("cy", 200);

//  Loading data
d3.json('data/states.geojson')
  .then(function(response){
    console.log(response);
 });

d3.csv('Income1970.csv')
  .then(response => {
      console.log(response);
  });

var ramp = d3.scaleLinear().domain([500000, 1300000000]).range(["blue","red"]);
console.log(ramp(100000000));

// Categorized variables
var data = [34,67,80,234,85];
var qScale = d3.scaleQuantile().domain(data).range(["a","b", "c"]);

console.log(qScale.quantiles());

var min = d3.min(data);
var max = d3.max(data);
var extent = d3.extent(data);

console.log(min, max, extent);

// Nesting
d3.json('data/tweets.json')
  .then(response => {
    var data = d3.nest()
      .key(el => el.user)
      .entries(response.tweets);

      console.table(data);

    
    
  });

// var dataScale = d3.scaleLinear().domain([100,400]).range([0,100]);
var dataScale  = d3.scaleLinear().domain([0,500,2000, 5000]).range([0,25,50,100])
// Create a histogram
// d3.select("svg")
//   .selectAll("rect")
//   .data([230,20,30,100,1000,400, 330, 1098, 5000, 700])
//   .enter()
//   .append("rect")
//   .attr("width", 20)
//   .attr("height", function(d){ return dataScale(d); })
//   .attr("x", function(d,i){ return i * 20; })
//   .attr("y", function(d){ return 100 - dataScale(d);})
//   .style("fill", "red")
//   .style("stroke","blue")
//   .on("click", function(d) { console.log(d); });


// Working with 
d3.csv('data/cities.csv')
  .then(response => {
      console.log(response);
      createCityBar(response);
  });

function createCityBar(data) {
    var maxPop = d3.max(data, function(el){
        return parseInt(el.population);
    });

    console.log(maxPop);

    var scale = d3.scaleLinear().domain([0, maxPop]).range([0,460]);

    console.log(data);
    d3.select("svg")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", 50)
      .attr("height", function(d) { return scale( parseInt(d.population) );})
      .attr("x", function(d,i){ return i * 60;})
      .attr("y", function (d, i) { return 600 - scale(parseInt(d.population) ); })
      .style("fill", "green")
      .style("stroke", "yellow");


    // d3.select("svg")
    //     .selectAll("rect")
    //     .data(data)
    //     .enter()
    //     .append("rect")
    //     .attr("width", 50)
    //     .attr("height", function (d) { return scale(parseInt(d.population)); })
    //     .attr("x", function (d, i) { return i * 60; })
    //     .attr("y", function (d) { return 480 - scale(parseInt(d.population)); })
    //     .style("fill", "blue")
    //     .style("stroke", "red")
    //     .style("stroke-width", "1px")
    //     .style("opacity", .25);
}

