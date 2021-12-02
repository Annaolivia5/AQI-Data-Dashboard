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

    for (let year in data) {
      selector
        .append("option")
        .text(year)
        .property("value", year);
    }
  });
}

// Initialize the dashboard
init();


