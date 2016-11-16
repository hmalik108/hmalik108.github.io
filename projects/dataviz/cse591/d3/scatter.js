var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,

    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var x1 = "Winner1",
    y1 = "Error1",
    r1 = "Return1";
    circleColorCategory = "Player1";


d3.csv("tennis1.csv", function(data){
  data.forEach(function(d){
    //d.year = +d.year;
    //d.break1 = +d.break1;
    d.Return1 = +d.Return1;
    d.Error1 = +d.Error1;
    d.Winner1 = +d.Winner1;
    d.Player1 = d.Player1;
    //d.net1 = +d.net;


  });
  var Player1Array = [];
  for(var p in data){
    Player1Array.push(data[p].Player1);
  }


  var xAxisMax = d3.max(data, function(d) { return d[x1]; })  ;
      xAxisMin = 0;
      yAxisMax = d3.max(data, function(d) { return d[y1] ; }) ;
      yAxisMin = 0;

      //xAxisMax = Math.ceil(xAxisMax/10) * 10 ;
      //yAxisMax = Math.ceil(yAxisMax/10) * 10;



  x.domain([xAxisMin, xAxisMax+10]).nice();
  y.domain([yAxisMin, yAxisMax+10]).nice();

 
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  var color = d3.scale.ordinal()
    .domain(Player1Array)
    .range(colors180);


var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        //return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
        return "Avg. Winner1: " +  d[x1].toPrecision(2) + "<br>" + "Avg Error1:" + d[y1].toPrecision(2)  + "<br>" + "Avg Return1: " +  d[r1].toPrecision(2)*100 +"%" 
                + "<br>" + "Player : " + d[circleColorCategory];
      });

var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);


var svg = d3.select("#scatter")
    .append("svg")
      //.attr("width", outerWidth)
      .attr("width", width)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

svg.call(tip);

svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width/2)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .style("font-family", "Lucida Sans Unicode")
      .text(x1);


svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(y1);


    

var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

objects.selectAll("circle")
      .data(data)
    .enter().append("circle")
      .classed("dot", true)
      .attr("r", function (d) {  return d[r1]*20; }) //6 * Math.sqrt(d[r1] / Math.PI); })
      .attr("transform", transform)
      .style("fill", function(d) { return color(d[circleColorCategory]); })
      .style("stroke", "gray")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

var svg2 = d3.select("#legend")
            .append("svg")
            .attr("width", 200)
            .attr("height", outerHeight)
            .attr("class", "legend1");
    

   
var legend = svg2.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      
     // .classed("legend", true)
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

//legend.style("overflow","auto");

legend.append("circle")
      .attr("r", 3.5)
      .attr("cx",  20)
      .attr("fill", color)
    .attr("class", "dot");

legend.append("text")
      .attr("x",  26)
      .attr("dy", ".35em")
      .text(function(d) { return d; });
      


d3.select("#btn").on("click", change);

  function change() {
    xCat = "Return1";
    xAxisMax = d3.max(data, function(d) { return d[x1]; });
    xAxisMin = d3.min(data, function(d) { return d[x1]; });

    zoomBeh.x(x.domain([xAxisMin, xAxisMax])).y(y.domain([yAxisMin, yAxisMax]));

    var svg = d3.select("#scatter").transition();

    svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

    objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
  }
  
  

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[x1]) + "," + y(d[y1]) + ")";
  }


  

});

var colors180 = [ "#0a72ff", "#1eff06", "#ff1902", "#2dfefe", "#827c01", "#fe07a6", "#a8879f", "#fcff04", "#c602fe", "#16be61", 
  "#ff9569", "#05b3ff", "#ecffa7", "#3f8670", "#e992ff", "#ffb209", "#e72955", "#83bf02", "#bba67b", "#fe7eb1", "#7570c1", "#85bfd1", 
  "#f97505", "#9f52e9", "#8ffec2", "#dad045", "#b85f60", "#fe4df2", "#75ff6c", "#78a55a", "#ae6a02", "#bebeff", "#ffb3b3", "#a4fe04", 
  "#ffc876", "#c548a7", "#d6492b", "#547da7", "#358b06", "#95caa9", "#07b990", "#feb6e9", "#c9ff76", "#02b708", "#7b7a6e", "#1090fb", 
  "#a46d41", "#09ffa9", "#bb76b7", "#06b5b6", "#df307c", "#9b83fd", "#ff757c", "#0cd9fd", "#bdba61", "#c89d26", "#91df7e", "#108c49", 
  "#7b7d40", "#fdd801", "#048699", "#fc9d40", "#ff0f3b", "#87a72c", "#a25cc2", "#b95a82", "#bb8a80", "#cce733", "#f7b58d", "#adaaab", 
  "#c141c8", "#08fbd8", "#ff6de4", "#c26040", "#bb9bf6", "#b08f44", "#6d96de", "#8dcaff", "#5be51c", "#68c948", "#ff5fb8", "#7f9872", 
  "#9aa5ca", "#bad292", "#c32fe4", "#fc92df", "#e08eaa", "#fd0afd", "#2daad4", "#d96d2a", "#69e0c9", "#ce4b69", "#79ca8d", "#6e8e9a", 
  "#ffec83", "#de0fb5", "#8471a2", "#bbd766", "#e94805", "#06ff54", "#9cf046", "#6a63ff", "#05e774", "#e38c7b", "#f6ff75", "#3cda96", 
  "#d68e4b", "#d774fe", "#feca4c", "#80ff95", "#5571e1", "#6da9a1", "#a5a20d", "#d5484a", "#688326", "#e7d08f", "#4e8653", "#5cad4c",
   "#c19bcf", "#ff0e76", "#d3ff0b", "#a66877", "#6ddde3", "#a544fe", "#c2fdb5", "#8f7955", "#fd735b", "#8497fd", "#fd919d", "#fdf346",
    "#fe5581", "#fd4e50", "#0ca82e", "#d4a8b2", "#d14e91", "#0d9069", "#0c8bca", "#fd9403", "#d5b401", "#adc32e", "#efacfe", "#9da668", 
    "#57b093", "#787791", "#ff6f39", "#9e790a", "#d18903", "#abb49a", "#a06790", "#cf70cb", "#c8fe96", "#488834", "#dcbf55", "#e82f23", 
    "#9a90d5", "#9cd54d", "#c7936c", "#05dc4a", "#98f372", "#907275", "#167dcf", "#db2b9f", "#16b16e", "#49a802", "#66cd1d", "#905fdc", 
    "#cecd02", "#a376ca", "#939540", "#a7e103", "#d9ac6e", "#099334", "#db7701", "#3facbd", "#a0cb76", "#6aa3d5", "#dcaf98", "#b6692e", 
    "#a76a59", "#04908e"];