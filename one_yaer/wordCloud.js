// Word Cloud
//=================================

function generateCloud(date, selectedID, wordFrequency) {

    // get target data

    var targetData = [], tempData;
    var wordCloudFormatList = [];
    wordFrequency.forEach(function (d) {
        if (d.id == selectedID) {

            d.news_date.forEach(function (newsDate) {
                if (newsDate.date == date) {

                    targetData = newsDate.news_word
                }
            })
        }
    });
    targetData.forEach(function (d) {
        wordCloudFormatList.push(
            [
                d.key,
                d.value
            ]
        )

    });

    // get target container
    var container = d3.select("#" + selectedID).select(".wordCloud");
    var containerWidth = parseInt(container.style('width'));




    var canvas = container.select("canvas");

    // set canvas width and height
    var cloudH = container.style('height');
    var cloudW = containerWidth * 0.9;

    console.log("ID: "+selectedID);
    console.log("Container Width: "+containerWidth);
    console.log("Cloud Width: "+cloudW);
    console.log("======================");


    var canvasLRMargin = (containerWidth - cloudW) / 2;

    canvas
        .attr("height", cloudH)
        .attr("width", cloudW + 'px')
        .style("margin-left", canvasLRMargin + 'px')
        .style("margin-right", canvasLRMargin + 'px');


    // calculate font size


    var dataExtent = d3.extent(targetData, function (d) {
        return d.value
    });

    var minFontSizeSupport = WordCloud.minFontSize;
    var maxFontSize = cloudW * 0.13;

    var cloudScale = d3.scaleLinear().domain(dataExtent).range([minFontSizeSupport, maxFontSize]);
    wordCloudFormatList.forEach(function (d) {
        d[1] = cloudScale(d[1])
    });

    // word cloud options
    var cloudColor = "black";
    for(var i = 0; i<stroke_color.length;i++){
        if(stroke_color[i].id == selectedID){
            cloudColor = stroke_color[i].color;
            break
        }

    }


    var options = {
        drawOutOfBound:false,
        list: wordCloudFormatList,
        color: cloudColor,
        fontFamily: "Roboto",
        rotateRatio: 0.5,
        rotationSteps: 2
    };
    // generate word cloud
    WordCloud(canvas.node(), options)

}


//=================================