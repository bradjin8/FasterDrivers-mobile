import {UnlockIcon} from "@chakra-ui/icons";
import {MastercardIcon, VisaIcon} from "../components/Icons/Icons";
import {USER_TYPES} from "../constants/users";

export const getCardIcon = (cardBrand) => {
  switch (cardBrand) {
    case 'visa':
      return <VisaIcon fontSize={34}/>
    case 'mastercard':
      return <MastercardIcon fontSize={34}/>
    case 'amex':
      return <MastercardIcon fontSize={34}/>
    default:
      return <UnlockIcon fontSize={34}/>
  }
}

export const getColorByUserType = (userType) => {
  switch (userType) {
    case USER_TYPES.CUSTOMER:
      return 'green.400'
    case USER_TYPES.RESTAURANT:
      return 'blue.400'
    case USER_TYPES.DRIVER:
      return 'yellow.400'
    default:
      return 'gray.400'
  }
}
