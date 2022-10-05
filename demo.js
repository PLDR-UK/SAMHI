var map = L.map('map').setView([39.9897471840457, -75.13893127441406], 11)

// Add basemap
var layer_OSM = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(map)

// Add GeoJSON
$.getJSON('./crimes_by_district.geojson', function (geojson) {
  var choroplethLayer = L.choropleth(geojson, {
    valueProperty: 'incidents',
    scale: ['blue','yellow', 'red'],
    steps: 10,
    mode: 'q',
    style: {
      color: '#fff',
      weight: 1,
      fillOpacity: 0.6
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup('District ' + feature.properties.dist_num + '<br>' +
          feature.properties.incidents.toLocaleString() + ' incidents')
    }
  }).addTo(map)
  
  // Add legend (don't forget to add the CSS from index.html)
  var legend = L.control({ position: 'bottomright' })
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = choroplethLayer.options.limits
    var colors = choroplethLayer.options.colors
    var labels = []

    // Add min & max
    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
			<div class="max">' + limits[limits.length - 1] + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  legend.addTo(map)

  var layers = {
    'OpenStreetMap': layer_OSM,
    'Test': choroplethLayer
};

var layersControl = L.control.layers({},
    layers,
    { collapsed: false }).addTo(map);
})


