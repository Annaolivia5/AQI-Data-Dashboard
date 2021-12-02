const url = "/jsondata";

// // Promise Pending
// const dataPromise = d3.json(url);
// console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

jsonData = d3.json("/jsondata");

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  jsonData.then((data) => {

    var years = data.year;
    console.log('DATA');
    console.log(years);

    years.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });


    // for (let year in data) {
    //   selector
    //     .append("option")
    //     .text(year)
    //     .property("value", year);
    // }
  });
}

// Initialize the dashboard
init();

function optionChanged(selectedYear) {
  // Fetch new data each time a new sample is selected
  buildMetadata(selectedYear);
  // buildCharts(selectedYear);
}

function buildMetadata(year) {
  jsonData.then((data) => {
    var data = data.aqiData;

    // Filter the data for the object with the desired year
    var resultArray = data.filter(sampleObj => sampleObj.year == year);
    
    var result = resultArray[0];
    aqi_result = result.aqi;
    console.log(aqi_result);

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    let trace1 = {
      type:'bar',
      x:['no2_aqi', 'o3_aqi', 'so2_aqi', 'co_aqi'],
      y: aqi_result
    };

    let plot_data = [
      trace1
    ];

    var layout = {
      title: 'San Diego AQI per Pollutant'
    };

    Plotly.newPlot('bar', plot_data, layout);
  });
}



