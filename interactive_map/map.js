
var sample_data = {"Germany":{"coauthors":440,"count":"eudeu"},"China":{"coauthors":325,"count":"aschn"},"United Kingdom":{"coauthors":291,"count":"eugbr"},"France":{"coauthors":224,"count":"eufra"},"South Korea":{"coauthors":216,"count":"askor"},"Taiwan":{"coauthors":145,"count":"astwn"},"Italy":{"coauthors":139,"count":"euita"},"Japan":{"coauthors":134,"count":"asjpn"},"Canada":{"coauthors":126,"count":"nacan"},"Switzerland":{"coauthors":123,"count":"euche"},"Australia":{"coauthors":120,"count":"ocaus"},"Netherlands":{"coauthors":114,"count":"eunld"},"Chile":{"coauthors":89,"count":"aschl"},"Greece":{"coauthors":75,"count":"eugrc"},"Spain":{"coauthors":75,"count":"euesp"},"Russia":{"coauthors":74,"count":"asrus"},"Singapore":{"coauthors":73,"count":"assgp"},"Denmark":{"coauthors":70,"count":"eudnk"},"Israel":{"coauthors":62,"count":"asisr"},"Czech Republic":{"coauthors":61,"count":"eucze"},"Argentina":{"coauthors":49,"count":"saarg"},"India":{"coauthors":48,"count":"asind"},"Saudi Arabia":{"coauthors":46,"count":"assau"},"Brazil":{"coauthors":41,"count":"sabra"},"Norway":{"coauthors":38,"count":"eunor"},"Belgium":{"coauthors":32,"count":"eubel"},"Peru":{"coauthors":24,"count":"saper"},"Slovenia":{"coauthors":22,"count":"eusvn"},"New Zealand":{"coauthors":21,"count":"ocnzl"},"Sweden":{"coauthors":18,"count":"euswe"},"Turkey":{"coauthors":18,"count":"astur"},"Austria":{"coauthors":16,"count":"euaut"},"Finland":{"coauthors":15,"count":"eufin"},"Mexico":{"coauthors":12,"count":"samex"},"Thailand":{"coauthors":12,"count":"astha"},"Malaysia":{"coauthors":9,"count":"asmys"},"Bolivia":{"coauthors":7,"count":"eubol"},"Colombia":{"coauthors":7,"count":"sacol"},"Uganda":{"coauthors":6,"count":"afuga"},"Iceland":{"coauthors":5,"count":"euisl"},"Panama":{"coauthors":5,"count":"napan"},"Portugal":{"coauthors":5,"count":"euprt"},"South Africa":{"coauthors":5,"count":"afzaf"},"Costa rica":{"coauthors":4,"count":"nacri"},"Ethiopia":{"coauthors":4,"count":"afeth"},"Ireland":{"coauthors":4,"count":"euirl"},"Lithuania":{"coauthors":4,"count":"eultu"},"Qatar":{"coauthors":4,"count":"asqat"},"Venezuela":{"coauthors":4,"count":"saven"},"Iran":{"coauthors":3,"count":"asirn"},"Morocco":{"coauthors":3,"count":"afmar"},"Algeria":{"coauthors":2,"count":"afdza"},"Cote Ivoire":{"coauthors":2,"count":"afciv"},"Hungary":{"coauthors":2,"count":"euhun"},"Indonesia":{"coauthors":2,"count":"asidn"},"Kenya":{"coauthors":2,"count":"afken"},"Libya":{"coauthors":2,"count":"aflby"},"Philippines":{"coauthors":2,"count":"asphl"},"Sri lanka":{"coauthors":2,"count":"aslka"},"Surinam":{"coauthors":2,"count":"sasur"},"Uruguay":{"coauthors":2,"count":"saury"},"Cameroon ":{"coauthors":1,"count":"afcmr"},"Croatia":{"coauthors":1,"count":"euhrv"},"Guatemala":{"coauthors":1,"count":"nagtm"},"Guinea":{"coauthors":1,"count":"afgin"},"Honduras":{"coauthors":1,"count":"nahnd"},"Lebanon":{"coauthors":1,"count":"aslbn"},"Mauritania":{"coauthors":1,"count":"afmrt"},"Nepal":{"coauthors":1,"count":"asnpl"},"Nicaragua":{"coauthors":1,"count":"nanic"},"Oman":{"coauthors":1,"count":"asomn"},"Poland":{"coauthors":1,"count":"eupol"},"Serbia":{"coauthors":1,"count":"eusrb"},"Sierra Leone":{"coauthors":1,"count":"afsle"},"Ukraine":{"coauthors":1,"count":"euukr"}};

var noCoauthors = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,114,12,12,120,123,126,134,139,145,15,16,18,18,2,2,2,2,2,2,2,2,2,2,21,216,22,224,24,291,3,3,32,325,38,4,4,4,4,4,4,41,440,46,48,49,5,5,5,5,6,61,62,7,7,70,73,74,75,75,89,9];

var selectColor = "#9999cc";

var current;

noCoauthors.sort(function(a, b){return a-b});

$(document).ready(function(){

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



var m_width = $("#map").width(),
    width = 938,
    height = 500,
    country,
    state;

var projection = d3.geo.mercator()
    .scale(130)
    .translate([(width / 2) - 100, height / 1.5]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", m_width)
    .attr("height", m_width * height / width);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", country_clicked);

var g = svg.append("g");

d3.json("json/countries.topo.json", function(error, us) {
  g.append("g")
    .attr("id", "countries")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.countries).features)
    .enter()
    .append("path")
    .attr("id", function(d) { return d.id; })
    .attr("d", path)
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
      zoom(xyz);
    }
  } else {
    var xyz = [width / 2, height / 1.5, 1];
    country = null;
    zoom(xyz);
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

/* Get the fill of a country based on the no. of coauthorships. */
function getFill(num, arr, colors) {
  var range = (arr[arr.length-1] / colors.length);
  if(num == 0) {return "#FFEC8B"; }
  if(num >= 0 && num <= range) { return colors[0]; }
  for (var i = 1 ; i < (parseInt(range) + 1) ; i++) {
    if (num >= (range * i) && num <= (range * (i + 1))) { return colors[i]; }
  }
}

/* "Sejong Univ, Dept Chem, Seoul 143747, South Korea;", */
function getInstitution(str) {
  var arr = str.split(',', 1);
  arr = (arr[0]).split(' ');
  return arr[0] + " " + arr[1];
}

/* Simple helper functions. */

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

