import {Button, Flex, FormControl, FormLabel, Heading, Image, Input, useToast} from "@chakra-ui/react";
import {useState} from "react";
import {useSelector} from "react-redux";
import {useApi} from "../../../services/fasterDriver";
import SettingsLayout from "../../Common/Settings";

export default function MyAccount() {
  const {user} = useSelector(state => state.auth)
  const api = useApi()
  const toast = useToast()

  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [pending, setPending] = useState(false)

  const save = () => {
    if (name && email) {
      setPending(true)
      api.updateProfileApi({
        name, email,
      })
        .then(({ok, data}) => {
          if (ok) {
            toast({
              title: 'Success',
              description: 'Your profile has been updated',
              status: 'success',
            })
            api.fetchUserApi()
          }
        })
        .finally(() => {
          setPending(false)
        })
    }
  }

  return <SettingsLayout>
    <Flex direction={'column'} w={{base: '90%', md: '60%'}} alignItems={'center'} gap={4}>
      <Heading>My Account</Heading>
      {/*<Flex justifyContent={'center'}>*/}
      {/*  <Image src={profile.photo} w={24} borderRadius={'50%'}/>*/}
      {/*</Flex>*/}
      <FormControl>
        <FormLabel>FULL NAME</FormLabel>
        <Input type={'text'} bg={'gray.100'} border={'none'}
               value={name} onChange={e => setName(e.target.value)}/>
      </FormControl>
      <FormControl>
        <FormLabel>EMAIL</FormLabel>
        <Input type={'email'} bg={'gray.100'} border={'none'}
               value={email} onChange={e => setEmail(e.target.value)}/>
      </FormControl>
      <Flex
        mt={10}
        w={'100%'}
        justifyContent={'center'}
      >
        <Button variant={'primary'} bg={'primary.500'} color={'white'} w={'80%'} h={14} fontWeight={400}
                onClick={save} isLoading={pending}
        >
          Save
        </Button>
      </Flex>
    </Flex>
  </SettingsLayout>
}
