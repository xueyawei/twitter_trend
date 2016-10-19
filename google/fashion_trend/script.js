var margin = {t:50,l:50,b:50,r:50},
    width = document.getElementById('user').clientWidth-margin.l-margin.r,
    height = document.getElementById('user').clientHeight-margin.t-margin.b;



var svg = d3.select('#user')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b);

var parseTime = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

d3.csv('../data/multiTimeline.csv',row,function(data){
    console.log("Popularity:");
    console.log(data);



    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0,d3.max(data,function(d){return d.value})]);

    var d3line = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.value);
        });

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

    g.append('text')
        .attr("x", width/2)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text('Interest over Time: Oct 23 2011 ---> Oct 16 2016');

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
        .attr('d',d3line(data))
        .attr('stroke','blue')
        .attr('stroke-width',2)
        .attr('fill','none');

    draw_country();
    draw_topic();
    draw_topic_rising();
    draw_query();
    draw_query_rising();
});




// parse data

function row(d) {
    return{
        date: parseTime(d.date),
        value: +d.value
    }

}

function draw_country(){
    var margin = {t:50,l:50,b:50,r:50},
        width = document.getElementById('country').clientWidth-margin.l-margin.r,
        height = document.getElementById('country').clientHeight-margin.t-margin.b;



    var svg = d3.select('#country')
        .append('svg')
        .attr('width',width+margin.l+margin.r)
        .attr('height',height+margin.t+margin.b);

    d3.csv('../data/geoMap.csv',parse_1,function(data){
        console.log("Country:");
        console.log(data);

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

        var y = d3.scaleLinear().range([height, 0]).domain(d3.extent(data,function (d) {
            return d.value;
        }));

        g.append('text')
            .attr("x", width/2)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text('Interest by Region');

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

        g.append("text")
            .attr("id", "tooltip_c")
            .attr("x", width/2)
            .attr("y", height+25)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "25px")
            .attr("font-weight", "bold")
            .attr("fill", "red");

        g.selectAll('rect')
            .data(data.filter(function(d,i){return i<20;}))
            .enter()
            .append('rect')
            .attr('x',function(d,i){return width/20*i})
            .attr('y',function (d,i) {
                return y(d.value);
            })
            .attr("width", function(){return width/20 - 20})
            .attr("height", function(d) { return height - y(d.value); })
            .on('mouseover',function(d,i){
                d3.select(this).style("fill","blue");


                d3.select('#tooltip_c')
                    .text(d.country+" ---- "+d.value+"%")

                d3.select("#tooltip_c").classed("hidden", false);




            })
            .on('mouseout',function(d,i){
                d3.select(this).style("fill",'black')
                d3.select("#tooltip_c").classed("hidden", true);
            });






    })




    function parse_1(d){
        return{
            country: d.country,
            value: +d.value
        }
    }
}

function draw_topic(){
    var margin = {t:50,l:50,b:50,r:50},
        width = document.getElementById('topic').clientWidth-margin.l-margin.r,
        height = document.getElementById('topic').clientHeight-margin.t-margin.b;



    var svg = d3.select('#topic')
        .append('svg')
        .attr('width',width+margin.l+margin.r)
        .attr('height',height+margin.t+margin.b);

    d3.csv('../data/relatedEntities.csv',parse_2,function(data){
        console.log("Topic:");
        console.log(data);
        
        var g = svg.append("g")
            .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

        var y = d3.scaleLinear().range([height, 0]).domain(d3.extent(data,function (d) {
            return d.value;
        }));

        g.append('text')
            .attr("x", width/2)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text('Top Related Topics');

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

        g.append("text")
            .attr("id", "tooltip_t")
            .attr("x", width/2)
            .attr("y", height+25)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "25px")
            .attr("font-weight", "bold")
            .attr("fill", "red");

        g.selectAll('rect')
            .data(data.filter(function(d,i){return i<10;}))
            .enter()
            .append('rect')
            .attr('x',function(d,i){return width/10*i})
            .attr('y',function (d,i) {
                return y(d.value);
            })
            .attr("width", function(){return width/10 - 10})
            .attr("height", function(d) { return height - y(d.value); })
            .on('mouseover',function(d,i){
                d3.select(this).style("fill","blue");


                d3.select('#tooltip_t')
                    .text(d.topic+" ---- "+d.value+"%")

                d3.select("#tooltip_t").classed("hidden", false);




            })
            .on('mouseout',function(d,i){
                d3.select(this).style("fill",'black')
                d3.select("#tooltip_t").classed("hidden", true);
            });

    });

    function parse_2(d) {
        return {
            topic: d.topic,
            value: +d.value
        }
    }
}

