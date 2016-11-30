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
    // {
    //     "name":"flight",
    //     "color": "#ffa902",
    //     "class": "flight_line"
    // },
    {
        "name":"flight_bomber",
        "color": "#90c9e8",
        "class": "bomber_line",
        "id": "id_01"
    },
    {
        "name":"off_s",
        "color": "#ff7302",
        "class": "off_s_line",
        "id": "id_02"
    },
    {
        "name":"culottes",
        "color": "#105378",
        "class": "culottes_line",
        "id": "id_03"
    },
    {
        "name":"jumper",
        "color": "#87ff63",
        "class": "jumper_line",
        "id": "id_04"
    },
    {
        "name":"rompers",
        "color": "#ffa902",
        "class": "rompers_line",
        "id": "id_05"
    }
];
var object_id = {
    "id_01": "Flight Jacket + Bomber Jacket",
    "id_02": "Off-The-Shoulder",
    "id_03": "Culottes",
    "id_04": "Jumper Shorts",
    "id_05": "Rompers + Playsuit"

}

d3.queue()
    .defer(d3.json,'./data/parsed/flight_bomber.json')
    .defer(d3.json,'./data/parsed/off_s.json')
    .defer(d3.json,'./data/parsed/culottes.json')
    .defer(d3.json,'./data/parsed/jumper_shorts.json')
    .defer(d3.json,'./data/news/news1.json')
    .defer(d3.json,'./data/parsed/rompers.json')
    .await(function(error,flight,off_s,culottes,jumper,news,rompers){



        all_data.push(flight);
        all_data.push(off_s);
        all_data.push(culottes);
        all_data.push(jumper);
        all_data.push(rompers)



        for(var i = 0 ; i< all_data.length;i++){
            for(var j = 0; j<all_data[i].length;j++){
                all_data[i][j].date = parse_date(all_data[i][j].date)
            }
        }



        draw_all(all_data);

        draw_line_twi(all_data[0],"#gt",stroke_color[0],news);
        draw_line_twi(all_data[1],"#off_s",stroke_color[1],news);
        draw_line_twi(all_data[2],"#culottes",stroke_color[2],news);
        draw_line_twi(all_data[3],"#jumper",stroke_color[3],news);
        draw_line_twi(all_data[4],"#rompers",stroke_color[4],news);




    });

function draw_all(twi){
    var margin = {t:20,l:50,b:50,r:50},
        width = document.getElementById('all-in-one').clientWidth-margin.l-margin.r,
        height = document.getElementById('all-in-one').clientHeight-margin.t-margin.b;

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    x.domain(d3.extent(twi[4], function(d) { return d.date; }));
    y.domain([0,d3.max(twi[4],function(d){return d.count})]);

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
    g.select(".axis--y text")
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

    tooltip_width = 270;

    all_tooltip.append("rect")
        .attr("x",20)
        .attr("y",30)
        .attr("rx",10)
        .attr("ry",10)
        .attr("width",tooltip_width)
        .attr("height",70)
        .style("fill","#bbc3c4");

    all_tooltip.append("circle")
        .attr("cx",35)
        .attr("cy",44)
        .attr("r","6")
        .attr("id","line_color_circle")
        .style("stroke","black")
        .style("stroke-width","2")

    all_tooltip.append("text")
        .attr("id","id_text")
        .attr("x",45)
        .attr("y",50)
        .style("font-weight","bold")
        .text("hello")



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
            .style('stroke',stroke_color[i].color)
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
            .style("fill","none")
            .style("stroke-width","3")
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

                var id_text,text_color
                stroke_color.forEach(function (d) {
                    if(d.class==get_class){
                        id_text = d.id
                        text_color = d.color
                    }
                })

                d3.select("#id_text")
                    .text(object_id[id_text])

                d3.select("#line_color_circle")
                    .style("fill",text_color)

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


}



function draw_line_twi(twi,div,line_class,news) {
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
    g.select(".axis--y text")
        .style("display","none");
    last_e = g.selectAll(".axis--x line")
    size = last_e.size()
    last_e = last_e.nodes()[size-1]
    d3.select(last_e)
        .style("display","none");

    g.append('path')
        .classed(line_class.class,true)
        .attr('d',d3line(twi))
        // .attr('stroke','red')
        .attr('stroke-width',3)
        .attr('fill','none')
        .style("stroke",line_class.color)


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

    target_circle_append(news,line_class.id,twi,x,y,g)

    g.append("circle")
        .datum(twi)
        .attr("id","target_circle_"+line_class.id)

    if(line_class.id!="id_04"){
        news_table(news,line_class.id)
    }




}


function parse_date(date_str){
    var format = d3.timeParse("%Y-%m-%dT%H:%M:%S");
    return format(date_str)
}

