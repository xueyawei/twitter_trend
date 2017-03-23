var margin = {t: 50, l: 50, b: 50, r: 50},
    width = document.getElementById('map').clientWidth - margin.l - margin.r,
    height = document.getElementById('map').clientHeight - margin.t - margin.b;

console.log(width + " " + document.getElementById('map').clientHeight)


var svg = d3.select('.canvas')
    .append('svg')
    .attr("class", "mainSvg")
    .attr('width', width + margin.l + margin.r)
    .attr('height', height + margin.t + margin.b);

d3.select(".mainSvg").append("text")
    .attr("x", 20)
    .attr("y", margin.l)
    .text("Bomber Jacket + Flight Jacket")

var projection = d3.geoAlbersUsa()
    .scale(1300)
    .translate([width / 2-100, height / 2 + 50])
    .precision(.1);


var path = d3.geoPath()
    .projection(projection)

var colorRange = ['#E7EDF1','#105378']

var colorScale = d3.scaleLog().range(colorRange)

d3.queue()
    .defer(d3.json, "data/usa.json")
    .defer(d3.json, "data/topo_us20m.json")
    .await(function (error, flightBomber, usMap) {

        var usaMap = svg.append("g")
            .attr("class", "mapClass")


        usaMap.append("g")
            .selectAll('path')
            .data(topojson.feature(usMap, usMap.objects.us20m).features)
            .enter()
            .append('path')
            .attr('d', path);


        var circleRadius = 10;
        var dots = usaMap.append("g")
            .attr("id", "circleGroup")


        var newData = overlay(flightBomber, projection, circleRadius)
        colorScale.domain(d3.extent(newData,function (d) {
            return d.main.number
        }))

        var entered = dots.selectAll('.dot')
            .data(newData)
            .enter();

        entered
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', function (d) {
                return d.x
            })
            .attr('cy', function (d) {
                return d.y
            })
            .attr('r', circleRadius)
            .style("fill",function (d) {
                return colorScale(d.main.number)
            })


        entered
            .append('text')
            .text(function (d) {
                return d.main.number
            })
            .attr('class', 'dotText')
            .attr('x', function (d) {
                return d.x - 5
            })
            .attr('y', function (d) {
                return d.y + 5
            })

        flightBomber.forEach(function (d) {
            d.timestamp = new Date(d.timestamp * 1000)
        })

        var startDate = flightBomber[0].timestamp
        var endDate = flightBomber[flightBomber.length - 1].timestamp

        var olArgument = [flightBomber, projection, circleRadius]

        // List cities
        listCity(flightBomber)
        // Generate Brush
        brushAxis(startDate, endDate, olArgument,'usa');


    })

function listCity(data) {
    console.log(data)
    var cityList = [
        {
            'city': 'New York, NY',
            "color": "#D9D9D9",
            'count': 0
        },
        {
            'city': 'Los Angeles, CA',
            "color": "#D9D9D9",
            'count': 0
        },
        {
            'city': 'Chicago, IL',
            "color": "#D9D9D9",
            'count': 0
        },
        {
            'city': 'Houston, TX',
            "color": "#D9D9D9",
            'count': 0
        }]

    data.forEach(function (d) {
        // var city = d.location.country.split(',')

        cityList.forEach(function (c) {
            if(d.location.country.includes(c.city))
                c.count++
        })
    })
    console.log(cityList)

    // draw bar chart
    var mapBox = d3.select(".mapClass").node().getBBox()
    console.log(mapBox)

    var barX = mapBox.x+mapBox.width+50;

    var barWidth = (width + margin.l - barX) / 4

    var barHeight = height / 2

    var yScale = d3.scaleLinear().domain([0,d3.max(cityList,function (d) {
        return d.count
    })]).range([0,barHeight])

    console.log(barWidth)

    console.log(d3.extent(cityList,function (d) {
        return d.count
    }))

    var barGroup = d3.select('.mainSvg')
        .append('g')
        .attr("transform",'translate(0,'+barHeight/2+")")
        .attr('class','barChartGroup');

    var barEntered = barGroup.selectAll('rect')
        .data(cityList)
        .enter();

    barEntered
        .append('rect')
        .attr('x',function (d,i) {
            return i*barWidth + barX
        })
        .attr('y',function (d) {
            return barHeight - yScale(d.count)
        })
        .attr('height',function (d) {
            return yScale(d.count)
        })
        .attr('width', barWidth/2)
        .style('fill',function (d) {
            return d.color
        })


    var rotateX
    var rotateY = barHeight
    barEntered
        .append("text")
        .attr("class","cityText")
        .text(function (d) {
            return d.city
        })
        .attr('x',function (d,i) {

            return barX + i * barWidth + barWidth/4 +15
        })
        .attr('y',barHeight+20)
        .attr("transform",function (d,i) {
            rotateX = barX + i * barWidth + barWidth/4
            return "rotate(60 "+rotateX+","+rotateY+")"
        })
        // .style("writing-mode","tb")
        // .attr("transform","rotate(45 "+rotateX+","+rotateY+")")

    barEntered
        .append('text')
        .attr("class","numberClass")
        .text(function (d) {
            return d.count
        })
        .attr('x',function (d,i) {
            return barX + i*barWidth +barWidth/4
        })
        .attr('y',function (d) {
            return barHeight - yScale(d.count) - 2
        })




}

















