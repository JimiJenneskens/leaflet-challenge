// Query all earthquakes in last 7 days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform request and get data
d3.json(queryUrl, function(data) {
  createMap(data.features);
});

function createMap(earthquakeData) {
    // Create markers
      earthquakeMarkers = earthquakeData.map((feature) =>
        L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
            radius: magCheck(feature.properties.mag),
            stroke: true,
            color: 'black',
            opacity: 1,
            weight: 0.5,
            fill: true,
            fillColor: magColor(feature.properties.mag),
            fillOpacity: 0.9   
        })
        .bindPopup("<h1> Magnitude : " + feature.properties.mag +
        "</h1><hr><h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
      )

      // Create earthquake layers
      var earthquakes = L.layerGroup(earthquakeMarkers)
       var mags = earthquakeData.map((d) => magCheck(+d.properties.mag));
       console.log(d3.extent(mags));
       console.log(mags);

  // Create streetmap
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Create myMap
  var myMap = L.map("map", {
    center: [38.98, -96.02],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

// Create legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(myMap){
    var div = L.DomUtil.create("div","legend");
    div.innerHTML = [
        "<k class='maglt2'></k><span>0-2</span><br>",
        "<k class='maglt3'></k><span>2-3</span><br>",
        "<k class='maglt4'></k><span>3-4</span><br>",
        "<k class='maglt5'></k><span>4-5</span><br>",
        "<k class='maggt5'></k><span>5+</span><br>"
      ].join("");
    return div;
}

// Add legend to mymap
legend.addTo(myMap);
}

     function magColor(mag) {
      var color = "";
      if (mag <= 2) { color = "#66bb77"; }
      else if (mag <= 3) {color = "#aadd76"; }
      else if (mag <= 4) { color = "#edee88"; }
      else if (mag <= 5) {color = "#ffa975"; }
      else { color = "#ff6565"; }
    
    return color;
    
    };

// Function to check for magnitude below 1
function magCheck(mag){
  if (mag <= 1){
      return 8
  }
  return mag * 8;
}