


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
        .attr("class","data_cel");

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


    // date_row.selectAll("tr")
    //     .data(function (d) {
    //         return d.news_word.filter(function (k,i) {
    //             return i<10
    //         })
    //     })
    //     .enter()
    //     .append("td")
    //     .html(function (d) {
    //         return d.key+": "+d.value
    //     })


})