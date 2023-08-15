import {Button, Flex, Heading, Text, useToast} from "@chakra-ui/react";
import {useState} from "react";
import {useDispatch} from "react-redux";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import {logout} from "../../../reducers/auth";
import {useApi} from "../../../services/fasterDriver";
import CustomerSettingsLayout from "./index";

export default function DeleteAccount() {
  const [isOpen, setIsOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const api = useApi()
  const toast = useToast()
  const dispatch = useDispatch()
  const deleteAccount = () => {
    setPending(true)
    api.deleteAccountApi()
      .then(({ok}) => {
        if (ok) {
          toast({
            title: 'Account deleted',
            description: 'Your account has been deleted successfully',
            status: 'success',
            duration: 3000
          })
          dispatch(logout())
        } else {
          toast({
            title: 'Account deletion failed',
            description: 'Your account failed to delete',
            status: 'error',
            duration: 3000
          })
        }
      })
  }

  return <CustomerSettingsLayout>
    <Flex direction={'column'} w={{base: '90%', md: '50%'}} h={'50%'} alignItems={'center'} justifyContent='center' gap={4}>
      <Button bg={'red.500'} color={'white'} fontSize={'sm'} h={14} onClick={() => {
        setIsOpen(true)
      }}>Delete My Account</Button>
    </Flex>
    <ConfirmDialog isOpen={isOpen} title={'Delete Account'} message={'Are you sure you want to delete your account?'}
                   onClose={() => {
                     setIsOpen(false)
                   }} onOk={deleteAccount}/>
  </CustomerSettingsLayout>
}
