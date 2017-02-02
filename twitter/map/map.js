function generateMap(svg) {


    var path = d3.geoPath()
        .projection(projection);

    var worldMap = svg.append('g')
        .attr('class', 'worldMap')
        .attr("transform", "translate(50,50)");
    var mapPath = worldMap.append('g')
        .attr('class', 'mapPath');

    var dots = worldMap.append("g")


    d3.queue()
        .defer(d3.json, "data/world-50m.json")
        .defer(d3.json, "data/fb.json")
        .await(function (error, world, flightBomber) {

            mapPath.selectAll('path')
                .data(topojson.feature(world, world.objects.countries).features)
                .enter()
                .append('path')
                .attr('d', path);

            // console.log(flightBomber)  // TODO: reomve when work done

            flightBomber.forEach(function (d) {
                d.timestamp = new Date(d.timestamp*1000)
            })


            dots.selectAll("circle")
                .data(flightBomber)
                .enter()
                .append("circle")
                .attr("class","dot")
                .attr("r", "5")
                .attr("cx", function (d) {
                    return projection([d.location.coordinate.lng, d.location.coordinate.lat])[0]
                })
                .attr("cy", function (d) {
                    return projection([d.location.coordinate.lng, d.location.coordinate.lat])[1]
                })
                .style("fill", "red")


            var startDate = flightBomber[0].timestamp
            var endDate = flightBomber[flightBomber.length-1].timestamp

            console.log(startDate,endDate)


            // Generate Brush
            brushAxis(startDate,endDate);




        })

}