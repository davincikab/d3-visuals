var dataUrl ='data/gunDeath.geojson';
function dashboard(){
    window.onresize = function(event){
        redraw();
    }

    // load the data
    fetch(dataUrl)
      .then(response => {
          return response.json();
      })
      .then(data => {

        // Get the data
        var nestedData = d3.nest()
            .key(function(el) { return el.properties.NAME; })
            .entries(data.features);

            console.log(nestedData);

        // Call to the helper methods
        createSpreadSheet(data.features, '#spreadsheet');
        createBar(nestedData, '#rightSVG');
        // createPack(data.features, '#leftSVG');

        redraw();
      });
}

function redraw(){

}


function createSpreadSheet(data, element){
    var keys = d3.keys(data[0].properties);

    d3.select(element)
      .append('div')
      .attr('class', 'tabl');
    
    d3.select('div.tabl')
      .append('div')
      .attr('class', 'head row')
      .selectAll('div.data')
      .data(keys)
      .enter()
      .append('div')
      .attr('class', 'data ml-3')
      .html(function(d) { return d})
      .style('left', function(d,i){ return (i*100)+"px"; });


    d3.select('div.tabl')
       .selectAll('div.datarow')
       .data(data, function(d){ return d.properties.NAME; })
       .enter()
       .append('div')
       .attr('class', 'datarow row py-3')
       .style('top', function(d,i) { return (40+ (i*40)) + "px"; });

    // Add the data
    d3.selectAll('div.datarow')
      .selectAll('div.data')
      .data(function(d){ return d3.entries(d.properties); })
      .enter()
      .append('div')
      .attr('class', 'data ml-3')
      .html(function(d){ return d.value;})
      .style('left', function(d,i,j){ return (i*100) +"px"; });

    
}

function createBar(data, element){
    data.forEach(item => {
        item.values =  [12,23]
        // item.values.map( t => t.properties.NUMPOINTS);

        return item;
    });

    d3.select(element)
      .selectAll('rect').data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar');
}

function createPack(data, element){

}
