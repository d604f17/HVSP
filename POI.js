function poi(latitude, longitude, value) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.value = value;
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

//fastholder samme lat (op og ned)
function getLonDifrenceAtLat(lat, lon, distance) {
    var R = 6371; // Radius of the earth in km

    var rLat = deg2rad(lat);
    var rLon = deg2rad(lon);

    var hav_dr = (1-Math.cos(distance/R))/2;
    var newLat = (Math.acos(1-2*hav_dr)+rLat)*(180/Math.PI);
    return newLat - lat;
}

//fastholder samme lon (højre venstre)
function getLatDifrenceAtLon(lat, lon, distance) {
    var R = 6371; // Radius of the earth in km
    var rLat = deg2rad(lat);
    var rLon = deg2rad(lon);

    var hav_dr = (1-Math.cos(distance/R))/2;
    var newLon = (rLon + Math.acos(1-((2*hav_dr)/(Math.cos(rLat)*Math.cos(rLat)))))*(180/Math.PI);
    return newLon - lon;
}

//exports
module.exports = {
    poi: poi,
    getDistanceFromLatLonInKm: getDistanceFromLatLonInKm,
    getLonDifrenceAtLat: getLonDifrenceAtLat,
    getLatDifrenceAtLon: getLatDifrenceAtLon
};