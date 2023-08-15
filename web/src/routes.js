// import
import {HomeIcon, SettingsIcon, OrderIcon, StatsIcon, MapIcon} from "components/Icons/Icons";
import {BiMessage, BiMoney} from "react-icons/bi";
import {BsKeyboard} from "react-icons/bs";
import {HiUsers} from "react-icons/hi";
import Analytics from "./views/Admin/Analytics/Analytics";
import Feedback from "./views/Admin/Feedback";
import Keywords from "./views/Admin/Keywords";
import Subscriptions from "./views/Admin/Subscriptions/Subscriptions";
import Users from "./views/Admin/Users/Users";
import {customerHomeRoutes} from "./views/Customer/Home";
import CustomerOrders from "./views/Customer/Order";
import {customerSettingsRoutes} from "./views/Customer/Settings";
import RestaurantHome from "./views/Restaurant/Home";
import RestaurantMap from "./views/Restaurant/Map";
import RestaurantMenu from "./views/Restaurant/Menu";
import {restaurantSettingsRoutes} from "./views/Restaurant/Settings";

export const customerRoutes = [
  {
    path: "/customer/home",
    name: "Home",
    icon: <HomeIcon color="inherit"/>,
    children: customerHomeRoutes,
  },
  {
    path: "/customer/orders",
    name: "Orders",
    icon: <OrderIcon color="inherit"/>,
    component: CustomerOrders,
  },
  {
    path: "/customer/settings",
    name: "Settings",
    icon: <SettingsIcon color="inherit"/>,
    children: customerSettingsRoutes,
  },
];

export const restaurantRoutes = [
  {
    path: "/restaurant/home",
    name: "Home",
    icon: <HomeIcon color="inherit"/>,
    component: RestaurantHome,
  },
  {
    path: "/restaurant/menu",
    name: "Menu",
    icon: <OrderIcon color="inherit"/>,
    component: RestaurantMenu,
  },
  {
    path: "/restaurant/map",
    name: "Map",
    icon: <MapIcon color="inherit"/>,
    component: RestaurantMap,
  },
  {
    path: "/restaurant/settings",
    name: "Settings",
    icon: <SettingsIcon color="inherit"/>,
    children: restaurantSettingsRoutes,
  },
]

export const adminRoutes = [
  {
    path: "/admin/dashboard",
    name: "Users",
    icon: <HiUsers/>,
    component: Users,
  },
  {
    path: "/admin/feedback",
    name: "Feedback",
    icon: <BiMessage/>,
    component: Feedback,
  },
  {
    path: "/admin/analytics",
    name: "Analytics",
    icon: <StatsIcon/>,
    component: Analytics,
  },
  {
    path: "/admin/hot-keywords",
    name: "Hot Keywords",
    icon: <BsKeyboard/>,
    component: Keywords,
  },
  {
    path: "/admin/subscriptions",
    name: "Subscriptions",
    icon: <BiMoney/>,
    component: Subscriptions,
  }
]


export default {
  customer: customerRoutes,
  restaurant: restaurantRoutes,
  admin: adminRoutes
}
