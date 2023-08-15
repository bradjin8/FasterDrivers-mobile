// chakra imports
import {Box, ChakraProvider} from '@chakra-ui/react';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Footer from 'components/Footer/Footer.js';
// core components
import React from 'react';
import {Redirect, Route, Switch, useLocation} from 'react-router-dom';
import theme from 'theme/theme.js';
import AuthNavbar from "../components/Navbars/AuthNavbar";
import ForgotPassword from "../views/Auth/ForgotPassword";
import ResetPassword from "../views/Auth/ResetPassword";
import SignInAsAdmin from "../views/Auth/SignInAsAdmin";
import PrivacyPolicy from "../views/Common/PrivacyPolicy";
import TermsAndConditions from "../views/Common/TermsAndConditions";
import Home from "../views/Home";
import SignIn from "../views/Auth/SignIn";
import SignUp from "../views/Auth/SignUp";
import {useSelector} from "react-redux";

export default function Pages(props) {
  const {...rest} = props;
  // ref for the wrapper div
  const wrapper = React.createRef();
  React.useEffect(() => {
    document.body.style.overflow = 'unset';
    // Specify how to clean up after this effect:
    return function cleanup() {
    };
  });

  const {token, user} = useSelector(state => state.auth)
  if (token && user) {
    if (user.is_admin)
      return <Redirect to={'/admin'}/>
    return <Redirect to={`/${user.type?.toLowerCase()}`}/>
  }

  const location = useLocation()

  return (
    <ChakraProvider theme={theme} resetCss={false} w='100%'>
      <Box w='100%'>
        {location.pathname !== '/signin/admin' && <AuthNavbar path={location.pathname}/>}
        <Box ref={wrapper} w='100%'>
          <Switch>
            <Route path={'/signup'} component={SignUp}/>
            <Route path={'/signin/admin'} component={SignInAsAdmin}/>
            <Route path={'/signin'} component={SignIn}/>
            <Route path={'/forgot-password'} component={ForgotPassword}/>
            <Route path={'/reset-password'} component={ResetPassword}/>
            <Route path={'/terms-and-conditions'} component={TermsAndConditions}/>
            <Route path={'/privacy-policy'} component={PrivacyPolicy}/>
            <Route path={'/'} component={Home}/>
          </Switch>
        </Box>
        {location.pathname !== '/signin/admin' && <Footer/>}
      </Box>
    </ChakraProvider>
  );
}
