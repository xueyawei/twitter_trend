

document.body.onselectstart = function () {
    return false;
};

d3.json("./data/news/words_frequency_ordered.json",function (data) {
    console.log(data)
    var container = d3.select("#container")

    var table = container.selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .attr("class","news_table");

        table.append("h3")
            .style("margin-left","20px")
            .html(function (d) {
                return d.query
            })






    var date_row = table.selectAll("table")
        .data(function (d) {
            return d.news_date
        })
        .enter()
        .append("table");


    date_row
        .append("tr")
        .append("th")
        .attr("colspan","2")
        .html(function (d) {
            return d.date
        })
        .on("click",function () {
            var this_table = d3.select(this.parentNode.parentNode).selectAll("td")
            this_table.classed("toggle_color",false)

        })

    var title = date_row.append("tr");

    title
        .append("th")
        .html("Word")
    title
        .append("th")
        .html("Number")

    var colums = date_row.selectAll(".data_cel")
        .data(function (d) {

            return d.news_word.filter(function (k,i) {
                return i<20 && k.key !="..."
            })
        })
        .enter()
        .append("tr")
        .attr("class","data_cel")
        .on("click",function () {
            console.log("Clicked!")
            var color_class = d3.select(this).select("td").classed("toggle_color")
            console.log(color_class)
            if(!d3.select(this).select("td").classed("toggle_color")){
                d3.select(this).selectAll("td").classed("toggle_color",true)
            }
            else{
                d3.select(this).selectAll("td").classed("toggle_color",false)
            }
        })

    colums.append("td")
        .attr("class","key_col")
        .html(function (d) {
            return d.key
        })

    colums.append("td")
        .attr("class","value_col")
        .html(function (d) {
            return d.value
        })


    d3.selectAll("table").node.onselectstart = function () {
        return false
    }


})