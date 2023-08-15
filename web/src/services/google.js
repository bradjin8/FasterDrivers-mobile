import axios from 'axios'

export const MAP_API_KEY = "AIzaSyCAcAhKPua5L2ewpRU_P6lmvI37lSIg6Hk"

export const getAddressFromLocation = async (location) => {
  try {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${MAP_API_KEY}`
    // console.log('get-address-url', URL)
    const res = await axios.get(URL)
    for (let result of res.data.results) {
      let route, street_number, city, state, country, zip_code, formatted_address
      result.address_components.forEach(component => {
        if (component.types.includes("postal_code")) {
          zip_code = component.long_name
        }
        else if (component.types.includes("country")) {
          country = component.short_name
        }
        else if (component.types.includes("administrative_area_level_1")) {
          state = component.short_name
        }
        else if (component.types.includes("locality")) {
          city = component.long_name
        }
        else if (component.types.includes("route")) {
          route = component.long_name
        }
        else if (component.types.includes("street_number")) {
          street_number = component.long_name
        }

      })
      formatted_address = result.formatted_address
      if (route && (city || state) && country && zip_code) {
        console.log('get-address-success', formatted_address)
        return {
          street: street_number ? `${street_number} ${route}` : route,
          city,
          state,
          country,
          zip_code,
          formatted_address
        }
      }
    }
    return ""
  } catch (e) {
    console.log('get-address-error', e.message)
    return ""
  }
}
