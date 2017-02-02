var margin = {t: 50, l: 50, b: 50, r: 50},
    width = document.getElementById('map').clientWidth - margin.l - margin.r,
    height = document.getElementById('map').clientHeight - margin.t - margin.b;

console.log(width + " " + document.getElementById('map').clientHeight)

var svg = d3.select('.canvas')
    .append('svg')
    .attr("class","mainSvg")
    .attr('width', width + margin.l + margin.r)
    .attr('height', height + margin.t + margin.b);

d3.select(".mainSvg").append("text")
    .attr("x",20)
    .attr("y",margin.l)
    .text("Bomber Jacket + Flight Jacket")


var projection = d3.geoEquirectangular()
    .scale(200)
    .translate([width / 2, height / 2])
    .precision(.1);


generateMap(svg);
