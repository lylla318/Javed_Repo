var sample_data = {"Germany":{"coauthors":440,"count":"eudeu"},"China":{"coauthors":325,"count":"aschn"},"United Kingdom":{"coauthors":291,"count":"eugbr"},"France":{"coauthors":224,"count":"eufra"},"South Korea":{"coauthors":216,"count":"askor"},"Taiwan":{"coauthors":145,"count":"astwn"},"Italy":{"coauthors":139,"count":"euita"},"Japan":{"coauthors":134,"count":"asjpn"},"Canada":{"coauthors":126,"count":"nacan"},"Switzerland":{"coauthors":123,"count":"euche"},"Australia":{"coauthors":120,"count":"ocaus"},"Netherlands":{"coauthors":114,"count":"eunld"},"Chile":{"coauthors":89,"count":"aschl"},"Greece":{"coauthors":75,"count":"eugrc"},"Spain":{"coauthors":75,"count":"euesp"},"Russia":{"coauthors":74,"count":"asrus"},"Singapore":{"coauthors":73,"count":"assgp"},"Denmark":{"coauthors":70,"count":"eudnk"},"Israel":{"coauthors":62,"count":"asisr"},"Czech Republic":{"coauthors":61,"count":"eucze"},"Argentina":{"coauthors":49,"count":"saarg"},"India":{"coauthors":48,"count":"asind"},"Saudi Arabia":{"coauthors":46,"count":"assau"},"Brazil":{"coauthors":41,"count":"sabra"},"Norway":{"coauthors":38,"count":"eunor"},"Belgium":{"coauthors":32,"count":"eubel"},"Peru":{"coauthors":24,"count":"saper"},"Slovenia":{"coauthors":22,"count":"eusvn"},"New Zealand":{"coauthors":21,"count":"ocnzl"},"Sweden":{"coauthors":18,"count":"euswe"},"Turkey":{"coauthors":18,"count":"astur"},"Austria":{"coauthors":16,"count":"euaut"},"Finland":{"coauthors":15,"count":"eufin"},"Mexico":{"coauthors":12,"count":"samex"},"Thailand":{"coauthors":12,"count":"astha"},"Malaysia":{"coauthors":9,"count":"asmys"},"Bolivia":{"coauthors":7,"count":"eubol"},"Colombia":{"coauthors":7,"count":"sacol"},"Uganda":{"coauthors":6,"count":"afuga"},"Iceland":{"coauthors":5,"count":"euisl"},"Panama":{"coauthors":5,"count":"napan"},"Portugal":{"coauthors":5,"count":"euprt"},"South Africa":{"coauthors":5,"count":"afzaf"},"Costa rica":{"coauthors":4,"count":"nacri"},"Ethiopia":{"coauthors":4,"count":"afeth"},"Ireland":{"coauthors":4,"count":"euirl"},"Lithuania":{"coauthors":4,"count":"eultu"},"Qatar":{"coauthors":4,"count":"asqat"},"Venezuela":{"coauthors":4,"count":"saven"},"Iran":{"coauthors":3,"count":"asirn"},"Morocco":{"coauthors":3,"count":"afmar"},"Algeria":{"coauthors":2,"count":"afdza"},"Cote Ivoire":{"coauthors":2,"count":"afciv"},"Hungary":{"coauthors":2,"count":"euhun"},"Indonesia":{"coauthors":2,"count":"asidn"},"Kenya":{"coauthors":2,"count":"afken"},"Libya":{"coauthors":2,"count":"aflby"},"Philippines":{"coauthors":2,"count":"asphl"},"Sri lanka":{"coauthors":2,"count":"aslka"},"Surinam":{"coauthors":2,"count":"sasur"},"Uruguay":{"coauthors":2,"count":"saury"},"Cameroon ":{"coauthors":1,"count":"afcmr"},"Croatia":{"coauthors":1,"count":"euhrv"},"Guatemala":{"coauthors":1,"count":"nagtm"},"Guinea":{"coauthors":1,"count":"afgin"},"Honduras":{"coauthors":1,"count":"nahnd"},"Lebanon":{"coauthors":1,"count":"aslbn"},"Mauritania":{"coauthors":1,"count":"afmrt"},"Nepal":{"coauthors":1,"count":"asnpl"},"Nicaragua":{"coauthors":1,"count":"nanic"},"Oman":{"coauthors":1,"count":"asomn"},"Poland":{"coauthors":1,"count":"eupol"},"Serbia":{"coauthors":1,"count":"eusrb"},"Sierra Leone":{"coauthors":1,"count":"afsle"},"Ukraine":{"coauthors":1,"count":"euukr"}};

