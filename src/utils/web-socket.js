import useWebSocket from "react-native-use-websocket"
import {appConfig} from "../config/app";

export const useUpdateDriverLocationWebsocket = (driverId, verbose = false) => {
  if (verbose)
    console.log('use-update-driver-location-websocket', driverId)
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `${appConfig.websocketUrl}/driver_location/${driverId}}`,
    {
      onOpen: () => {
        console.log('driver-websocket-opened')
      },
      shouldReconnect: (closeEvent) => true,
      onError: (event) => {
        console.log('driver-websocket-error', event)
      },
      onClose: (event) => {
        console.log('driver-websocket-closed', event)
      },
      onMessage: (event) => {
        console.log('driver-websocket-message', event)
      },
    }
  );

  return { sendJsonMessage, lastMessage, readyState };
}
