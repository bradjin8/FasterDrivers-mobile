import useWebSocket from "react-native-use-websocket"
import {appConfig} from "../config/app";

export const useUpdateDriverLocationWebsocket = (driverId, verbose = false) => {
  const url = `${appConfig.websocketUrl}/driver_location/${driverId}/`
  if (verbose)
    console.log('use-update-driver-location-websocket', url)
  const {sendMessage, sendJsonMessage, lastMessage, readyState} = useWebSocket(
    url,
    {
      onOpen: () => {
        if (verbose)
          console.log('driver-websocket-opened')
      },
      shouldReconnect: (closeEvent) => true,
      onError: (event) => {
        if (verbose)
          console.log('driver-websocket-error', event)
      },
      onClose: (event) => {
        if (verbose)
          console.log('driver-websocket-closed', event)
      },
      onMessage: (event) => {
        if (verbose)
          console.log('driver-websocket-message', event)
      },
    }
  );

  return {sendMessage, sendJsonMessage, lastMessage, readyState};
}
