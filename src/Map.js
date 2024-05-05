import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import { portsDataGeoJson } from "./ports";
import { getParticularShipGeoData, getShipNames } from "./shipsArray";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYXNodXRob3IzMjEiLCJhIjoiY2x2c2l5cDhyMTBvNTJpcGFoZ3Z1NjdvZiJ9.i6zckAg_jgKGt1o4wzauRw";

function getRandomColor() {
  // Generate random values for red, green, and blue components
  const red = Math.floor(Math.random() * 256); // Random value between 0 and 255
  const green = Math.floor(Math.random() * 256); // Random value between 0 and 255
  const blue = Math.floor(Math.random() * 256); // Random value between 0 and 255

  // Convert RGB values to hexadecimal format
  const redHex = red.toString(16).padStart(2, '0'); // Ensure two digits
  const greenHex = green.toString(16).padStart(2, '0'); // Ensure two digits
  const blueHex = blue.toString(16).padStart(2, '0'); // Ensure two digits

  // Combine RGB components into a hexadecimal color code
  const colorHex = `#${redHex}${greenHex}${blueHex}`;

  return colorHex;
}
const Map = () => {
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-87.65, 41.84],
      zoom: 10,
    });

    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function (error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image);
          // Add a GeoJSON source with multiple points
          map.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: portsDataGeoJson,
            },
          });

          // layer for port markers

          map.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              // get the title name from the source's "title" property
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });

          /* Here Source  for ships , then line layer for ships then symbol for ship name is added */
          const shipNames = getShipNames();
          shipNames.forEach((shipName) => {
            map.addSource(shipName, {
              type: "geojson",
              data: getParticularShipGeoData(shipName)
            })
            map.addLayer({
              id: `${shipName}_line`,
              type: "line",
              source: shipName,
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                'line-color': getRandomColor(),
                'line-width': 4
              }
            });
  
            map.addLayer({
              id:  `${shipName}_symbol`,
              type: "symbol",
              source: shipName,
              layout: {
                  "text-field": ["get", "title"], // Get the ship name from the "title" property
                  "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
                  "text-size": 12,
                  "text-offset": [0, 0.5], // Offset to position the label above the line
                  "text-anchor": "top"
              },
              paint: {
                  "text-color": "#000" // Color of the text labels
              }
            });
            let popup;

            map.on('mouseenter', `${shipName}_line`, (e) => {
              map.getCanvas().style.cursor = 'pointer';
              const coordinates = e.lngLat;
              const shipTitle = e.features[0].properties.title;
              popup = new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(shipTitle)
                .addTo(map);
            });

            map.on('mouseleave', `${shipName}_line`, () => {
              map.getCanvas().style.cursor = '';
              if (popup) {
                popup.remove(); // Remove the popup from the map
                popup = null; // Set popup to null to indicate it has been removed
              }
            });

          })

          // for curson events





          
        }
      );
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;
