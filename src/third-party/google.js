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
