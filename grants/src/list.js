var currentRange = [];
var removedNames = []; 

d3.json("data/grants.json", function(data){
	update(data);
	raw = data;
	currentData = raw.map(function(node){
		node["peopleList"] = node.people.map(d=>d.name); 
		return node;
	}); 

	grants = data;
  
  var people = getNameList(grants);
  addList("#person", people, "Person"); 

  console.log("Current Data: ", currentData);

  /*var departments = _.uniq(getDeptList(grants));
  addList("#department", departments, "Department");

  var agencies = getFundingAgency(grants); 
  addList("#funagen", agencies, "Funding Agency")*/


  var minYear = d3.min(grants, d=>Number(d.Start)); 
  var maxYear = d3.max(grants, d=>Number(d.End)); 

  currentRange  = [minYear, maxYear];

  var range = document.getElementById('range');
  noUiSlider.create(range, {
      start: [ minYear, maxYear], // Handle start position
      connect: true, // Display a colored bar between the handles
      step: 1, 
      tooltips: true,
      format: {
        to: function ( value ) {
          return value;
        },
        from: function ( value ) {
          return value;
        }}, 
      range: { // Slider can select '0' to '100'
      'min': minYear,
      'max': maxYear
    }, 
    pips: {
      mode: 'values',
      values: [minYear, maxYear], 
      density: 75
    }
  });


  range.noUiSlider.on("change", function(values, handle){

    currentData = currentData.filter(function(d){
      if((d.Start >= values[0] && d.Start <= values[1])||(d.End <= values[1] && d.End >= values[0])){ 
        return true;
      }
      else{
        dateFiltered.push(d);
        return false; 
      }
    });


    if ((values[0] < currentRange[0]) || (values[1] > currentRange[1])){


      dateFiltered = dateFiltered.filter(function(d){
        if((d.Start >= values[0] && d.Start <= values[1])||(d.End <= values[1] && d.End >= values[0])){
         dateComeback.push(d);
         return false; 
       }
       else{
         return true;
       }

     }); 
    }

    currentData = currentData.concat(dateComeback);

    currentRange = values;
    update(currentData); 
    updateChecks(); 
    dateComeback = []

  });

  var legendWidth = 300; 
  var legendHeight = 300;
  var legend = d3.select("#legendDiv").append("svg").attr("width", legendWidth).attr("height", legendHeight); 

  var domainValues = ["Unknown", "<$100,000", "$100,000 - $1,000,000", ">$1,000,000"];

  legend.append('text').attr('x',5).attr('y', 16).style("font-weight", "bold").text("Color Scheme");

  fillColor.range().forEach(function(color, i){
      legend.append('rect').attr("width", 20).attr("height", 20).attr("x", 5).attr("y", 20 + i*25).style("fill", color);
      legend.append('text').attr("x", 45).attr("y", 20 +5 + i*25).attr("alignment-baseline", "hanging").attr("text-anchor", "start").style("font-size", 16).text(domainValues[i]);
  })

});

$(document).ready(function(){
	$('[data-toggle="ttip"]').tooltip(); 
});


/*Coverts an array into a Set (no duplicates)*/
let unique = a => [...new Set(a)];

/*Extracts property and returns list of those properties without duplicates*/
function getProperty(array, property){
	return unique(array.map(d=>d[property]));
}
/*Adds a checkbox for each member of the list*/
function addList(id, array, field){ 
	var anchorDiv = d3.select(id); 
	var labels = anchorDiv.selectAll("div")
	.data(array.sort())
	.enter()
	.append("li"); 
	labels
	.append("input")
	.attr("checked", true)
	.attr("type", "checkbox")
	.attr("class", "cbox" +field)
	.attr("id", function(d,i) { return i; })
	.attr("for", function(d,i) { return i; })
	.on("change", function(d){
		
		var className = $(this).attr("class");

		if (className==="cboxDepartment"){ 
			var bool = d3.select(this).property("checked");
			if(bool == false){
				currentData = currentData.filter(function(node){
					if(node.dept.name != d){
						return true;
					}
					else{
						filtered.push(node); 
					}
				}); 
			}
			else{
				filtered = filtered.filter(function(node){
					if(node.dept.name == d){
						comeback.push(node);
						return false;
					}
					else{
						return true;
					}
				});	
				currentData = currentData.concat(comeback);
			}
		}

		if (className==="cboxPerson"){ 
			var bool = d3.select(this).property("checked");
			if(bool == false){
				removedNames.push(d);
				currentData = currentData.filter(function(node){
					if(_.intersection(removedNames, node.peopleList).length != node.peopleList.length){
						return true; 
					}
					else{
						console.log(node); 
						filtered.push(node); 
						return false; 
					}
				}); 
			}

			else{
				removedNames = removedNames.filter(function(n){
					return n!=d; 
				});
				filtered = filtered.filter(function(node){
					if ((_.intersection(removedNames, node.peopleList).length != node.peopleList.length) && node.peopleList.indexOf(d) > -1){
						comeback.push(node); 
						return false; 
					}
					else{
						return true; 
					}
				});
				currentData = currentData.concat(comeback); 
			}
			console.log("current: "+currentData); 
			console.log("filtered: "+filtered); 
			console.log("comeback: "+comeback);
		}	

		if(className === "cboxFunding Agency"){
			var bool = d3.select(this).property("checked");

			if(bool == false){
				currentData = currentData.filter(function(node){
					if(node.funagen.name != d){
						return true;
					}
					else{
						filtered.push(node); 
					}
				}); 
			}
			else{
				filtered = filtered.filter(function(node){
					if(node.funagen.name == d){
						comeback.push(node);
						return false;
					}
					else{
						return true;
					}
				});	
				currentData = currentData.concat(comeback);
			}

			
		}


		update(currentData); //update the viz
		updateChecks(); //update the checks
		comeback = []; //reset comeback
	});

	labels.append("label").attr("class", "label" +field).text(d=>d);

}


function updateChecks() {
	var currentNames = getNameList(currentData);
	var currentDept = _.uniq(getDeptList(currentData));
	var currentAgencies = getFundingAgency(currentData); 
	d3.selectAll('input').property("checked", function(d){
		if(currentNames.indexOf(d) != -1 || currentDept.indexOf(d) != -1||currentAgencies.indexOf(d) != -1){
			return true;
		}
		else{
			return false;
		}
	});
}
