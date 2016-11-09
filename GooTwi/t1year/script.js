var margin = {t:50,l:50,b:50,r:50},
    width = document.getElementById('gt').clientWidth-margin.l-margin.r,
    height = document.getElementById('gt').clientHeight-margin.t-margin.b;

var svg = d3.select("#gt")
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b);

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var parseTime = d3.timeParse("%Y-%m-%d");
var time_format = d3.timeFormat("%Y-%m-%d")

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.queue()
    .defer(d3.json,'../data/flight_jacket_1year.json')
    .await(function(error,twi){
        // console.log(twi);
        // console.log(goo);


        draw_line_twi(parse_json(twi));



    });



function draw_line_twi(twi) {
    x.domain(d3.extent(twi, function(d) { return d.date; }));
    y.domain([0,d3.max(twi,function(d){return d.count})]);
    var d3line = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.count);
        });

    var g = svg.append("g")
        .attr("id","main_g")
        .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Tweets Count");



    g.append('path')
        .attr('d',d3line(twi))
        .attr('stroke','red')
        .attr('stroke-width',2)
        .attr('fill','none');

    g.selectAll(".data_dot")
        .data(twi)
        .enter()
        .append("circle")
        .attr("class","data_dot")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.count); })
        .style("opacity","0")
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(time_format(d.date) + "<br/>"  + "Tweets: "+d.count)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

}



function parse_json(data){

    parsed_data = []


    console.log(data)
    for(var i=0;i<data.length;i++){
        data[i].timestamp_t = new Date(parseInt(data[i].timestamp_t)*1000)
        day = data[i].timestamp_t.getDate()
        month = data[i].timestamp_t.getMonth()
        year = data[i].timestamp_t.getFullYear()
        date_string = year+"-"+month+"-"+day

        if(i==0){
            parsed_data.push({
                "date": date_string,
                "count": 1
            })
        }
        else{
            is_found = false
            for(var j = 0 ; j<parsed_data.length;j++){
                if(date_string==parsed_data[j].date){
                    parsed_data[j].count++
                    is_found = true
                }
            }
            if(is_found==false){
                parsed_data.push({
                    "date": date_string,
                    "count": 1
                })
            }
        }


    }
    for(var i = 0 ; i<parsed_data.length; i++){
        parsed_data[i].date = parseTime(parsed_data[i].date)
    }
    console.log(parsed_data)
    return parsed_data
    // for(var i = 0; i<parsed_data.length;i++){
    //     for(var j =0 ; j<data.length;j++){
    //         if(
    //             (data[j].created_at.getDate()==parsed_data[i].datetime.getDate())&&
    //             ((data[j].created_at.getHours()>=parsed_data[i].datetime.getHours())&&
    //                 (data[j].created_at.getHours()<(parsed_data[i].datetime.getHours()+1)))
    //         ){
    //             parsed_data[i].value++;
    //         }
    //     }
    // }
    //
    // var y = d3.scaleLinear()
    //     .rangeRound([0, 100]);
    //
    // y.domain([d3.min(parsed_data,function(d){return d.value}),d3.max(parsed_data,function(d){return d.value})]);
    //
    // parsed_data.forEach(function (d) {
    //     d.value_percentage = y(d.value)
    // });
    //
    //
    //
    // console.log("Parsed twi:");
    // console.log(parsed_data);
    // return parsed_data
}