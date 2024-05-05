import shipDataFirstHalf from './first_half.json';
import shipDataSecondHalf from './second_half.json';
const shipData = [...shipDataFirstHalf, ...shipDataSecondHalf];
const customShipFilter = (shipName, date) => {

  return ({ site_name, location_longitude, location_latitude, heading, ec_timestamp }) => {
    return site_name === shipName && new Date(ec_timestamp).toDateString() === new Date(date).toDateString();
  }
}
export const getShipNames = () => {
  const uniqueShipNames = new Set();
  shipData.forEach(({ site_name }) => {
    uniqueShipNames.add(site_name);
  })
  const shipNames = [...uniqueShipNames];
  console.log(shipNames);
  return shipNames;
}
export const getParticularShipGeoData = (shipName, date) => {
  // to get the data of the ship based on ship Name
  const particularShipData = shipData.filter(customShipFilter(shipName, date));
  // Geo Data is a format which MapBox need to draw line
  const particularShipGeoData = {
    type: "Feature",
    properties: {
      title: shipName
    },
    geometry: {
      coordinates: [],
      type: "LineString"
    }
  
  }
  for (let i = 0; i < particularShipData.length; i++){
    const { site_name, location_longitude, location_latitude, heading, ec_timestamp } = particularShipData[i];
    particularShipGeoData.geometry.coordinates.push([location_longitude, location_latitude]);
  };
  return particularShipGeoData;

}


// export const shipGeoJson = shipData.filter(shipFilter).map(({ site_name, location_longitude, location_latitude, heading, ec_timestamp }) => {
//   return {
//     type: "Feature",
//     properties: {
//       title: site_name,
//     },
//     geometry: {
//       coordinates: [location_longitude, location_latitude],
//       type: "Point"
//     }
//   }
// })