var noCoauthors = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,114,12,12,120,123,126,134,139,145,15,16,18,18,2,2,2,2,2,2,2,2,2,2,21,216,22,224,24,291,3,3,32,325,38,4,4,4,4,4,4,41,440,46,48,49,5,5,5,5,6,61,62,7,7,70,73,74,75,75,89,9];

var selectColor = "#9999cc";

var current;

var tooltip = d3.select("#map").append("div").attr("class", "tooltip hidden");

var clicked = false;

noCoauthors.sort(function(a, b){return a-b});

$(document).ready(function(){

    $("#rh-panel").hide();

    $("#rh-panel").click(function(event){

        $("#rh-panel-header").click(function(e){
          e.preventDefault();
          /* If rh-panel is open, minimize it. */
          if(!($("#rh-panel").hasClass("closed"))){
            $("#rh-panel").empty();
            $("#rh-panel").append("<div id='rh-panel-header'>" + "<h4><i class='fa fa-bars toggle-icon'></i></h4><br>" + "</div>");
            $("#rh-panel").animate({"width": "50px"},500);
            $("#rh-panel").addClass("closed");
          }
          /* Enlarge the rh-panel */
          else {
            d3.json("data/external-2016-11-4.json", function(error, results) {
              getAuthorData(results, current);
            });
            $("#rh-panel").animate({"width": "250px"},500);
            $("#rh-panel").removeClass("closed");
          }
      });


        event.preventDefault();
    });
});

var colors = ['#fed976','#ffcc33','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'];

var colorMap = {"0":"#fed976", "1 - 50":"#ffcc33", "51 - 100":"#feb24c", "101 - 150":"#fd8d3c", "151 - 200":"#fc4e2a", "201 - 250":"#e31a1c", "251 - 300":"#bd0026", "300 +":"#800026"};

var m_width = $("#map").width(),
    width = 938,
    height = 500,
    country,
    state;

var projection = d3.geo.mercator()
    .scale(130)
    .translate([(width / 2)+30, height / 1.5]);

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
    .on("click", country_clicked);

var g = svg.append("g");

var z = svg.append("g").attr("transform", "translate(" + (-770) + "," + 350 + ")");

var offsetL = document.getElementById('map').offsetLeft+(width/2)-300;

var offsetT = document.getElementById('map').offsetTop+(height/2)-130;

var legend = z.selectAll(".legend")
.data(["0", "1 - 50", "51 - 100", "101 - 150", "151 - 200", "201 - 250", "251 - 300", "301+"])
.enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { 
    return "translate(0," + i * 14 + ")"; })
  .style("font", "8px sans-serif");

legend.append("rect")
  .attr("x", width - 15)
  .attr("width", 10)
  .attr("height", 10)
  .attr("fill", function(d){ return colorMap[d]; });

legend.append("text")
  .attr("x", width + 5)
  .attr("y", 5)
  .attr("dy", ".35em")
  .attr("text-anchor", "start")
  .attr("class", "legend-text")
  .style("fill", "#0A0A0A")
  .text(function(d) { return d; });

