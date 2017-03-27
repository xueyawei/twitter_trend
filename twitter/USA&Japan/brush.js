var brushMovingStat = false;
var movingSpeed = 10000;
var restartStat = true;

var timerID = [];
function brushAxis(start, end, ol, country) {
    var mList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var startDate = start
    var endDate = end
    var xScale = d3.scaleTime().domain([startDate, endDate]).range([0, width]);
    var xAxis = d3.axisBottom(xScale)
        .ticks(10);


    // ===== events info =====
    var fashionEvents = [
        {
            date: new Date("November 23, 2014"),
            fsEvent: "American Music Awards"
        },
        {
            date: new Date("Jan. 7, 2015"),
            fsEvent: "People’s Choice Awards"
        },
        {
            date: new Date("Jan. 11, 2015"),
            fsEvent: "Golden Globes"
        },
        {
            date: new Date("Jan. 15, 2015"),
            fsEvent: "Critics’ Choice Awards"
        },
        {
            date: new Date("Feb. 8, 2015"),
            fsEvent: "Grammys"
        },
        {
            date: new Date("February 22, 2015"),
            fsEvent: "Academy Awards (Oscars)"
        },
        {
            date: new Date("March 29, 2015"),
            fsEvent: "iHeartRadio Music Awards"
        },
        {
            date: new Date("April 12, 2015"),
            fsEvent: "MTV Movie Awards"
        },
        {
            date: new Date("Aug. 30, 2015"),
            fsEvent: "MTV Video Music Awards"
        },
        {
            date: new Date("September 20, 2015"),
            fsEvent: "Primetime Emmy Awards"
        },
        {
            date: new Date("Nov. 22, 2015"),
            fsEvent: "American Music Awards"
        },
        {
            date: new Date("Jan. 6, 2016"),
            fsEvent: "People’s Choice Awards"
        },
        {
            date: new Date("Jan. 10, 2016"),
            fsEvent: "Golden Globes"
        },
        {
            date: new Date("Feb. 15, 2016"),
            fsEvent: "Grammys"
        },
        {
            date: new Date("Feb. 28, 2016"),
            fsEvent: "Academy Awards (Oscars)"
        },
        {
            date: new Date("April 3, 2016"),
            fsEvent: "iHeartRadio Music Awards"
        },
        {
            date: new Date("April 10, 2016"),
            fsEvent: "MTV Movie Awards"
        },
        {
            date: new Date("Aug. 28, 2016"),
            fsEvent: "MTV Video Music Awards"
        },
        {
            date: new Date("Sep. 18, 2016"),
            fsEvent: "Primetime Emmy Awards"
        }

    ];


    var brush = d3.brushX()
        .on("brush.moving", brushed)
        .on("brush.text", changeText);

    var brushTimeline = d3.select("#timeline1")
        .append("svg")
        .attr("width", width + margin.l + margin.r)
        .attr("height", "500px")
        .append("g")
        .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

    var fsEvent = brushTimeline.append("g")
        .attr("class", "fsEventContainer")
        .selectAll(".fsEvent")
        .data(fashionEvents)
        .enter()

    fsEvent.append("line")
        .attr("class", "fsEvent")
        .attr("x1", function (d) {
            return xScale(d.date)
        })
        .attr("x2", function (d) {
            return xScale(d.date)
        })
        .attr("y1", 0)
        .attr("y2", function (d,i) {
            return i*16+50+16
        })

    fsEvent.append("text")
        .attr("class", "fsEvent")
        .attr("x", function (d,i) {
            if(i==0)
                return xScale(d.date) + 2
            return xScale(d.date) - 2
        })
        .attr("y", function (d, i) {
            return i * 16 + 50 + 14
        })
        .text(function (d) {
            return d.fsEvent
        })
        .style("text-anchor",function (d,i) {
            if(i==0)
                return "start"
            else
                return "end"
        })

    brushTimeline.append("g")
        .attr("class", "x axis")
        .call(xAxis)


    brushTimeline.append("g")
        .attr("transform", "translate(0,-50)")
        .attr("class", "brush")
        .call(brush)

    d3.select(".brush")
        .selectAll("rect")
        .attr("height", "100px");

    // d3.select(".extent")
    //     .attr("transform", "translate(0,25)")
    //     .attr("height","50");

    var texts = brushTimeline.append("g").attr("class", "extentText");

    texts.append("text")
        .attr("class", "lText")
        .attr("x", 0)
        .attr("y", -36)


    texts.append("text")
        .attr("class", "rText")
        .attr("x", 0)
        .attr("y", margin.t - 5)

    var currentDate = new Date(start.getTime());
    var startTime = new Date(start.getTime());
    currentDate.setMonth(currentDate.getMonth() + 1);

    d3.select("#sButton")
        .on("click", function () {
            if (!brushMovingStat) {
                d3.select("#sButton")
                    .text("Running...")
                    .classed("btn-success", true)
                    .classed("btn-primary", false)

                brushMovingStat = true;

                if (restartStat) {

                    restartStat = false;
                    d3.select(".brush")
                        .call(brush.move, [0, 1])

                    d3.select(".brush")
                        .transition("brushT")
                        .duration(movingSpeed)
                        .ease(d3.easeLinear)
                        .on("end", function () {
                            brushMovingStat = false;

                            d3.select("#sButton")
                                .text("Start")
                                .classed("btn-success", false)
                                .classed("btn-primary", true)

                            if (d3.brushSelection(d3.select(".brush").node())[1] == xScale(end))
                                restartStat = true;

                        })
                        .call(brush.move, [0, xScale(end)])


                }
                else {
                    var currSelection = d3.brushSelection(d3.select(".brush").node())
                    console.log(currSelection)

                    var transitionTiming = (xScale(end) - currSelection[1]) / xScale(end) * movingSpeed


                    d3.select(".brush")
                        .call(brush.move, [0, currSelection[1]])

                    d3.select(".brush")
                        .transition("brushT")
                        .duration(transitionTiming)
                        .ease(d3.easeLinear)
                        .on("end", function () {
                            brushMovingStat = false;

                            d3.select("#sButton")
                                .text("Start")
                                .classed("btn-success", false)
                                .classed("btn-primary", true)

                            if (d3.brushSelection(d3.select(".brush").node())[1] == xScale(end))
                                restartStat = true;
                        })
                        .call(brush.move, [0, xScale(end)])


                }


            }
            else {
                d3.select(".brush")
                    .interrupt("brushT")
                brushMovingStat = false;

                d3.select("#sButton")
                    .text("Start")
                    .classed("btn-success", false)
                    .classed("btn-primary", true)
            }

        })

    // d3.select("#startMoving")
    //     .append("button")
    //     .text("OK")
    //     .on("click", function () {
    //         if (brushMovingStat == true) {
    //             d3.select(".brush")
    //                 .interrupt("brushT")
    //         }
    //     })


    // d3.select("#startMoving").select("button")
    //     .on("click", function () {
    //         var brushEndDate = new Date(end.getTime())
    //         brushEndDate.setMonth(brushEndDate.getMonth() + 1)
    //         var timeoutID = [];
    //
    //         if (!brushMovingStat) {
    //             d3.select("#startMoving").select("button")
    //                 .text("Running...")
    //                 .classed("btn-success", true)
    //                 .classed("btn-primary", false)
    //
    //             brushMovingStat = true;
    //
    //
    //             var startPointOfCurrentBrush = startTime,
    //                 endPointOfCurrentBrush = new Date(currentDate.getTime());
    //
    //             // startPointOfCurrentBrush.setMonth(startPointOfCurrentBrush.getMonth() - 1);
    //
    //             startPointOfCurrentBrush = xScale(startPointOfCurrentBrush)
    //             endPointOfCurrentBrush = xScale(endPointOfCurrentBrush)
    //
    //             d3.select(".brush")
    //                 .call(brush)
    //                 .call(brush.move, [startPointOfCurrentBrush, endPointOfCurrentBrush])
    //
    //             currentDate.setMonth(currentDate.getMonth() + 1);
    //
    //             movingBrush(brushEndDate)
    //
    //         }
    //         else {
    //             var id = window.setTimeout(null, 0);
    //             while (id--) {
    //                 window.clearTimeout(id);
    //             }
    //             d3.select("#startMoving").select("button")
    //                 .text("Start")
    //                 .classed("btn-success", false)
    //                 .classed("btn-primary", true)
    //             brushMovingStat = false;
    //         }
    //
    //
    //     })

    function movingBrush(brushEndDate) {

        setTimeout(function () {
            var startPointOfCurrentBrush = startTime,
                endPointOfCurrentBrush = new Date(currentDate.getTime());

            // startPointOfCurrentBrush.setMonth(startPointOfCurrentBrush.getMonth() - 1);

            startPointOfCurrentBrush = xScale(startPointOfCurrentBrush)
            endPointOfCurrentBrush = xScale(endPointOfCurrentBrush)

            d3.select(".brush")
                .transition()
                .duration(800)
                // .call(brush)
                .call(brush.move, [startPointOfCurrentBrush, endPointOfCurrentBrush])

            currentDate.setMonth(currentDate.getMonth() + 1);

            if (currentDate < brushEndDate) {
                movingBrush(brushEndDate)
            }
            else {
                brushMovingStat = false;
                currentDate = new Date(start.getTime());
                currentDate.setMonth(currentDate.getMonth() + 1);
                d3.select("#startMoving").select("button")
                    .text("Start")
                    .classed("btn-success", false)
                    .classed("btn-primary", true)
            }


        }, 600)


    }


    d3.select("#clear")
        .on("click", function () {
            // var id = window.setTimeout(null, 0);
            // while (id--) {
            //     window.clearTimeout(id);
            // }

            d3.select("#sButton")
                .text("Start")
                .classed("btn-success", false)
                .classed("btn-primary", true)

            brushMovingStat = false;
            restartStat = true;


            d3.select(".brush")
                .interrupt("brushT")
            d3.select(".brush")
                .call(brush.move, null)
        })

    function changeText() {
        var currentSelection = d3.event.selection

        if (currentSelection == null) {
            currentSelection = [0, width]
            d3.select(".lText")
                .text("")
            d3.select(".rText")
                .text("")
        }
        else {
            var x0 = xScale.invert(currentSelection[0]),
                x1 = xScale.invert(currentSelection[1])


            d3.select(".lText")
                .attr("x", currentSelection[0])
                .text(mList[x0.getMonth()] + " " + x0.getDate() + ", " + x0.getFullYear())

            d3.select(".rText")
                .attr("x", currentSelection[1])
                .text(mList[x1.getMonth()] + " " + x1.getDate() + ", " + x1.getFullYear())
        }


    }


    function brushed() {
        var currentSelection = d3.event.selection
        if (currentSelection == null) {
            currentSelection = [0, width]
            d3.select(".lText")
                .text("")
            d3.select(".rText")
                .text("")
        }
        var x0 = xScale.invert(currentSelection[0]),
            x1 = xScale.invert(currentSelection[1])

        var dataset = overlay(ol[0].filter(function (d) {
            return (d.timestamp >= x0 && d.timestamp <= x1)
        }), ol[1], ol[2])


        d3.selectAll('.dot,.dotText')
            .remove()


        var entered = d3.select('#circleGroup')
            .selectAll(".dot")
            .data(dataset)
            .enter();

        var colorRange = ['#E7EDF1', '#105378']

        var colorScale = d3.scaleLog().range(colorRange)

        colorScale.domain(d3.extent(dataset, function (d) {
            return d.main.number
        }))

        entered
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', function (d) {
                return d.x
            })
            .attr('cy', function (d) {
                return d.y
            })
            .attr('r', ol[2])
            .style("fill", function (d) {
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
        // d3.select('#circleGroup')
        //     .transition()
        //     .duration(300)
        //     .style('opacity', 1)

        // d3.select('#circleGroup')
        //     .transition()
        //     .duration(300)
        //     .on('end', function (d, i) {
        //         d3.selectAll('.dot,.dotText')
        //             .remove()
        //
        //         console.log("QQ")
        //
        //
        //         var entered = d3.select('#circleGroup')
        //             .selectAll(".dot")
        //             .data(dataset)
        //             .enter();
        //
        //         var colorRange = ['#E7EDF1', '#105378']
        //
        //         var colorScale = d3.scaleLog().range(colorRange)
        //
        //         colorScale.domain(d3.extent(dataset, function (d) {
        //             return d.main.number
        //         }))
        //
        //         entered
        //             .append('circle')
        //             .attr('class', 'dot')
        //             .attr('cx', function (d) {
        //                 return d.x
        //             })
        //             .attr('cy', function (d) {
        //                 return d.y
        //             })
        //             .attr('r', ol[2])
        //             .style("fill", function (d) {
        //                 return colorScale(d.main.number)
        //             })
        //
        //         entered
        //             .append('text')
        //             .text(function (d) {
        //                 return d.main.number
        //             })
        //             .attr('class', 'dotText')
        //             .attr('x', function (d) {
        //                 return d.x - 5
        //             })
        //             .attr('y', function (d) {
        //                 return d.y + 5
        //             })
        //         d3.select('#circleGroup')
        //             .transition()
        //             .duration(300)
        //             .style('opacity', 1)
        //
        //     })
        //     .style("opacity", 0)


        // d3.selectAll(".dot")
        //     .transition()
        //     .duration(800)
        //     .style("opacity", function (d) {
        //         if (d.timestamp >= x0 && d.timestamp <= x1) {
        //             return 1
        //         }
        //         else
        //             return 0
        //     })

        // update bar chart

        var data = ol[0].filter(function (d) {
            return (d.timestamp >= x0 && d.timestamp <= x1)
        })
        var barHeight = height / 2
        var cityList = []
        if (country == 'usa') {
            cityList = [
                {
                    'city': 'New York, NY',
                    'count': 0
                },
                {
                    'city': 'Los Angeles, CA',
                    'count': 0
                },
                {
                    'city': 'Chicago, IL',
                    'count': 0
                },
                {
                    'city': 'Houston, TX',
                    'count': 0
                }]
        }
        else {
            cityList = [
                {
                    'city': 'Tokyo, Japan',
                    'count': 0
                },
                {
                    'city': 'Yokohama',
                    'count': 0
                },
                {
                    'city': 'Osaka',
                    'count': 0
                },
                {
                    'city': 'Nagoya',
                    'count': 0
                }]
        }


        data.forEach(function (d) {
            // var city = d.location.country.split(',')

            cityList.forEach(function (c) {
                if (d.location.country.includes(c.city))
                    c.count++
            })
        })


        var yScale = d3.scaleLinear().domain([0, d3.max(cityList, function (d) {
            return d.count
        })]).range([0, barHeight])

        d3.select(".barChartGroup").selectAll('rect')
            .data(cityList)
            .transition()
            .duration(movingSpeed / 100)
            .attr('y', function (d) {
                return barHeight - yScale(d.count)
            })
            .attr('height', function (d) {
                return yScale(d.count)
            })

        d3.selectAll(".numberClass")
            .data(cityList)
            .text(function (d) {
                return d.count
            })
            .transition()
            .duration(movingSpeed / 100)
            .attr('y', function (d) {
                return barHeight - yScale(d.count) - 2
            })

    }
}