// Chakra imports
import {ChakraProvider, Portal, useDisclosure} from '@chakra-ui/react';
import Configurator from 'components/Configurator/Configurator';
import Footer from 'components/Footer/Footer.js';
// Layout components
import AdminNavbar from 'components/Navbars/AdminNavbar.js';
import Sidebar from 'components/Sidebar';
import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {Redirect, Route, Switch, useHistory, useLocation} from 'react-router-dom';
import Routes, {customerRoutes as routes} from 'routes.js';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// Custom Chakra theme
import theme from 'theme/theme.js';
import FixedPlugin from '../components/FixedPlugin/FixedPlugin';
// Custom components
import MainPanel from '../components/Layout/MainPanel';
import PanelContainer from '../components/Layout/PanelContainer';
import PanelContent from '../components/Layout/PanelContent';
import Cart from "../views/Customer/Cart";

export default function CustomerLayout(props) {
  const {...rest} = props;
  // states and functions
  const {token, user} = useSelector(state => state.auth)
  const history = useHistory()
  const location = useLocation()

  const [sidebarVariant, setSidebarVariant] = useState('transparent');
  const [fixed, setFixed] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclosure();
  document.documentElement.dir = 'ltr';

  useEffect(() => {
    if (user)
      checkUserType()
  }, [user])

  const checkUserType = () => {
    if (user) {
      if (user.is_admin) {
        history.replace(`/admin`)
      } else {
        if (!location.pathname.startsWith(`/${user?.type?.toLowerCase()}`)) {
          history.replace(`/${user?.type?.toLowerCase()}/home`)
        }
      }
    } else {
      history.replace(`/signin`)
    }
  }

  if (!token || !user) {
    return <Redirect to={`/signin`}/>
  }


  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.children?.length > 0) {
        return <Switch path={prop.path} key={key}>
          {getRoutes(prop.children)}
        </Switch>
      }
      return <Route exact index={prop.index === true} path={prop.path} key={key}>{<prop.component/>}</Route>;
    });
  };
  // Chakra Color Mode
  return (
    <ChakraProvider theme={theme} resetCss={false}>
      <Sidebar
        routes={routes}
        logoText={''}
        display='none'
        sidebarVariant={sidebarVariant}
        {...rest}
      />
      <MainPanel
        w={{
          base: '100%',
          xl: 'calc(100% - 275px)'
        }}>
        <Portal w={'100%'}>
          <AdminNavbar
            onOpen={onOpen}
            logoText={''}
            fixed={fixed}
            {...rest}
          />
        </Portal>

        <PanelContent>
          <PanelContainer>
            <Switch>
              {getRoutes(routes)}
              <Redirect from='/customer' to='/customer/home' />
            </Switch>
          </PanelContainer>
        </PanelContent>
      </MainPanel>
      <Cart/>
    </ChakraProvider>
  );
}
