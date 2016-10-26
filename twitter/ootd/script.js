

/*
* Brands tweets
* Mon Apr 11 2016 07:47:04 GMT-0400 ---> Tue Oct 11 2016 04:01:21 GMT-0400
*
* User tweets
* Sun Oct 09 2016 17:00:09 GMT-0400 ---> Tue Oct 11 2016 01:00:57 GMT-0400
*
*
* */

var margin = {t:50,l:50,b:50,r:50},
    width = document.getElementById('user').clientWidth-margin.l-margin.r,
    height = document.getElementById('user').clientHeight-margin.t-margin.b;

var brands_div_height = 300;

var svg_user = d3.select("#user")
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b);

// var svg_table = d3.select("#table")
//     .append('svg')
//     .attr('width',width+margin.l+margin.r)
//     .attr('height',height+margin.t+margin.b);




d3.queue()
    .defer(d3.json,'../data/ootd_hashtag.json')
    .await(function(error,users){
        console.log(users);

        
        draw_user(users,height);
        for(var i=0; i< 4;i++){
            generate_table(users,i)
        }



    });

function generate_table(data,col){
    // var g = svg_table.append("g")
    //     .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

    var table = d3.select("#table")
        .append("div")
        .attr("class","table")
        .style("float","left")
        .append("table");

    var thead = ["Hashtag","Count"];
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
        .html(function(d) { return d.name; });

    tr.append('td')
        .attr('class', 'number')
        .style("text-align","right")
        .html(function(d) { return d.count; });




}

function draw_user(hashtag_data,height){
    var y = d3.scaleLinear().range([height, 0]).domain([0,hashtag_data[0].count]);
    //var color = d3.scaleLinear().domain([0,hashtag_data[0].count]).range(["red","blue"]);


    var g = svg_user.append("g")
        .attr("transform", "translate(" + margin.l + "," + margin.t + ")");


    // g.append('text')
    //     .attr("x", width/2)
    //     .attr("y", height/2-100)
    //     .attr("text-anchor", "middle")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", "14px")
    //     .attr("font-weight", "bold")
    //     .attr("fill", "black")
    //     .text('Brands tweets: Apr 11 2016 ---> Oct 11 2016');

    g.append('text')
        .attr("x", width/2)
        .attr("y", height/2-114)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text('User tweets: Oct 09 2016 ---> Oct 11 2016');



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
        .data(hashtag_data.filter(function(d,i){
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
                .text('#'+d.name+" ---- "+d.count)

            d3.select("#tooltip").classed("hidden", false);




        })
        .on('mouseout',function(d,i){
            d3.select(this).style("fill",'black')
            d3.select("#tooltip").classed("hidden", true);
        })


}


