function calculateOL(currentCircle) {
    d3.select(".countGroup").remove();
    var overlapCircle = [];

    currentCircle.each(function (d) {

        var x1 = projection([d.location.coordinate.lng, d.location.coordinate.lat])[0],
            y1 = projection([d.location.coordinate.lng, d.location.coordinate.lat])[1];

        overlapCircle.push({
            "x": x1,
            "y": y1,
            "id": d.link,
            "isCount": false,
            "main": {
                "is": false,
                "number": 1
            }
        })


    })

    overlapCircle.forEach(function (d, i) {

        if (d.isCount == false) {

            overlapCircle.forEach(function (d1, i1) {
                if (i != i1) {
                    var _dist = Math.sqrt(Math.pow((d.x - d1.x), 2) + Math.pow((d.y - d1.y), 2));
                    if (_dist <= 10) {
                        //set main
                        overlapCircle[i].main.is = true;
                        overlapCircle[i].main.number++;

                        overlapCircle[i1].isCount = true;

                    }
                }
            })

        }


    });

    // generate sum circle
    var sumCircle = d3.select(".mapClass").append("g").attr("class", "countGroup pointerNone");
    overlapCircle.forEach(function (d, i) {
        if (d.isCount == false) {

            var _txt = sumCircle.append("text")
                .attr("class", "sumText")
                .attr("x", d.x)
                .attr("y", d.y + 5)
                .text(d.main.number);

            // var txtEle = _txt.node().getBBox()
            //
            //
            // sumCircle.append("rect")
            //     .attr("class","sumRect")
            //     .attr("x",txtEle.x)
            //     .attr("y",txtEle.y)
            //     .attr("width",txtEle.width)
            //     .attr("height",txtEle.height)


        }
    });

}

function overlay(data, projection, circleRadius) {
    var calculatedData = []
    data.forEach(function (d) {
        var x1 = projection([d.location.coordinate.lng, d.location.coordinate.lat])[0],
            y1 = projection([d.location.coordinate.lng, d.location.coordinate.lat])[1];

        calculatedData.push({
            "x": x1,
            "y": y1,
            "id": d.link,
            "isCount": false,
            "main": {
                "is": false,
                "number": 1
            }
        })
    })

    calculatedData.forEach(function (d, i) {

        if (d.isCount == false) {

            calculatedData.forEach(function (d1, i1) {
                if (i != i1) {
                    var _dist = Math.sqrt(Math.pow((d.x - d1.x), 2) + Math.pow((d.y - d1.y), 2));
                    if (_dist < circleRadius) {
                        //set main
                        calculatedData[i].main.is = true;
                        calculatedData[i].main.number++;

                        calculatedData[i1].isCount = true;

                    }
                }
            })

        }


    });

    var returnData = []
    for (var i = 0; i < calculatedData.length; i++) {
        if (calculatedData[i].isCount == false) {
            returnData.push(calculatedData[i])
        }
    }

    return returnData;
}

