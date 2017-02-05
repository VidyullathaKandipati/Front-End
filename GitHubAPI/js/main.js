$(document).ready(function(){
  var languages = {};

  $('#get-trends').on('click',getLatestTrends);

  function getLatestTrends(){
    console.log("Trending technologies: ");
    var url = "https://api.github.com/search/repositories?q=created:>2017-01-29&sort=stars&order=desc";
    $.ajax({url: url}).done(displayResults).fail(function(error){ console.log("AJAX req Failed!"); });
  }

  function displayResults(data){
    console.log(data["total_count"], data["items"].length);
    //data["items"][i]["id"]
    //data["items"][i]["lan"]
    cntr = 0;
    console.log(languages);
    for (var i = 0; i<data["items"].length; i++ ){
      // console.log(data["items"][i]["language"]);
      languages[data["items"][i]["language"]] = 0;
    }
    console.log(languages);
    for (var i = 0; i<data["items"].length; i++ ){
      languages[data["items"][i]["language"]] = (languages[data["items"][i]["language"]] += 1);
    }
    console.log(languages);
    // D3 graphs
    drawNewChart();
    // practisechart();
  }

  function drawNewChart(){
    var chartData = [];
    var chartKeys = [];

    for (var lang in languages) {
      chartData.push(languages[lang]);
      chartKeys.push(lang);
      console.log('obj.' + lang, '=', languages[lang]);
    }

    var height  = 400,
    width     = 1000;

    var margin = {top: 20, right: 20, bottom: 70, left: 40};
    //color scaling chart
    var colors = d3.scaleLinear()
    .domain([0, d3.max(chartData)])
    .range(['#ffb832', '#c61c67']);

    //will remap to fit height of data

    var data=[];
    for(var i=0; i<chartData.length; i++){
        var obj = {key: chartKeys[i], value: chartData[i]};
        data.push(obj);
    }
    console.log(data);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.value; })])
        .range([height, 0]);

    //will remap to fit the width and the number of data
    var xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.key; }))
        .range([0, width]);

    var g = d3.select("body").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
          "translate(" + margin.left + "," + (height + margin.top) + ")");

    g.append("g")
       .attr("class", "x axis")
       .call(d3.axisBottom(xScale))
      .selectAll("text")
       .append("text")
       .style("text-anchor", "end")
       .attr("dx", "-.8em")
       .attr("dy", "-.55em")
       .attr("transform", "rotate(-90)")
        ;

   g.append("g")
       .attr("class", "y axis")
       .call(d3.axisLeft(yScale))
       .attr("transform", "translate(0," + -height + ")")
       .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
       .text("quantity");

       g.selectAll(".bar")
         .data(data)
        //  .style('background', '#c9d7d6')
         .enter().append("rect")
        //  .style('fill', colors)
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.key); })
         .attr("width", xScale.bandwidth())
         .attr("y", function(d) { return yScale(d.value); })
         .attr("height", function(d) { return height - yScale(d.value); })
         .attr("transform", "translate(0," + -height + ")");

    // d3.select('g')
    //   // .attr('width', width)
    //   // .attr('height', height)
    //   // .selectAll('rect').data(chartData)
    //   .selectAll('rect').data(data)
    //   .enter().append('rect')
    //   // .style('fill', colors)
    //   .style('background', '#c9d7d6')
    //   .attr('width', xScale.bandwidth())
    //   .attr('height', function(d) {return yScale(d.value);} )
    //   .attr('x', function(d) {return xScale(d.key);})
    //   // .attr('x', width)
    //   .attr('y', function (d) {return height - yScale(d.value);})
    //   .attr("transform", "translate(0," + -height + ")");
    }
});
