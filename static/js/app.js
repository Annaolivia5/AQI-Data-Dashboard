jsonData = d3.json("/jsondata");
mapData = d3.json("/map");
calData = d3.json("/cal");

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  jsonData.then((data) => {
    //Grab data
    var years = data.year;
    //Build drop down
    years.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    //Call function to display 2000 data on page open
    bar_chart('2000');
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
    
    //filter result by year
    var result = values.filter(sampleObj => sampleObj.year == year);
   
    //get array data
    var aqi_result = result[0].co_aqi;
    
    //Zing chart JS library
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
    //Call zingchart
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

    //get data for 2015
    var aqi_state_2015 = data.aqi_state_data[15].aqi;
    //initialize arrays to hold State abbrevs and CO data
    state_code = [];
    co_aqi = [];

    //Loop through JSON, append values to array
     for (let i = 0; i < aqi_state_2015.length; i++)
      {
        var row_state = aqi_state_2015[i][0];
        var row_co = aqi_state_2015[i][1];
        state_code.push(row_state);
        co_aqi.push(row_co);
      }
  
    //Chloropleth map data for US. Data is transferred via state abrevation
    var data = [{
      type: 'choropleth',
      locationmode: 'USA-states',
      locations: state_code,
      z: co_aqi,
      text: state_code,
      zmin: 0,
      zmax: 40,
      colorscale: [
          [0, 'rgb(239,243,255)'], [0.2, 'rgb(198,219,239)'],
          [0.4, 'rgb(158,202,225)'], [0.6, 'rgb(107,174,214)'],
          [0.8, 'rgb(49,130,189)'], [1, 'rgb(8,81,156)']
      ],
      colorbar: {
          title: 'CO AQI',
          thickness: 10
      },
      marker: {
          line:{
              color: 'rgb(255,255,255)',
              width: 1
          }
      }
  }];

  
  var layout = {
    title: '2015 CO AQI Map',
    font: {
      family: 'Arial',
      size: 17
    },
    width: 1200,
    height: 600,
    geo:{
        scope: 'usa',
        showlakes: true,
        lakecolor: 'rgb(255,255,255)'
    }
};
//Call Plotly function
Plotly.newPlot("myDiv", data, layout, {showLink: false});
});


};
function optionChanged(selectedYear) {
  // Fetch new data each time a new sample is selected
  bar_chart(selectedYear);
  cal_map(selectedYear);
  // buildCharts(selectedYear);
}

function bar_chart(year) {
  jsonData.then((data) => {
    var data = data.aqiData;
  
    // Filter the data for the object with the desired year
    var resultArray = data.filter(sampleObj => sampleObj.year == year);

    //Gets four values for each pollutant
    var result = resultArray[0];
    aqi_result = result.aqi;

    //Building plot data
    let trace1 = {
      type:'bar',
      x:['NO2', 'O3', 'SO2', 'CO'],
      y: aqi_result,
      marker: {
        color: 'rgb(49,130,189)',
        opacity: 0.6,
        line: {
          color: 'rgb(8,81,156)',
          width: 1.5
        }
      }
    };

    let plot_data = [
      trace1
    ];

    //Builds layout for bar chart
    var layout = {
      title: 'San Diego Daily average AQI per Pollutant ' + String(year),
      
      font: {
        family: 'Arial',
        size: 17
      },
      yaxis: {title: 'AQI'},
    };

    Plotly.newPlot('bar', plot_data, layout);
  });
}




