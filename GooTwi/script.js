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

var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
var parseTime_twi = d3.timeParse("%Y-%m-%dT%H:%M:%S");


d3.queue()
    .defer(d3.json,'./data/twi_1020T01-1025T10.json')
    .defer(d3.csv,"./data/flight_jacket_1020T01-1025T10.csv",row)
    .await(function(error,twi,goo){
        // console.log(twi);
        // console.log(goo);

        draw_line_goo(goo);
        draw_line_twi(parse_json(twi));



    });

function draw_line_goo(goo){
    x.domain(d3.extent(goo, function(d) { return d.datetime; }));
    y.domain([0,d3.max(goo,function(d){return d.value})]);

    var d3line = d3.line()
        .x(function (d) {
            return x(d.datetime);
        })
        .y(function (d) {
            return y(d.value);
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
        .text("Popularity (0%-100%)");

    g.append('path')
        .attr('d',d3line(goo))
        .attr('stroke','blue')
        .attr('stroke-width',2)
        .attr('fill','none');
}

function draw_line_twi(twi) {
    x.domain(d3.extent(twi, function(d) { return d.datetime; }));
    y.domain([0,d3.max(twi,function(d){return d.value_percentage})]);
    var d3line = d3.line()
        .x(function (d) {
            return x(d.datetime);
        })
        .y(function (d) {
            return y(d.value_percentage);
        });

    var g = d3.select("#main_g");

    g.append('path')
        .attr('d',d3line(twi))
        .attr('stroke','red')
        .attr('stroke-width',2)
        .attr('fill','none');

}


function row(data) {
    var date,time,datetime;
    date = data.datetime.split("T")[0];
    time = data.datetime.split("T")[1];
    datetime = date+" "+time+":00:00";
    return{
        datetime:parseTime(datetime),
        timestamp:Date.parse(datetime),
        value: +data.value
    }

}

function parse_json(data){
    var hour = "01";
    var day = "20";
    var stat_time = "2016-10-"+day+" "+hour+":00:00";

    var parsed_data = [];

    for(var d = 20;d<26;d++){
        for(var h = 0;h<24;h++){
            var temp_h = "";
            if(h>9){
                temp_h = h.toString();
            }
            else{
                temp_h = "0"+h;
            }
            day = d;
            hour = temp_h;
            stat_time = "2016-10-"+day+" "+hour+":00:00";
            if((d==25)&&(h>10)){

            }
            else{
                parsed_data.push({
                    datetime: parseTime(stat_time),
                    value: 0
                })
            }


        }
    }
    parsed_data.shift();


    for(var i=0;i<data.length;i++){
        data[i].created_at = parseTime_twi(data[i].created_at)
    }

    for(var i = 0; i<parsed_data.length;i++){
        for(var j =0 ; j<data.length;j++){
            if(
                (data[j].created_at.getDate()==parsed_data[i].datetime.getDate())&&
                ((data[j].created_at.getHours()>=parsed_data[i].datetime.getHours())&&
                    (data[j].created_at.getHours()<(parsed_data[i].datetime.getHours()+1)))
            ){
                parsed_data[i].value++;
            }
        }
    }

    var y = d3.scaleLinear()
        .rangeRound([0, 100]);

    y.domain([d3.min(parsed_data,function(d){return d.value}),d3.max(parsed_data,function(d){return d.value})]);

    parsed_data.forEach(function (d) {
        d.value_percentage = y(d.value)
    });



    console.log("Parsed twi:");
    console.log(parsed_data);
    return parsed_data
}