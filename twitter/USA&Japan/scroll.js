function scrollScene() {


    var controller = new ScrollMagic.Controller({addIndicators: false})
    var scene = new ScrollMagic.Scene({
        duration: 250,
        triggerHook: 0.2


    })
        .on("leave",function (event) {
            d3.select("#scrollIndicator")
                .transition()
                .duration(500)
                .style("opacity","0")

        })
        .on("enter",function (event) {
            d3.select("#scrollIndicator")
                .transition()
                .duration(500)
                .style("opacity","1")
        })
        .addTo(controller);




}