d3.json("json/countries.topo.json", function(error, us) {
  g.append("g")
    .attr("id", "countries")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.countries).features)
    .enter()
    .append("path")
    .attr("id", function(d) { return d.id; })
    .attr("class", "ctry")
    .attr("d", path)
    .style("fill", function(d, i) {
        /*if(name && name==d.properties.name) {
          return selectColor;
        }*/
        if(sample_data[d.properties.name]) {
          var numCoauthors = (sample_data[d.properties.name]).coauthors;
          return getFill(numCoauthors, noCoauthors,colors);
        } else {
          return getFill(0, noCoauthors,colors);
        }
      })
    .on("mousemove", function(d,i) {
      d3.select(this).style("fill", "#66C2FF"); //"#9999cc"
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
      tooltip
        .classed("hidden", false)
        .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
        .html(d.properties.name + "<br>" + "Co-authorships: " + getCoauthors(d.properties.name))
    })
    .on("mouseout",  function(d,i) {
      if(1) {
        d3.select(this).style("fill", function(d,i) {
          if(sample_data[d.properties.name]) {
            var numCoauthors = (sample_data[d.properties.name]).coauthors;
            return getFill(numCoauthors, noCoauthors,colors);
          } else {
            return getFill(0, noCoauthors,colors);
          }
        })
      }
      tooltip.classed("hidden", true);
    })
    .on("click", country_clicked);
});

function zoom(xyz) {
  g.transition()
    .duration(750)
    .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
    .selectAll(["#countries", "#states", "#cities"])
    .style("stroke-width", 1.0 / xyz[2] + "px")
    .selectAll(".city")
    .attr("d", path.pointRadius(20.0 / xyz[2]));
}

function get_xyz(d) {
  var bounds = path.bounds(d);
  var w_scale = (bounds[1][0] - bounds[0][0]) / width;
  var h_scale = (bounds[1][1] - bounds[0][1]) / height;
  var z = .96 / Math.max(w_scale, h_scale);
  var x = (bounds[1][0] + bounds[0][0]) / 2;
  var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
  return [x, y, z];
}

function country_clicked(d) {
  g.selectAll(["#states", "#cities"]).remove();
  state = null;

  if (country) {
    g.selectAll("#" + country.id).style('display', null);
  }

  if (d && country !== d) {
    var xyz = get_xyz(d);
    country = d;

    if (d.id  == 'USA' ) {
      d3.json("json/states_" + d.id.toLowerCase() + ".topo.json", function(error, us) {
        g.append("g")
          .attr("id", "states")
          .selectAll("path")
          .data(topojson.feature(us, us.objects.states).features)
          .enter()
          .append("path")
          .attr("id", function(d) { return d.id; })
          .attr("class", "active")
          .attr("d", path)
          .on("click", state_clicked);

        zoom(xyz);
        g.selectAll("#" + d.id).style('display', 'none');
      });      
    } else {
      //zoom(xyz); -- for now, disable zoom on all countries but the US
    }
  } else {
    var xyz = [width / 2, height / 1.5, 1];
    country = null;
    zoom(xyz);
  }
  if(!(d3.select(this)).classed("background")) {
    d3.selectAll(".clicked").classed("clicked", false);
    d3.select(this).classed("clicked", true);
    current = d.properties.name;
    d3.json("data/external-2016-11-4.json", function(error, results) {
      getAuthorData(results, d.properties.name);
    });
    $("#rh-panel").show();
  }
}

function state_clicked(d) {
  g.selectAll("#cities").remove();

  if (d && state !== d) {
    var xyz = get_xyz(d);
    state = d;

    country_code = state.id.substring(0, 3).toLowerCase();
    state_name = state.properties.name;

    d3.json("json/cities_" + country_code + ".topo.json", function(error, us) {
      g.append("g")
        .attr("id", "cities")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.cities).features.filter(function(d) { return state_name == d.properties.state; }))
        .enter()
        .append("path")
        .attr("id", function(d) { return d.properties.name; })
        .attr("class", "city")
        .attr("d", path.pointRadius(20 / xyz[2]));

      zoom(xyz);
    });      
  } else {
    state = null;
    country_clicked(country);
  }
}

