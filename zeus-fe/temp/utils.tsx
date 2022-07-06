/*
Solution for when we have stations and exits in the database
Algorithm to find all Latitude Longitude locations within a certain distance from a given Lat Lng location
SET @orig_lat=-8.116137;
SET @orig_lon=-34.897488;
SET @dist=1000;

SELECT *,(((acos(sin((@orig_lat*pi()/180)) * sin((dest.latitude*pi()/180))+cos((@orig_lat*pi()/180))*cos((dest.latitude*pi()/180))*cos(((@orig_lon-dest.longitude)*pi()/180))))*180/pi())*60*1.1515*1609.344) as distance FROM nodes AS dest HAVING distance < @dist ORDER BY distance ASC LIMIT 100;
*/

//Meanwhile... Formulas here http://www.movable-type.co.uk/scripts/latlong.html
export const calculateDistanceAtoB = (latA: number, lngA: number, latB: number, lngB: number): number => {
  const R = 6371e3 // Radius of the earth in metres
  //const R = 6371; // Radius of the earth in km
  const φ1 = (latA * Math.PI) / 180 // φ, λ in radians
  const φ2 = (latB * Math.PI) / 180
  const Δφ = ((latB - latA) * Math.PI) / 180
  const Δλ = ((lngB - lngA) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const d = R * c // in metres

  return d
}
