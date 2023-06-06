import axios from "axios"
import Polyline from "@mapbox/polyline"
import {GOOGLE_MAPS_API_KEY} from "../config/app"

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
    const res = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        latlng: `${location.latitude},${location.longitude}`,
        key: GOOGLE_MAPS_API_KEY
      }
    })
    // console.log('get-address-success', res.data.results[0].formatted_address)
    return {
      street: res.data.results[0].address_components[0].long_name,
      city: res.data.results[0].address_components[3].long_name,
      state: res.data.results[0].address_components[4].long_name,
      zip_code: res.data.results[0].address_components[6].long_name,
      address: res.data.results[0].formatted_address
    }
  } catch (e) {
    console.log('get-address-error', e.message)
    return ""
  }
}
