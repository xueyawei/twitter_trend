var margin = {t:20,l:50,b:50,r:50},
    width = document.getElementById('gt').clientWidth-margin.l-margin.r,
    height = document.getElementById('gt').clientHeight-margin.t-margin.b;





var parseTime = d3.timeParse("%Y-%m-%d");
var time_format = d3.timeFormat("%Y-%m-%d")

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var bisectDate = d3.bisector(function(d) { return d.date; }).left;
var all_data = [];



var stroke_color =[
    {
        "name":"flight",
        "color": "#ffa902",
        "class": "flight_line"
    },
    {
        "name":"bomber",
        "color": "#90c9e8",
        "class": "bomber_line"
    },
    {
        "name":"off_s",
        "color": "#ff7302",
        "class": "off_s_line"
    },
    {
        "name":"playsuit",
        "color": "#105378",
        "class": "playsuit_line"
    }
];

d3.queue()
    .defer(d3.json,'./data/flight_jacket_1year.json')
    .defer(d3.json,'./data/bomber_jacket.json')
    .defer(d3.json,'./data/off_the_shoulder.json')
    .defer(d3.json,'./data/playsuit.json')
    .await(function(error,flight,bomber,off_s,playsuit){
        // console.log(twi);
        // console.log(goo);

        all_data.push(parse_json(flight))
        all_data.push(parse_json(bomber))
        all_data.push(parse_json(off_s))
        all_data.push(parse_json(playsuit))

        draw_all(all_data)
        draw_line_twi(all_data[0],"#gt",stroke_color[0].class);
        draw_line_twi(all_data[1],"#bomber",stroke_color[1].class);
        draw_line_twi(all_data[2],"#off_s",stroke_color[2].class);
        draw_line_twi(all_data[3],"#playsuit",stroke_color[3].class);



    });

function draw_all(twi){
    var margin = {t:20,l:50,b:50,r:50},
        width = document.getElementById('all-in-one').clientWidth-margin.l-margin.r,
        height = document.getElementById('all-in-one').clientHeight-margin.t-margin.b;

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    x.domain(d3.extent(twi[1], function(d) { return d.date; }));
    y.domain([0,d3.max(twi[1],function(d){return d.count})]);

    var svg = d3.select("#all-in-one")
        .append('svg')
        .attr('width',width+margin.l+margin.r)
        .attr('height',height+margin.t+margin.b);

    var d3line = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.count);
        })

    var xAxis = d3.axisBottom(x)
        .tickSize(-height);

    var yAxis = d3.axisLeft(y)
        .tickSize(-width)

    var g = svg.append("g")
        .attr("class","main_g")
        .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    g.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Tweets Count");

    g.select(".axis--y line")
        .style("display","none");
    g.select(".axis--x line")
        .style("display","none");

    last_e = g.selectAll(".axis--x line")
    size = last_e.size()
    last_e = last_e.nodes()[size-1]
    d3.select(last_e)
        .style("display","none")



    // var stroke_color = ["#ffa902", "#90c9e8", "#ff7302", "#105378"]

    all_tooltip = g.append("g")
        .attr("id","id_all_tooltip")
        .attr("class","all_tooltip")
        .style("opacity","0");

    tooltip_width = 200;

    all_tooltip.append("rect")
        .attr("x",20)
        .attr("y",50)
        .attr("rx",10)
        .attr("ry",10)
        .attr("width",tooltip_width)
        .attr("height",50)
        .style("fill","#bbc3c4");

    all_tooltip.append("text")
        .attr("id","date_text")
        .attr("x",30)
        .attr("y",70)
        .style("font-weight","bold")
        .text("hello")

    text = all_tooltip.append("text")
        .attr("id","count_text")
        .attr("x",30)
        .attr("y",90)
        .style("font-weight","bold")
        .text("hello");





    for(var i = 0 ; i < twi.length ; i++){
        g.append('path')
            .attr("class","all_line")
            .attr('d',d3line(twi[i]))
            // .attr('stroke',stroke_color[i].color)
            .attr('stroke-width',3)
            .attr('fill','none')
            .classed(stroke_color[i].class,true)
            .on("mouseover",function(){

                d3.select(this)
                    .classed("all_line",false)
                    .classed("all_line_show",true)

                d3.selectAll(".all_line")
                    .transition()
                    .duration(200)
                    .style("opacity","0.2")
            })
            .on("mouseout",function () {
                d3.select(".all_line_show")
                    .classed("all_line",true)
                    .classed("all_line_show",false)

                d3.selectAll(".all_line")
                    .transition()
                    .duration(200)
                    .style("opacity","1")


            });

        g.append("g")
            .selectAll(".all_circle")
            .data(twi[i])
            .enter()
            .append("circle")
            .attr("class","all_circle")
            .classed(stroke_color[i].class,true)
            .attr("r",'5')
            .style("opacity","0")
            .attr("cx",function(d){
                return x(d.date)
            })
            .attr("cy",function(d){
                return y(d.count)
            })
            .on("mouseover",function(){
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity","1");

                single_data = d3.select(this).datum();


                get_class = d3.select(this).attr("class")
                get_class = get_class.replace("all_circle","").replace(" ","")

                co_line = d3.select("#all-in-one")
                    .select(".all_line."+get_class);


                co_line
                    .classed("all_line",false)
                    .classed("all_line_show",true)

                d3.selectAll(".all_line")
                    .transition()
                    .duration(200)
                    .style("opacity","0.2");

                d3.select("#date_text")
                    .text("Date: "+time_format(single_data.date));

                d3.select("#count_text")
                    .text("Tweets Number: "+single_data.count);

                d3.select("#id_all_tooltip")
                    .transition()
                    .duration(200)
                    .style("opacity","1")


            })
            .on("mouseout",function(){
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity","0")

                d3.select(".all_line_show")
                    .classed("all_line",true)
                    .classed("all_line_show",false)

                d3.selectAll(".all_line")
                    .transition()
                    .duration(200)
                    .style("opacity","1")

                d3.select("#id_all_tooltip")
                    .transition()
                    .duration(200)
                    .style("opacity","0")
            })


    }

    // var focus = g.append("g")
    //     .attr("class", "focus")
    //     .style("display", "none");
    //
    // focus.append("circle")
    //     .attr("r", 3);
    //
    // focus.append("text")
    //     .attr("id","date-text")
    //     .attr("x", 9)
    //     .attr("dy", ".35em");

    // focus.append("line")
    //     .attr('x1',"0")
    //     .attr('x2',"0")
    //     .attr('y1','0')
    //     .attr('y2',height)
    //     .style("stroke-width","2")
    //     .style("stroke","black")
    //     .style("opacity","0.5")

    // g.append("line")
    //     .attr("id","x-line")
    //     .attr('x1',"0")
    //     .attr('x2',width)
    //     .attr('y1','0')
    //     .attr('y2',"0")
    //     .style("stroke-width","2")
    //     .style("stroke","black")
    //     .style("opacity","0.5")



    // g.append("rect")
    //     .attr("class", "overlay")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .on("mouseover", function() { focus.style("display", null); })
    //     .on("mouseout", function() { focus.style("display", "none"); })
    //     .on("mousemove", mousemove);
    //
    // function mousemove() {
    //     var x0 = x.invert(d3.mouse(this)[0])
    //     var y0 = y.invert(d3.mouse(this)[1])
    //
    //
    //     focus.attr("transform", "translate(" + x(x0) + ", 0)");
    //     focus.select("text").text(time_format(x0)+" ===> "+y0);
    //     // focus.select("#x-line")
    //     //     .attr("y1",y(y0))
    //     //     .attr("y2",y(y0));
    // }


}



