import {Button, Flex, FormControl, FormLabel, Image, Input, useToast} from "@chakra-ui/react";
import {useState} from "react";
import {useSelector} from "react-redux";
import {BASE_URL, WEBAPP_URL} from "../../../constants/endpoints";
import {useApi} from "../../../services/fasterDriver";
import CustomerSettingsLayout from "./index";
import {object, string} from 'yup'

const InviteSchema = object().shape({
  email: string().email().required()
})
export default function InviteFriends() {
  const {user} = useSelector(state => state.auth)

  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)

  const api = useApi()
  const toast = useToast()

  const refLink = `${WEBAPP_URL}/signup?ref=${user.id}`
  const sendInvite = () => {
    InviteSchema.validate({
      email
    }).then(result => {
      // window.open(`mailto:${email}?subject=Join Faster Driver&body=Hi, I'm inviting you to join Faster Driver. \n\nFaster Driver is a platform that connects drivers to riders. \nYou can earn money by driving people around. \n\nClick this link to join ${refLink}`, '_blank')
      setPending(true)
      api.sendInviteApi(email)
        .then(({ok}) => {
          toast({
            title: 'Invite sent',
            description: 'Invitation sent successfully',
            status: 'success',
            duration: 3000
          })
          setEmail('')
        })
        .finally(() => setPending(false))

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

  const copyLink = () => {
    navigator.clipboard.writeText(refLink)
      .then(() => {
        toast({
          title: 'Link Copied',
          description: 'Referral link copied to clipboard',
          status: 'success',
          duration: 3000
        })
      })
  }

  return <CustomerSettingsLayout>
    <Flex direction={'column'} w={{base: '90%', md: '50%'}} alignItems={'center'} gap={4}>
      <FormControl>
        <FormLabel>REFERRAL LINK</FormLabel>
        <Flex
          w={'100%'}
        >
          <Input type={'text'} bg={'gray.100'} border={'none'}
                 value={refLink}/>
          <Button
            position={'absolute'}
            right={0}
            bg={'primary.500'}
            color={'white'}
            fontSize={'sm'}
            borderLeftRadius={0}
            onClick={copyLink}
          >Copy</Button>
        </Flex>
      </FormControl>
      <FormControl>
        <FormLabel>EMAIL</FormLabel>
        <Input type={'email'} bg={'gray.100'} border={'none'}
               value={email} onChange={e => setEmail(e.target.value)}/>
      </FormControl>
      <Flex
        mt={20}
        w={'100%'}
        justifyContent={'center'}
      >
        <Button variant={'primary'} bg={'primary.500'} color={'white'} w={'80%'} h={14} fontWeight={400}
                onClick={sendInvite} disabled={pending} isLoading={pending}
        >
          Send Invite
        </Button>
      </Flex>
    </Flex>
  </CustomerSettingsLayout>
}
