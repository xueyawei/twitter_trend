function scrollScene() {


    var controller = new ScrollMagic.Controller({addIndicators: false})
    var scene = new ScrollMagic.Scene({
        triggerElement:"#allScene",
        duration: 300,
        triggerHook: 0.2


    })
        .on("leave",function (event) {
            d3.select("#scrollIndicator")
                .transition()
                .duration(500)
                .style("opacity","0")
            console.log("out")
        })
        .on("enter",function (event) {
            d3.select("#scrollIndicator")
                .transition()
                .duration(500)
                .style("opacity","1")
        })
        .addTo(controller);




}