function draw_line_twi(twi,div,line_class) {
    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var svg = d3.select(div)
        .append('svg')
        .attr('width',width+margin.l+margin.r)
        .attr('height',height+margin.t+margin.b);

    x.domain(d3.extent(twi, function(d) { return d.date; }));
    y.domain([0,d3.max(twi,function(d){return d.count})]);

    var d3line = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.count);
        })
        // .curve(d3.curveMonotoneX);

    var xAxis = d3.axisBottom(x)
        .tickSize(-height);

    var yAxis = d3.axisLeft(y)
        .tickSize(-width)

    var g = svg.append("g")
        .attr("class","main_g")
        .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    g.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Tweets Count");

    g.select(".axis--y line")
        .style("display","none");
    g.select(".axis--x line")
        .style("display","none");
    last_e = g.selectAll(".axis--x line")
    size = last_e.size()
    last_e = last_e.nodes()[size-1]
    d3.select(last_e)
        .style("display","none");

    g.append('path')
        .classed(line_class,true)
        .attr('d',d3line(twi))
        // .attr('stroke','red')
        .attr('stroke-width',3)
        .attr('fill','none');

    // dot tooltip

    // g.selectAll(".data_dot")
    //     .data(twi)
    //     .enter()
    //     .append("circle")
    //     .attr("class","data_dot")
    //     .attr("r", 5)
    //     .attr("cx", function(d) { return x(d.date); })
    //     .attr("cy", function(d) { return y(d.count); })
    //     .style("opacity","0")
    //     .on("mouseover", function(d) {
    //         div.transition()
    //             .duration(200)
    //             .style("opacity", .9);
    //         div	.html(time_format(d.date) + "<br/>"  + "Tweets: "+d.count)
    //             .style("left", (d3.event.pageX) + "px")
    //             .style("top", (d3.event.pageY - 28) + "px");
    //     })
    //     .on("mouseout", function(d) {
    //         div.transition()
    //             .duration(500)
    //             .style("opacity", 0);
    //     });



    // x tooltip

    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("circle")
        .attr("r", 3);

    focus.append("text")
        .attr("id","date-text")
        .attr("x", 9)
        .attr("dy", ".35em")
        .style("font-weight",'bold');


    g.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(twi, x0, 1),
            d0 = twi[i - 1],
            d1 = twi[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.count) + ")");
        focus.select("text").text(time_format(d.date)+": "+d.count);
    }

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