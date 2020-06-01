var dataUrl = "/data/gunDeath.geojson";
var width = 960, 
    height = "90vh";

// Define data projection
// d3.geoConicEqualArea
// geoAlbers()
var projection = d3.geoAlbers();

var path = d3.geoPath()
             .projection(projection);

var zoom = d3.zoom()
             .scaleExtent([1,8])
             .on('zoom', zoomed);

var svg = d3.select('.map-container').append('svg')
            .attr('width', width)
            .attr('height',height);

svg.call(zoom);
// Load the data
fetch(dataUrl)
    .then(response=>{
        return response.json()
    })
    .then(data => {
        console.log(data);
        createMap(data);
    })

// var quantize = d3.scale.quantize()
//     .domain([0, 1035])
//     .range(d3.range(7).map(function(i){ return "color-"+i}));
var limits = [0, 15,54, 125, 261,424,1035];
var quantize = function(data){
    let value = limits.find(limit=>{
        if(data <= limit){
            return limit;
        }
    });
    return "color-"+limits.indexOf(value);
}


function createMap (data) {
    svg.selectAll('path')
        .data(data.features)
        .enter().append('path')
        .attr("class", function (d) { return quantize(d.properties.NUMPOINTS); })
        .attr('d', path)
        .on('mouseover', function (d) {

            d3.select('.description').append('h5')
              .style('background', '#672044')
              .html(d.properties.NAME);

            d3.select('.description').append('h4')
              .html(d.properties.NUMPOINTS);

            d3.select('.description').append('p')
              .html('Gun Deaths')
            
            d3.select(this).classed('active', true);
        })
        .on('mouseout', function (d) {
            d3.select(this).classed('active', false);
            d3.select('.description').html('');
        })
}

function zoomed() {
    svg
      .selectAll('path') // To prevent stroke width from scaling
      .attr('transform', d3.event.transform)
      .style('stroke-width',0.2);
}