function draw_topic_rising(){
    d3.csv('../data/rising_topic.csv',parse_3,function(data){
        console.log("Topic_Rising:");
        console.log(data);

        d3.select("#topic_rising")
            .append('p')
            .html("Related Topics: Rising")
            .style('margin-left','50px')
            .style('margin-bottom','0')
            .style('color','blue')
            .style("font-size", "18px")
            .style("font-weight", "bold");

        var list = d3.select("#topic_rising")
            .append('ul')
            .style('margin-top','10px')
            .style('margin-left','50px')
            .style('float','left')


        var value = d3.select("#topic_rising")
            .append('ul')
            .style('margin-top','10px')
            .style('margin-left','50px')
            .style('float','left')

        data.forEach(function (d) {
            list.append('li')
                .html(d.topic);

            value.append('li')
                .html(d.value);
        })



    })


    function parse_3(d) {
        return {
            topic: d.topic,
            value: d.value
        }
    }
}

// query
function draw_query(){
    var margin = {t:50,l:50,b:50,r:50},
        width = document.getElementById('query').clientWidth-margin.l-margin.r,
        height = document.getElementById('query').clientHeight-margin.t-margin.b;



    var svg = d3.select('#query')
        .append('svg')
        .attr('width',width+margin.l+margin.r)
        .attr('height',height+margin.t+margin.b);

    d3.csv('../data/relatedQueries.csv',parse_2,function(data){
        console.log("Topic:");
        console.log(data);

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

        var y = d3.scaleLinear().range([height, 0]).domain(d3.extent(data,function (d) {
            return d.value;
        }));

        g.append('text')
            .attr("x", width/2)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text('Top Related Queries');

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

        g.append("text")
            .attr("id", "tooltip_q")
            .attr("x", width/2)
            .attr("y", height+25)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "25px")
            .attr("font-weight", "bold")
            .attr("fill", "red");

        g.selectAll('rect')
            .data(data.filter(function(d,i){return i<10;}))
            .enter()
            .append('rect')
            .attr('x',function(d,i){return width/10*i})
            .attr('y',function (d,i) {
                return y(d.value);
            })
            .attr("width", function(){return width/10 - 10})
            .attr("height", function(d) { return height - y(d.value); })
            .on('mouseover',function(d,i){
                d3.select(this).style("fill","blue");


                d3.select('#tooltip_q')
                    .text(d.topic+" ---- "+d.value+"%")

                d3.select("#tooltip_q").classed("hidden", false);




            })
            .on('mouseout',function(d,i){
                d3.select(this).style("fill",'black')
                d3.select("#tooltip_q").classed("hidden", true);
            });

    });

    function parse_2(d) {
        return {
            topic: d.topic,
            value: +d.value
        }
    }
}

function draw_query_rising(){
    d3.csv('../data/rising_query.csv',parse_3,function(data){
        console.log("Topic_Rising:");
        console.log(data);

        d3.select("#query_rising")
            .append('p')
            .html("Related Queries: Rising")
            .style('margin-left','50px')
            .style('margin-bottom','0')
            .style('color','blue')
            .style("font-size", "18px")
            .style("font-weight", "bold");

        var list = d3.select("#query_rising")
            .append('ul')
            .style('margin-top','10px')
            .style('margin-left','50px')
            .style('float','left')


        var value = d3.select("#query_rising")
            .append('ul')
            .style('margin-top','10px')
            .style('margin-left','50px')
            .style('float','left');

        for(var i =0; i<16;i++){
            list.append('li')
                .html(data[i].topic);

            value.append('li')
                .html(data[i].value);
        }





    })


    function parse_3(d) {
        return {
            topic: d.topic,
            value: d.value
        }
    }
}

