d3.select('#someDiv').style("border", "2px solid magenta");
d3.select('#someCheckbox').attr("checked",true);

// d3.select('circle').attr("class", "active");
d3.select('circle').classed("active", false);

var someNumbers = [12,56,89, 13,35];
var smallerNumbers = someNumbers.filter(
    function (el) { return el <= 40 ? this : null });

d3.select("body").selectAll(".data")
    .data(smallerNumbers)
    .enter()
    .append("div")
    .html(function (d) { return d });