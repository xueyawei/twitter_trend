
console.log("###")



// d3

var margin = {t:50,l:50,b:50,r:50},
    width = document.getElementById('container').clientWidth-margin.l-margin.r,
    height = document.getElementById('container').clientHeight-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b);


// draw

var hashtag_data = [{name: 'fashion', count: 0}];
d3.json("twitter_data.json",function(data){
    console.log(data);
    for(var i = 0; i<data.data.length;i++){
        //console.log(data.data[i].entities.hashtags.length);

        data.data[i].entities.hashtags.forEach(function(d){
            var found = false;
            hashtag_data.forEach(function (d1) {
                if(d1.name==d.text.toLowerCase()){
                    found = true;
                    d1.count++;
                    return false
                }

            });
            if(found == false){
                hashtag_data.push({name: d.text.toLowerCase(),count: 1 })
            }
        })
    }

    //console.log(hashtag_data);
    hashtag_data.sort(function(a,b){
        return b.count - a.count;
    });

    hashtag_data.shift();
    hashtag_data.shift();
    console.log(hashtag_data);

    var y = d3.scale.linear().range([height, 0]).domain([0,500]);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

    g.selectAll(".bar")
        .data(hashtag_data.filter(function(d,i){
            return i<10;
        }))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d,i) { return i*(width/10) })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", function(){return width/10 - 10})
        .attr("height", function(d) { return height - y(d.count); });

    g.selectAll(".text")
        .data(hashtag_data.filter(function(d,i){
            return i<10;
        }))
        .enter()
        .append('text')
        .text(function(d){return '#'+d.name})
        .attr("x", function(d,i) { return i*(width/10) })
        .attr("y", function(d) { return height+20; })

    g.selectAll(".text")
        .data(hashtag_data.filter(function(d,i){
            return i<10;
        }))
        .enter()
        .append('text')
        .text(function(d){return d.count})
        .attr("x", function(d,i) { return i*(width/10)+20 })
        .attr("y", function(d) { return y(d.count)-20; })

})