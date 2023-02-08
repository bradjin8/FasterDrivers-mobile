import React from "react"
import { Provider } from "react-redux"
import { ThemeProvider } from "react-native-elements"
import { theme } from "@options"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"
import { store } from "./redux/store"
import Navigation from "navigation"
import FlashMessage from "react-native-flash-message"
import { LogBox, SafeAreaView } from "react-native";
import moment from "moment"

const persistor = persistStore(store)

moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "1s",
    ss: "%ss",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1Y",
    yy: "%dY"
  }
})

const App = () => {
  LogBox.ignoreAllLogs()
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={theme}>
              <Navigation />
              <FlashMessage />
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

export default App
