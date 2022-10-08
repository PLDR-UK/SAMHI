var map = L.map('map').setView([52.735044,-1.420020], 7)

// Add basemap
var layer_OSM = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(map)

map.createPane('labels');
map.getPane('labels').style.zIndex = 550;
map.getPane('labels').style.pointerEvents = 'none';

var stamenLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png',
  pane: 'labels'
}).addTo(map)

map.spin(true);
// Add GeoJSON
$.getJSON('./data/samhi_simple.json', function (geojson) {
  var choroplethLayer = L.choropleth(geojson, {
    valueProperty: 'dec_2019',
    scale: ['#29B6F6','#FFF9C4', '#FF5722'],
    steps: 10,
    mode: 'q',
    style: {
      color: '#D5D8DC',
      weight: 0.1,
      fillOpacity: 1.0
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(' SAMHI Index 2019' + '<br>' +
                      '<hr>' +
                      'Decile: ' + feature.properties.dec_2019 + '<br>' +
                      'Z score:' + feature.properties.index_2019.toLocaleString())
    }
  }).addTo(map)
  map.spin(false);
    
  // Add legend (don't forget to add the CSS from index.html)
  var legend = L.control({ position: 'bottomright' })
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = choroplethLayer.options.limits
    var colors = choroplethLayer.options.colors
    var labels = []

    // Add min & max
    div.innerHTML = '<div class="title"> Legend </div>'
    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] +': Best' + '</div> \
			<div class="max">' + 'Worst :'+limits[limits.length - 1] + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  legend.addTo(map)

  var layers = {
    'OpenStreetMap': layer_OSM,
    'SAMHI Index': choroplethLayer,
    'OSM Labels': stamenLayer
};

var layersControl = L.control.layers({},
    layers,
    { collapsed: false }).addTo(map);
})






