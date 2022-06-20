function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// // above is what they arleady gave us I dont think you have to worry about it!

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    //in 12.43 it says to do var resultsArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // since its asking to create an array that will hold the data form the new sample chosen. so change metadata to data
    var resultsArray = samples.filter(sampleObj => sampleObj.id == sample); 

    //  5. Create a variable that holds the first sample in the array.
    // so what 
    var results = resultsArray[0]


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = results.otu_ids;
    var lables = results.otu_lables;
    var samples = results.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = ids.slice(0,10).map(x => `OTU ${x}`).reverse();  
    

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: samples.slice(0,10).reverse(),
      y: yticks,
      text: lables,//.slice(0,10).reverse(),
      type: "bar",
      orientation: 'h'
    }];


    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "The Top Ten Bacterial Cultures Found"

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
 
      var bubbleData = [{
      x: ids,
      y: samples,
      text: lables,
      mode: 'markers',
      marker: {
        size: samples,
        color: ids,
        colorscale: 'Earth',
      }
    }

    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "The Top Ten Bacterial Cultures Found",
      x: {title: "OTU Ids"},
      y: {tilte: "Sample values"}
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)  

    //Start of deliverable 3 my tutor said put it here. 
    // Create a variable that holds the samples array. 
    // Create a variable that filters the samples for the object with the desired sample number.
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // Create a variable that holds the first sample in the array.
    // 2. Create a variable that holds the first sample in the metadata array.

    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var metadataresult = metadataArray[0];
    
    // 3. Create a variable that holds the washing frequency.
    var metafreq = metadataresult.wfreq 
     
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: metafreq,
      title: { text: "Frequency of Belly-Button Washings Per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 500] },
        steps: [
          { range: [0, 200], color: "red" },
          { range: [200, 400], color: "orange" },
          { range: [400, 600], color: "yellow" },
          { range: [600, 800], color: "green" },
          { range: [800, 1000], color: "blue" },
        ],
        }


    }
    ] 
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 470, margin: { t: 0, b: 0 } };
     

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}
