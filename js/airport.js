var width = 1080,
    height = 560;

var originDest = [];
var airportsObject = {};

// define the projection
var projection = d3.geoAlbers()
                    .scale(150)
                    .translate([width/2, height/2])
var path = d3.geoPath()
                .pointRadius(2)
                .projection(projection);

var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height);

const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

svg.call(zoom);
// load the data
var dataUrl = [
    "data/portsair.geojson",
    "data/states.geojson"
];

var dataRequest = dataUrl.map(url => d3.json(url))

Promise.all(dataRequest)
    .then(response =>{
        console.log(response);
        loadData(response);
    });

function zoomed (){
    svg
    .selectAll("path") // To prevent stroke width from scaling
    .attr("transform", d3.event.transform)
    .style("stroke-width",0.2);
}

function loadData (response){
    var [airport ,world]= response;
    console.log(airport)

    // Create the countries 
    svg.append("g")
        .attr("class","countries")
        .selectAll("path")
        .data(world.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "#ccd676")
        .style("stroke-width", 0.3);

    // load the airports
    svg.append("g")
        .attr("class", "airports")
        .selectAll("path")
        .data(airport.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill","blue")
        .style("stroke-width",0.1);

    // Create an array of origin and destination
    createOrginDest(airport.features);
    console.log(originDest);

    originDest.forEach(od => {
        createRoutes(od[0], od[1]);
    });

    var i = 0;
    // create the path
    setInterval(function(e){
        if (i > originDest.length - 1) {
            i = 0;
        }
        var od = originDest[i];
          fly(od[0], od[1]);
          i++;
    },600);

    
   
}

function createOrginDest(features) {
    features.forEach(feature => {
        airportsObject[feature.properties.abbrev] = feature.geometry.coordinates;
    });

    var names = features.map(feature => feature.properties.abbrev);

    var shuffledNames = [...names];
    shuffle(shuffledNames);

    console.log(shuffledNames);
    console.log(names);

    // append the data to ori
    for (let index = 0; index < names.length; index++) {
        originDest.push([shuffledNames[index],names[index]]);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

// var plane = svg.append("path")
// .attr("class", "plane")
// .attr("d", "m25.21488,3.93375c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z");

// Create routes
function createRoutes (origin, dest) {
    var route = svg.append("path")
                    .datum({type: "LineString", coordinates: [airportsObject[origin], airportsObject[dest] ]})
                    .attr("class", "route")
                    .attr("d", path)
                    .style("fill", "none")
                    .style("stroke","black")
                    .style("stroke-width",0.9);
}

function fly(origin, dest) {
    if (!airportsObject[origin] || !airportsObject[dest]) return;
     // Create the routes
    var route = svg.append("path")
                    .datum({type: "LineString", coordinates: [airportsObject[origin], airportsObject[dest] ]})
                    .attr("class", "route")
                    .attr("d", path)
                    .style("fill", "none");
    // Plane SVG
    const plane = svg.append("path")
                .attr("class", "plane")
                .attr("d", "m25.21488,3.93375c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z");

    transit(plane, route);
}   

function transit(plane, route) {
    var l = route.node().getTotalLength();
    plane.transition()
        .duration(l * 50)
        .attrTween("transform", delta(plane, route.node()))
        .on('end', function() { route.remove(); })
        .remove();
}

function delta(plane, path) {
    var l = path.getTotalLength();
    var plane = plane;
    return function(i) {
      return function(t) {
        var p = path.getPointAtLength(t * l);

        var t2 = Math.min(t + 0.05, 1);
        var p2 = path.getPointAtLength(t2 * l);

        var x = p2.x - p.x;
        var y = p2.y - p.y;
        var r = 90 - Math.atan2(-y, x) * 180 / Math.PI;

        var s = Math.min(Math.sin(Math.PI * t) * 0.7, 0.3);

        return "translate(" + p.x + "," + p.y + ") scale(" + s + ") rotate(" + r + ")";
      }
    }
  }