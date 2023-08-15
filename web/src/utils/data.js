export const address2Text = (address) => {
  if (!address) return ''
  return `${address?.street || ''}, ${address?.city || ''}, ${address?.state || ''} - ${address?.zip_code || ''}`
}

export const isValidID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  return uuidRegex.test(id);
}

export const extractLatLong = (location = '') => {
  try {
    const data = location.split('(')[1]?.split(')')[0];
    const lng = Number(data?.split(' ')[0]);
    const lat = Number(data?.split(' ')[1]);
    return {lat, lng}
  } catch (e) {
    console.log('extract-lat-long-ex', e.message)
    return null
  }
}

// calculate distance between two points in miles
export const getDistance = (loc1, loc2) => {
  const R = 3958.8; // Radius of the Earth in miles
  const rlat1 = loc1.lat * (Math.PI / 180); // Convert degrees to radians
  const rlat2 = loc2.lat * (Math.PI / 180); // Convert degrees to radians
  const difflat = rlat2 - rlat1; // Radian difference (latitudes)
  const difflng = (loc2.lng - loc1.lng) * (Math.PI / 180); // Radian difference (longitudes)

  const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflng / 2) * Math.sin(difflng / 2)));
  return d.toFixed(1);
}
