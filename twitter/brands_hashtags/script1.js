

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
    width = document.getElementById('container').clientWidth-margin.l-margin.r,
    height = document.getElementById('container').clientHeight-margin.t-margin.b;

var brands_div_height = 300;

var svg_user = d3.select("#user")
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b);





d3.queue()
    .defer(d3.json,'../data/brands_hashtags_slim.json')
    .await(function(error,brands){

        console.log(brands);


        draw_brand(brands,brands_div_height);

    });



function draw_brand(brands,height){

    var margin = 20;
    // var plots = d3.select("#brand").selectAll('.plot')
    //     .data(brands);
    //
    // plots
    //     .enter()
    //     .append('div').attr('class','plot');

    var w,h;



    // var draw = d3.selectAll('.plot')
    //         .append('svg')
    //         .attr('width',w)
    //         .attr('height',h)
    //         .append('g')
    //         .attr("class","area")
    //         .attr('transform','translate('+margin+','+margin+')');

    for(var ii = 0; ii <brands.length; ii++){
        d3.select('#brand')
            .append('div')
            .attr('class','plot')
            .attr('id', 'b'+ii);

        w = d3.select('.plot').node().clientWidth - margin*2;
        h = d3.select('.plot').node().clientHeight - margin*2;

        var y = d3.scaleLinear().range([h, 0]).domain([0,brands[ii].hashtags[0].count]);

        var g = d3.select('#b'+ii)
            .append('svg')
            .attr('width',(w+margin*2))
            .attr('height',(h+margin*2))
            .append('g')
            .attr("transform", "translate(" + margin + "," + margin + ")");

        g.selectAll('.bar')
            .data(brands[ii].hashtags.filter(function(d,i){return i<5}))
            .enter()
            .append('rect')
            .attr("class", "bar"+ii)
            .attr("x", function(d,i) { return i*(w/5) })
            .attr("y", function(d) { return y(d.count); })
            .attr("width", function(){return w/5 - 5})
            .attr("height", function(d) { return h - y(d.count); })
            .on("mouseover", function(d) {

                var class_name = d3.select(this).attr('class');

                var t_id = class_name.substr(3);




                d3.select('#tooltip_'+t_id)
                    .text('#'+d.tag);

                // console.log(d3.selectAll('.'+class_name).select('.b_t'))



                d3.select('#tooltip_'+t_id).classed("hidden", false);

            })
            .on("mouseout", function() {
                var class_name = d3.select(this).attr('class');

                var t_id = class_name.substr(3);


                d3.select('#tooltip_'+t_id).classed("hidden", true);

            });

        g.append('text')
            .datum(brands[ii])
            .text(function(d){return d.brand})
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("x", w/2)
            .attr("y", 0 )
            .attr("fill", "red")

        g.selectAll('.tag_info')
            .data(brands[ii].hashtags.filter(function(d,i){return i<5}))
            .enter()
            .append('text')
            .attr("class", "tag_info")
            .text(function(d){return d.count})
            .attr("x", function(d,i) { return i*(w/5) })
            .attr("y", function(d) { return y(d.count)-5; })
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")

        g.append("text")
            .attr("id", "tooltip_"+ii)
            .attr('class','b_t bar'+ii)
            .attr("x", w/2)
            .attr("y", h+14)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "blue")



    }









}
