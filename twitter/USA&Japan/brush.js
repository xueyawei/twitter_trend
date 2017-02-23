var brushMovingStat = false;


function brushAxis(start, end) {
    var mList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var startDate = start
    var endDate = end
    var xScale = d3.scaleTime().domain([startDate, endDate]).range([0, width]);
    var xAxis = d3.axisBottom(xScale)
        .ticks(10);

    var brush = d3.brushX()
        .on("end", brushed)
        .on("brush", changeText);

    var brushTimeline = d3.select("#timeline1")
        .append("svg")
        .attr("width", width + margin.l + margin.r)
        .attr("height", "100px")
        .append("g")
        .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

    brushTimeline.append("g")
        .attr("class", "x axis")
        .call(xAxis)


    brushTimeline.append("g")
        .attr("transform", "translate(0,-50)")
        .attr("class", "brush")
        .call(brush)
        .selectAll("rect")
        .attr("height", "100");

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
    currentDate.setMonth(currentDate.getMonth() + 1);


    d3.select("#startMoving").select("button")
        .on("click", function () {
            var brushEndDate = new Date(end.getTime())
            brushEndDate.setMonth(brushEndDate.getMonth() + 1)
            var timeoutID = [];

            if (!brushMovingStat) {
                d3.select("#startMoving").select("button")
                    .text("Running...")
                    .classed("btn-success", true)
                    .classed("btn-primary", false)

                brushMovingStat = true;


                var startPointOfCurrentBrush = new Date(currentDate.getTime()),
                    endPointOfCurrentBrush = new Date(currentDate.getTime());

                startPointOfCurrentBrush.setMonth(startPointOfCurrentBrush.getMonth() - 1);

                startPointOfCurrentBrush = xScale(startPointOfCurrentBrush)
                endPointOfCurrentBrush = xScale(endPointOfCurrentBrush)

                d3.select(".brush")
                    .call(brush)
                    .call(brush.move, [startPointOfCurrentBrush, endPointOfCurrentBrush])

                currentDate.setMonth(currentDate.getMonth() + 1);

                movingBrush(brushEndDate)

            }
            else {
                var id = window.setTimeout(null, 0);
                while (id--) {
                    window.clearTimeout(id);
                }
                d3.select("#startMoving").select("button")
                    .text("Start")
                    .classed("btn-success", false)
                    .classed("btn-primary", true)
                brushMovingStat = false;
            }


        })

    function movingBrush(brushEndDate) {

        setTimeout(function () {
            var startPointOfCurrentBrush = new Date(currentDate.getTime()),
                endPointOfCurrentBrush = new Date(currentDate.getTime());

            startPointOfCurrentBrush.setMonth(startPointOfCurrentBrush.getMonth() - 1);

            startPointOfCurrentBrush = xScale(startPointOfCurrentBrush)
            endPointOfCurrentBrush = xScale(endPointOfCurrentBrush)

            d3.select(".brush")
                .transition()
                .duration(500)
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


        }, 500)


    }

    function changeText() {
        var currentSelection = d3.event.selection

        var x0 = xScale.invert(currentSelection[0]),
            x1 = xScale.invert(currentSelection[1])


        d3.select(".lText")
            .attr("x", currentSelection[0])
            .text(mList[x0.getMonth()] + " " + x0.getDate() + ", " + x0.getFullYear())

        d3.select(".rText")
            .attr("x", currentSelection[1])
            .text(mList[x1.getMonth()] + " " + x1.getDate() + ", " + x1.getFullYear())


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


        d3.selectAll(".dot")
            .transition()
            .duration(800)
            .style("opacity", function (d) {
                if (d.timestamp >= x0 && d.timestamp <= x1) {
                    return 1
                }
                else
                    return 0
            })


    }
}