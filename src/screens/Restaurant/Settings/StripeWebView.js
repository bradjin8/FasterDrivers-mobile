import React from "react";
import {WebView} from "react-native-webview";
import {useSelector} from "react-redux";

const StripeWebView = ({navigation, route}) => {
  const {url} = route?.params;
  const {user} = useSelector(state => state.loginReducer)

  const onFinished = (type) => {
    navigation.navigate(`${user.type}BottomBar`, {
      screen: 'Settings',
      params: {
        screen: 'StripeConnect',
        params: {
          type
        }
      }
    })
  }
  const onNavigationStateChange = (e) => {
    if (e.url === 'http://localhost:8080/return/') {
      onFinished('return')
    } else if (e.url === 'http://localhost:8080/reauth/') {
      onFinished('reauth')
    }
  }

  return (
    <WebView
      source={{uri: url}}
      onNavigationStateChange={onNavigationStateChange}
      startInLoadingState
      scalesPageToFit
      javaScriptEnabled
      style={{flex: 1}}
    />
  );
};

export default StripeWebView;
