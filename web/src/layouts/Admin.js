// Chakra imports
import {ChakraProvider, Portal, useDisclosure} from '@chakra-ui/react';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// Layout components
import Sidebar from 'components/Sidebar';
import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
import {adminRoutes as routes} from 'routes.js';
// Custom Chakra theme
import theme from 'theme/theme.js';
// Custom components
import MainPanel from '../components/Layout/MainPanel';
import PanelContainer from '../components/Layout/PanelContainer';
import PanelContent from '../components/Layout/PanelContent';
import AdminNavbar from "../components/Navbars/AdminNavbar";
import SignInAsAdmin from "../views/Auth/SignInAsAdmin";

export default function Dashboard(props) {
  const {...rest} = props;
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {token, user} = useSelector(state => state.auth)
  document.documentElement.dir = 'ltr';

  // states and functions
  const [sidebarVariant, setSidebarVariant] = useState('transparent');
  const history = useHistory()


  useEffect(() => {
    if (user)
      checkUserType()
  }, [user])

  const checkUserType = () => {
    if (user) {
      if (user.type && !location.pathname.startsWith(`/${user?.type?.toLowerCase()}`)) {
        history.replace(`/${user?.type?.toLowerCase()}/home`)
      }
    } else {
      history.replace(`/signin/admin`)
    }
  }

  if (!token || !user) {
    return <Redirect to={`/signin/admin`}/>
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
            fixed={false}
            {...rest}
          />
        </Portal>
        <PanelContent>
          <PanelContainer>
            <Switch>
              {getRoutes(routes)}
              <Redirect from='/admin' to='/admin/dashboard'/>
            </Switch>
          </PanelContainer>
        </PanelContent>

      </MainPanel>
    </ChakraProvider>
  );
}
