
// npm install geoip-lite
function location(ip){

const geoip = require('geoip-lite');
 
const geo = geoip.lookup(ip);

if (geo) {
    return `Latitude: ${geo.ll[0]}, Longitude: ${geo.ll[1]}`;
} else {
  console.error("Geolocation not found for the provided IP.");
}
}

export{location};

