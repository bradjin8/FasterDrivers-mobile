import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// import SplashScreen from "../features/SplashScreen";

// import SideMenu from './sideMenu';
//@BlueprintImportInsertion
// import Maps117690Navigator from '../features/Maps117690/navigator';

const AppNavigator = {

    //@BlueprintNavigationInsertion
// Maps117690: { screen: Maps117690Navigator },
// Add-Item117689: { screen: Add-Item117689Navigator },
    /** new navigators can be added here */
    SplashScreen: {
      // screen: SplashScreen
    }
};

const DrawerAppNavigator = createStackNavigator(
  {
    ...AppNavigator,
  },
  {
    // contentComponent: SideMenu
  },
);

const AppContainer = createAppContainer(DrawerAppNavigator);

export default AppContainer;