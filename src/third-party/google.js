import axios from "axios"
import Polyline from "@mapbox/polyline"
import {GOOGLE_MAPS_API_KEY} from "src/config/app"
import {GoogleSignin} from "@react-native-google-signin/google-signin"


const ROUTE_API_URL = "https://maps.googleapis.com/maps/api/directions/json"
export const getRoute = async (start, end) => {
  try {
    const res = await axios.get(ROUTE_API_URL, {
      params: {
        origin: `${start.latitude},${start.longitude}`,
        destination: `${end.latitude},${end.longitude}`,
        key: GOOGLE_MAPS_API_KEY
      }
    })
    const points = Polyline.decode(res.data.routes[0].overview_polyline.points)
    const routeCoordinates = points.map(point => {
      return {
        latitude: point[0],
        longitude: point[1]
      }
    })
    // console.log('get-route-success', routeCoordinates)
    return routeCoordinates
  } catch (e) {
    console.log('get-route-error', e.message)
    return []
  }
}

export const getAddressFromLocation = async (location) => {
  try {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${GOOGLE_MAPS_API_KEY}`
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
      if (route && city && state && country && zip_code) {
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


GoogleSignin.configure({
  iosClientId: '755672979117-20ntdnl9mmpssm6e50k9tt5sh1lp55go.apps.googleusercontent.com',
  webClient: {
    id: '755672979117-tjit6ab2k2edrf6caakf80p437dinntv.apps.googleusercontent.com',
  },
  scopes: [
    'profile',
    'email',
  ],
})

export const authorizeWithGoogle = async () => {
  if (await GoogleSignin.isSignedIn()) {
    await GoogleSignin.signOut()
  }
  await GoogleSignin.hasPlayServices()
  await GoogleSignin.signIn()
  const tokens = await GoogleSignin.getTokens()
  // console.log('tokens', tokens)
  return tokens.accessToken
}
