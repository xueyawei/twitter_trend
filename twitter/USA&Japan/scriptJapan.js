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

// .scale(300)
    // .translate([width/2, height/2])
    // .precision(.1);


var path = d3.geoPath()
    .projection(projection)



d3.queue()
    .defer(d3.json,"data/japan.json")
    .defer(d3.json,"data/topo_jp.json")
    .defer(d3.json,"data/geoJP.json")
    .await(function(error,flightBomber,japan,geoJP){

        projection.fitSize([width,height],geoJP)


        var japanMap = svg.append("g")
        d3.select(".mainSvg").select("g")
            .attr("transform","translate("+0+","+100+")")

        console.log(japan)

        japanMap.append("g")
            .selectAll('path')
            .data(topojson.feature(japan, japan.objects.japan).features)
            .enter()
            .append('path')
            .attr('d', path);


        var dots = japanMap.append("g")

        dots.selectAll("circle")
            .data(flightBomber)
            .enter()
            .append("circle")
            .attr("class","dot")
            .attr("r","5")
            .attr("cx",function (d) {
                return projection([d.location.coordinate.lng, d.location.coordinate.lat])[0]
            })
            .attr("cy",function (d) {
                return projection([d.location.coordinate.lng, d.location.coordinate.lat])[1]
            })
            .style("fill","red")

        flightBomber.forEach(function (d) {
            d.timestamp = new Date(d.timestamp*1000)
        })

        var startDate = flightBomber[0].timestamp
        var endDate = flightBomber[flightBomber.length-1].timestamp

        // Generate Brush
        brushAxis(startDate,endDate);


    })

