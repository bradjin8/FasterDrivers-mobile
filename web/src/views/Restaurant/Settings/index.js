import {Image} from "@chakra-ui/react";
import React from "react";
import PngIcons from '../../../components/Icons/PngIcons'
import ChangePassword from "../../Common/Settings/ChangePassword";
import DeleteAccount from "../../Common/Settings/DeleteAccount";
import Feedback from "../../Common/Settings/Feedback";
import InviteFriends from "../../Common/Settings/InviteFriends";
import MyWallet from "../../Common/Settings/MyWallet";
import PrivacyPolicy from "../../Common/Settings/PrivacyPolicy";
import StripeConnect from "../../Common/Settings/StripeConnect";
import TermsAndConditions from "../../Common/Settings/TermsAndConditions";
import MyAccount from "./MyAccount";
import MyRestaurant from "./MyRestaurant";
import OrderAcceptance from "./OrderAcceptance";

export const restaurantSettingsRoutes = [
  {
    path: "/restaurant/settings",
    name: "My Account",
    component: MyAccount,
    icon: <Image src={PngIcons.IcAccount} w={4}/>
  },
  {
    path: "/restaurant/settings/my-restaurant",
    name: "My Restaurant",
    component: MyRestaurant,
    icon: <Image src={PngIcons.IcAccount} w={4}/>
  },
  {
    path: "/restaurant/settings/order-acceptance",
    name: "Order Acceptance",
    component: OrderAcceptance,
    icon: <Image src={PngIcons.IcWallet} w={4}/>
  },
  {
    path: "/restaurant/settings/feedback",
    name: "Feedback",
    component: Feedback,
    icon: <Image src={PngIcons.IcPen} w={4}/>
  },
  {
    path: "/restaurant/settings/invite-friends",
    name: "Invite Friends",
    component: InviteFriends,
    icon: <Image src={PngIcons.IcAccountPlus} w={4}/>
  },
  {
    path: "/restaurant/settings/my-wallet",
    name: "My Wallet",
    component: MyWallet,
    icon: <Image src={PngIcons.IcWallet} w={4}/>
  },
  {
    path: "/restaurant/settings/stripe",
    name: "Stripe Payment",
    component: StripeConnect,
    icon: <Image src={PngIcons.IcWallet} w={4}/>
  },
  {
    path: "/restaurant/settings/change-password",
    name: "Change Password",
    index: true,
    component: ChangePassword,
    icon: <Image src={PngIcons.IcKey} w={4}/>
  },
  {
    path: "/restaurant/settings/terms-and-conditions",
    name: "Terms and Conditions",
    component: TermsAndConditions,
    icon: <Image src={PngIcons.IcDocPen} w={4}/>
  },
  {
    path: "/restaurant/settings/privacy-policy",
    name: "Privacy Policy",
    component: PrivacyPolicy,
    icon: <Image src={PngIcons.IcDocCheck} w={4}/>
  },
  {
    path: "/restaurant/settings/delete-account",
    name: "Delete Account",
    component: DeleteAccount,
    icon: <Image src={PngIcons.IcAccountCross} w={4}/>
  },
];
