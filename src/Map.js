import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import { portsDataGeoJson } from "./ports";
import { getParticularShipGeoData } from "./shipsArray";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYXNodXRob3IzMjEiLCJhIjoiY2x2c2l5cDhyMTBvNTJpcGFoZ3Z1NjdvZiJ9.i6zckAg_jgKGt1o4wzauRw";

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

          map.addSource("ships", {
            type: "geojson",
            data: getParticularShipGeoData("ship_9")
          })
          console.log(getParticularShipGeoData("ship_9"));
          map.addLayer({
            id: "ships",
            type: "line",
            source: "ships",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              'line-color': '#888',
              'line-width': 8
            }
          });

          map.addLayer({
            id: "ship-labels",
            type: "symbol",
            source: "ships",
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