$(window).resize(function() {
  var w = $("#map").width();
  svg.attr("width", w);
  svg.attr("height", w * height / width);
});

/* Total Count, top 3 external orgs, top 3 cornell authors, last co-authorship year */
function getAuthorData(results,ctry) {
  $("#rh-panel").empty();
  $("#rh-panel").css({"width":"250px"})
  $("#rh-panel").append("<div id='rh-panel-header'>" + "<h3> <span style='color:orange' id='country-selected'>" + current + "</span> <i class='fa fa-bars toggle-icon'></i></h3><br><hr></div>");
  var authors,
  count = 0,
  latestPublicationYear = 0,
  authorCount = {};
  institutionCount = {};
  current = ctry;

  for(var i=0 ; i<results.length ; i++) {
    authors = (results[i]).authors;
    var affiliated = false;
    for(var j=0 ; j<authors.length ; j++) {
      if(authors[j].country && (authors[j].country).toLowerCase() == ctry.toLowerCase()) {
        affiliated = true;
        count++;
        if(contains((authors[j]).authorName, Object.keys(authorCount))) {
          authorCount[(authors[j]).authorName] += 1; 
        } else {
          authorCount[(authors[j]).authorName] = 1; 
        }
        var parsedInstitution = getInstitution(authors[j].authorAffiliation)
        if(institutionCount[parsedInstitution]) {
          institutionCount[parsedInstitution] = institutionCount[parsedInstitution] + 1; 
        } else {
          institutionCount[parsedInstitution] = 1; 
        }
      }
    }
    
    if(affiliated) {
      if(parseInt((results[i]).yearOfPublication) > latestPublicationYear) {
        latestPublicationYear = parseInt((results[i]).yearOfPublication);
      }
    }
  }
  if(count > 0){
    $("#rh-panel").append("<div id='article-info'>"
      + "<h8>COAUTHORSHIPS<br><br></h8><ul><li>Total: " + getCoauthors(ctry) + "</li></ul>"
      + "</div>"
      + "<div id='article-info'>"
      + "<h8>Top 3 External Organizations<br><br></h8><ul><li>" + (Object.keys(institutionCount))[0] + ": " + institutionCount[(Object.keys(institutionCount))[0]] + "</li><li>" + (Object.keys(institutionCount))[1] + ": " + institutionCount[(Object.keys(institutionCount))[1]] + "</li><li>" + (Object.keys(institutionCount))[2] + ": " + institutionCount[(Object.keys(institutionCount))[2]] + "</li></ul>"
      + "</div>"
      + "<div id='article-info'>"
      + "<h8>Top 3 Cornell Authors<br><br></h8><ul><li>" + (Object.keys(authorCount))[0] + "</li><li>" + (Object.keys(authorCount))[1] + "</li><li>" + (Object.keys(authorCount))[2] + "</li></ul>"
      + "</div>"
      + "<div id='article-info'>"
      + "<h8>Last Co-authorship Year:   " + latestPublicationYear + " </h8>"
      + "</div>");
  }
  if(count == 0) {
    $("#rh-panel").append("<div id='rh-panel-header'>"
          + "There are no affiliations with the selected country.</div>");
  }

}

/* Helper functions. */

function getCoauthors(name) {
  if(sample_data[name]) { 
    return (sample_data[name]).coauthors;
  } else {
    return 0; 
  }
}

function getFill(num, arr, colors) {
  var range = (arr[arr.length-1] / colors.length);
  console.log(range);
  if(num == 0) {return "#FFEC8B"; }
  if(num >= 0 && num <= range) { return colors[0]; }
  for (var i = 1 ; i < (parseInt(range) + 1) ; i++) {
    if (num >= (range * i) && num <= (range * (i + 1))) { return colors[i]; }
  }
}

/* i.e. "Sejong Univ, Dept Chem, Seoul 143747, South Korea;", */
function getInstitution(str) {
  var arr = str.split(',', 1);
  arr = (arr[0]).split(' ');
  return arr[0] + " " + arr[1];
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
