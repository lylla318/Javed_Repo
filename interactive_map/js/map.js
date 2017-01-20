// Integer.toString(i) or String.valueOf(i)

var parsedData = {};

d3.csv("data/elections.csv", function(error, results) {
  for (var i = 0 ; i < results.length ; i++) {
    var repVoteP = parseFloat(results[i].repVote),
        demVoteP = parseFloat(results[i].demVote),
        repWin = "true";

    if(repVoteP < demVoteP) { repWin = "false"; }

    results[i]["repVoteP"] = repVoteP;
    results[i]["demVoteP"] = demVoteP;
    results[i]["repWin"] = repWin;

    if(parsedData[results[i].year]) {
      (parsedData[results[i].year]).push(results[i]);
    } else {
      parsedData[results[i].year] = [];
    }
  }

});


var width = 960;
var height = 500;
var m_width = $("#map").width();

var country, state;

var projection = d3.geo.albersUsa()
    .scale(900)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select("#map").append("svg")
  .attr("preserveAspectRatio", "xMidYMid")
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("width", m_width)
  .attr("height", m_width * height / width);

svg.append("rect")
  .attr("class", "background")
  .attr("id", "background")
  .attr("width", width)
  .attr("height", height)
  .attr("fill","white");

var g = svg.append("g");

d3.json("json/us-states.json", function(error, us) {
  g.append("g")
    .selectAll("path")
    .data(us.features)
    .enter()
    .append("path")
    .attr("id", "state")
    .attr("class", function(d) { 
      var name = d.properties.name;
      name = name.replace(/ /g, "_");
      name = name.trim();
      return name; 
    })
    .attr("d", path)
    .style("stroke","black")
    .style("fill", function(d) {
      return "#ddd";
    });
});


var year = 1932;

window.setInterval(function(){
  $(".year-label").remove();

  yr = year.toString();
  if(parsedData[yr]) {
    stateData = parsedData[yr];
    for(var i = 0 ; i < stateData.length ; i++) {
      var stateInfo = stateData[i],
          parsedState = (stateInfo.state).replace(/ /g,"_");
          parsedState = parsedState.trim();

      svg.select("." +parsedState)
        .transition()
          .duration(1000)
          .style("fill", function() {
            if(stateInfo.repWin === "true") {
              return "red";
            } else {
              return "blue";
            }
          })
      
      svg.select("." +parsedState)
        .style("opacity", function() {
          if(stateInfo.repWin === "true") {
            return (stateInfo.repVoteP/100).toString();
          } else {
            return (stateInfo.demVoteP/100).toString();
          }
        })

      svg.select(".Alabama")
        .style("fill", function() {
          return "red";
        })

      svg.select(".North_Dakota")
        .style("fill", function() {
          return "red";
        })

      svg.select(".North_Carolina")
        .style("fill", function() {
          return "red";
        })

      svg.select(".Alabama")
        .style("opacity", "0.5")

      svg.select(".North_Dakota")
        .style("opacity", "0.5")

      svg.select(".North_Carolina")
        .style("opacity", "0.5")
    }

    /*svg.append("text")
      .attr("x", 650)
      .attr("y", 80)
      .attr("dy", ".35em")
      .attr("class","year-label")
      .attr("text-anchor", "center")
      .style("fill", "black")
      .text(yr);*/

  }

  year = year+4;

}, 1000);


  












