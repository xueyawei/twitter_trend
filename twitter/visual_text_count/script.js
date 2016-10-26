
console.log("###");



// d3

var margin = {t:50,l:50,b:50,r:50},
    width = document.getElementById('user').clientWidth-margin.l-margin.r,
    height = document.getElementById('user').clientHeight-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b);


// draw


d3.json('../data/text_count_filtered.json',function(data){
    console.log(data);


    var y = d3.scaleLinear().range([height, 0]).domain([0,data[0].count]);
    //var color = d3.scaleLinear().domain([0,hashtag_data[0].count]).range(["red","blue"]);


    var g = svg.append("g")
        .attr("transform", "translate(" + margin.l + "," + margin.t + ")");


    g.append('text')
        .attr("x", width/2)
        .attr("y", height/2-100)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text('Words Frequency in 20 Brands\' Tweets');

    g.append('text')
        .attr("x", width/2)
        .attr("y", height/2-114)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text('');



    var hashtag_number = 100;

    g.append("text")
        .attr("id", "tooltip")
        .attr("x", width/2)
        .attr("y", height/2)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "25px")
        .attr("font-weight", "bold")
        .attr("fill", "red");


    g.selectAll(".bar")
        .data(data.filter(function(d,i){
            return i<hashtag_number;
        }))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d,i) { return i*(width/hashtag_number) })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", function(){return width/hashtag_number - 5})
        .attr("height", function(d) { return height - y(d.count); })
        .on('mouseover',function(d,i){
            d3.select(this).style("fill","blue");


            d3.select('#tooltip')
                .text(d.text+" ---- "+d.count)

            d3.select("#tooltip").classed("hidden", false);




        })
        .on('mouseout',function(d,i){
            d3.select(this).style("fill",'black')
            d3.select("#tooltip").classed("hidden", true);
        });

    for(var i=0; i< 4;i++){
        generate_table(data,i)
    }
})

function generate_table(data,col){
    // var g = svg_table.append("g")
    //     .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

    var table = d3.select("#table")
        .append("div")
        .attr("class","table")
        .style("float","left")
        .append("table");

    var thead = ["Word","Count"];
    // var th = table.selectAll("tr").append("tr")
    //     .data(thead)
    //     .enter()
    //     .append("th")
    //     .html(function (d) {
    //         return d
    //     })

    // create table header
    table.append('thead').append('tr')
        .selectAll('th')
        .data(thead).enter()
        .append('th')
        .style("text-align","left")
        // .attr('class', ƒ('cl'))
        .text(function (d) {
            return d
        });

    var tr = table.selectAll("tr")
        .data(data.filter(function (d,i) {
            // console.log("s: "+(col*25)+" e: "+((col+1)*25))
            return (i<(25*(col+1)))&&(i>=(25*col))
        }))
        .enter()
        .append("tr");

    tr.append('td')
        .attr('class', 'hashtag')
        .html(function(d) { return d.text; });

    tr.append('td')
        .attr('class', 'number')
        .style("text-align","right")
        .html(function(d) { return d.count; });




}