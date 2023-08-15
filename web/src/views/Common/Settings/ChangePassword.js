import {Button, Flex, FormControl, FormLabel, Image, Input, useToast} from "@chakra-ui/react";
import {useState} from "react";
import {useApi} from "../../../services/fasterDriver";
import CustomerSettingsLayout from "./index";
import {object, string} from 'yup'

const ChangePasswordSchema = object().shape({
  password_2: string().required('Please confirm your new password'),
  password_1: string().required('New password is required'),
  current_password: string().required(),
})
export default function ChangePassword() {
  const [current_password, setCurrentPassword] = useState('')
  const [password_1, setPassword1] = useState('')
  const [password_2, setPassword2] = useState('')
  const [pending, setPending] = useState(false)

  const api = useApi()
  const toast = useToast()

  const changePassword = () => {
    ChangePasswordSchema.validate({
      current_password,
      password_1,
      password_2
    }).then(result => {
      console.log('result', result)
      if (password_1 !== password_2) {
        return toast({
          title: 'Invalid data',
          description: 'Passwords do not match',
          status: 'error',
          duration: 3000,
        })
      }

      setPending(true)
      api.changePasswordApi(result)
        .then(({ok, data}) => {
          if (ok) {
            toast({
              title: 'Success',
              description: 'Password updated successfully',
              status: 'success',
              duration: 3000,
            })
          } else {
            toast({
              title: 'Failed',
              description: data?.details?.[0] || 'Password was not updated',
              status: 'warning',
              duration: 3000,
            })
          }
        })
        .finally(() => {
          setPending(false)
        })
    })
      .catch(e => {
        console.log('validation-err', e.message)
        toast({
          title: 'Invalid data',
          description: e.message,
          status: 'warning',
          duration: 3000
        })
      })

  }

  return <CustomerSettingsLayout>
    <Flex direction={'column'} w={{base: '90%', md: '50%'}} alignItems={'center'} gap={4}>
      <FormControl>
        <FormLabel>CURRENT PASSWORD</FormLabel>
        <Input type={'password'} bg={'gray.100'} border={'none'}
               value={current_password} onChange={e => setCurrentPassword(e.target.value)}/>
      </FormControl>
      <FormControl>
        <FormLabel>NEW PASSWORD</FormLabel>
        <Input type={'password'} bg={'gray.100'} border={'none'}
               value={password_1} onChange={e => setPassword1(e.target.value)}/>
      </FormControl>
      <FormControl>
        <FormLabel>CONFIRM PASSWORD</FormLabel>
        <Input type={'password'} bg={'gray.100'} border={'none'}
               value={password_2} onChange={e => setPassword2(e.target.value)}/>
      </FormControl>
      <Flex
        mt={20}
        w={'100%'}
        justifyContent={'center'}
      >
        <Button variant={'primary'} bg={'primary.500'} color={'white'} w={'80%'} h={14} fontWeight={400}
                onClick={changePassword} disabled={pending} isLoading={pending}
        >
          Change Password
        </Button>
      </Flex>
    </Flex>
  </CustomerSettingsLayout>
}