function news_table(news,id){
    var div = d3.select("#"+id).select(".news_table");

    var header = div.append("div")
        .style("height","25px");

    header.append("div")
        .style("float","left")
        .append("h3")
        .style("margin-top","0")
        .style("margin-bottom","0")
        .style("margin-left","5px")
        .html("Related News");


    var this_news
    news.forEach(function(d){
        if(d.id==id){
            this_news = d
        }
    })

    var table = div.append("div").append("table").append("tr").append("td").append("div")
        .style("height","320px")
        .style("width","100%")
        .style("overflow","auto")
        .attr("class",this_news.id);

    var drop_down = header.append("select")
        .style("margin-left","20px")
        .style("margin-top","3px")
        .attr("select-id",this_news.id)
        .on("change",function () {

            var target_value = this.value
            var select_id = d3.select(this).attr("select-id")


            var target_news
            this_news.news_date.forEach(function (d) {
                if(d.date==target_value){
                    target_news = d
                }
            })

            var table_node = d3.select(".news_content_"+select_id).node().parentNode;

            d3.selectAll(".news_content_"+select_id)
                .remove()

            change_content(target_news,select_id,d3.select(table_node))

            d3.selectAll(".t_circle_"+select_id)
                .transition()
                .duration(200)
                .style("opacity",function (d) {
                    var timeParse = d3.timeParse("%Y-%m-%d")
                    var temp_value = timeParse(target_value)

                    if(d=="special"||temp_value==null||d==null){
                        if(d=="special"&&temp_value==null){
                            return 1
                        }
                        else{
                            return 0
                        }
                        // return 0

                    }
                    else{
                        if(temp_value.getTime()==d.getTime()){

                            return 1
                        }
                        else{
                            return 0
                        }
                    }


                });



        });

    this_news.news_date.forEach(function (d) {
        drop_down.append("option")
            .html(d.date)
            .attr("value",d.date);

    })

    change_content(this_news.news_date[0],this_news.id,table)

    function change_content(data,id,table){

        var content_enter = table.selectAll("div")
            .data(data.news)
            .enter()

        var content = content_enter
            .append("div")
            .attr("class","news_content_"+id)
            .style("border-style","solid")
            .style("margin-bottom","10px")
            .style("padding-left","5px")
            .style("border-radius","7px")
            .style("border-color","#d0d0d0")
            .append("div")
            .style("margin-left","74px");

        var img = content.append("div")
            .style("width","64px")
            .style("height","64px")
            .style("float","left")
            .style("margin-left","-74px");

        var text = content.append("div")
            .style("float","none");

        text.append("a")
            .attr("href",function (d) {
                return d.link
            })
            .append("h4")
            .style("margin-bottom","0px")
            .style("margin-top","5px")
            .html(function (d) {
                return d.title
            });

        text.append("div")
            .style("margin-bottom","5px")
            .append("span")
            .html(function (d) {
                return (d.source+" - " +d.date)
            })
            .style("font-size","12px")
            .style("font-weight","bold")

        text.append("div")
            .html(function (d) {
                return d.text
            });

        img.append("svg")
            .attr("width","100%")
            .attr("height","100%")
            .append("svg:image")
            .attr("xlink:href",function (d) {
                if(d.thumbnail==""){
                    return "http://www.replacements.com/images/no_image.jpg"
                }
                return d.thumbnail
            })
            .attr("height","100%")
            .attr("width","100%")
            .attr("x",0)
            .attr("y",0)


    }




}

function target_circle_append(data,id,twi_data,x,y,canvas){
    var timeParse = d3.timeParse("%Y-%m-%d")
    var this_news
    data.forEach(function (d) {
        if(d.id==id){
            this_news = d
        }
    })



    var date_array = []
    this_news.news_date.forEach(function (d) {

        date_array.push(timeParse(d.date))
    })

    var bisector = d3.bisector(function (d) {
        return d.date
    }).left;



    var first_flag = true
    canvas.append("g")
        .selectAll("circle")
        .data(date_array)
        .enter()
        .append("circle")
        .attr("r",'10px')
        .attr("cx",function (d) {
            return x(d)
        })
        .attr("cy",function (d) {
            var index = bisector(twi_data,d)
            return y(twi_data[index].count)
        })
        .style("fill","none")
        .style("stroke-width","5")
        .style("stroke","black")
        .style("stroke-dasharray","3")
        .attr("class","t_circle_"+id)
        .style("opacity",function (d) {
            if(id=="id_04"){
                return 1
            }
            else {
                if(first_flag==true){
                    first_flag = false
                    return 1
                }
                else{
                    return 0
                }
            }
        })

    if(id=="id_02"){
        var special_circle_x = timeParse("2016-01-19")
        canvas.append("g")
            .append("circle")
            .datum("special")
            .attr("r",'25px')
            .attr("cx",x(special_circle_x))
            .attr("cy",function (d) {
                var index = bisector(twi_data,special_circle_x)
                return y(twi_data[index].count)
            })
            .style("fill","none")
            .style("stroke-width","5")
            .style("stroke","black")
            .style("stroke-dasharray","3")
            .attr("class","t_circle_"+id)
            .style("opacity","1")
            .attr("id","spec_circle")
    }




}

