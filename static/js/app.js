const url = "/jsondata";

// // Promise Pending
// const dataPromise = d3.json(url);
// console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it


jsonData = d3.json("/jsondata");
mapData = d3.json("/map");
calData = d3.json("/cal");

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  jsonData.then((data) => {

    var years = data.year;

    years.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });


    buildMetadata('2000');
    cal_map('2000');
    
  });
}

// Initialize the dashboard
init();
map_aqi();
cal_map();

function cal_map(year){
  calData.then((data) => {
    console.log(year)
    values = data.cal_data;
  
    var result = values.filter(sampleObj => sampleObj.year == year);
   
    var aqi_result = result[0].co_aqi;
    console.log(aqi_result)

    var myConfig = {
      type: 'calendar',
      options: {
        year: {
          text: year,
          visible: true
        },
        startMonth: 1,
        endMonth: 12,
        palette: ['none', '#2196F3'],
        month: {
          item: {
            fontColor: 'gray',
            fontSize: 9
          }
        },
        weekday: {
          values: ['','M','','W','','F',''],
          item:{
            fontColor: 'gray',
            fontSize:9
          }
        },
        values: aqi_result
      },

      plotarea: {
        marginTop: '15%',
        marginBottom:'5%',
        marginLeft: '8%',
        marginRight: '8%'
      }
    };
    
    zingchart.loadModules('calendar', function(){   
      zingchart.render({ 
        id : 'myChart', 
        data : myConfig, 
        height: 400, 
        width: '100%'
      });
    });
    
  });
}
function map_aqi(){

  mapData.then((data) => {

  
    var aqi_state_2015 = data.aqi_state_data[15].aqi;
  
    state_code = [];
    co_aqi = [];

     for (let i = 0; i < aqi_state_2015.length; i++)
      {
        var row_state = aqi_state_2015[i][0];
        var row_co = aqi_state_2015[i][1];
        state_code.push(row_state);
        co_aqi.push(row_co);
      }
  
 
    var data = [{
      type: 'choropleth',
      locationmode: 'USA-states',
      locations: state_code,
      z: co_aqi,
      text: state_code,
      zmin: 0,
      zmax: 40,
      colorscale: [
          [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
          [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
          [0.8, 'rgb(117,107,218)'], [1, 'rgb(84,39,143)']
      ],
      colorbar: {
          title: 'CO AQI',
          thickness: 0.2
      },
      marker: {
          line:{
              color: 'rgb(255,255,255)',
              width: 2
          }
      }
  }];

  
  var layout = {
    title: '2015 CO AQI Map',
    geo:{
        scope: 'usa',
        showlakes: true,
        lakecolor: 'rgb(255,255,255)'
    }
};

Plotly.newPlot("myDiv", data, layout, {showLink: false});
});


};
function optionChanged(selectedYear) {
  // Fetch new data each time a new sample is selected
  buildMetadata(selectedYear);
  cal_map(selectedYear);
  // buildCharts(selectedYear);
}

function buildMetadata(year) {
  jsonData.then((data) => {
    var data = data.aqiData;
    console.log(data)
    // Filter the data for the object with the desired year
    var resultArray = data.filter(sampleObj => sampleObj.year == year);
    
    var result = resultArray[0];
    aqi_result = result.aqi;

    // Use d3 to select the panel with id of `#sample-metadata`
    
    // Use `.html("") to clear any existing metadata
  
    let trace1 = {
      type:'bar',
      x:['no2_aqi', 'o3_aqi', 'so2_aqi', 'co_aqi'],
      y: aqi_result
    };

    let plot_data = [
      trace1
    ];

    var layout = {
      title: 'San Diego AQI per Pollutant ' + String(year)
    };

    Plotly.newPlot('bar', plot_data, layout);
  });
}




