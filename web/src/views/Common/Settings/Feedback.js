import {Button, Flex, FormControl, FormLabel, Image, Input, Textarea, useToast} from "@chakra-ui/react";
import {useState} from "react";
import {useSelector} from "react-redux";
import {BASE_URL, WEBAPP_URL} from "../../../constants/endpoints";
import {useApi} from "../../../services/fasterDriver";
import CustomerSettingsLayout from "./index";
import {object, string} from 'yup'

const FeedbackSchema = object().shape({
  message: string().required(),
  subject: string().required(),
})
export default function Feedback() {
  const {user} = useSelector(state => state.auth)

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  const api = useApi()
  const toast = useToast()

  const sendFeedback = () => {
    FeedbackSchema.validate({
      subject,
      message
    }).then(result => {
      setPending(true)
      api.sendFeedbackApi(result)
        .then(({ok}) => {
          if (ok) {
            toast({
              title: 'Feedback sent',
              description: 'Your feedback has been sent successfully',
              status: 'success',
              duration: 3000
            })
            setSubject('')
            setMessage('')
          } else {
            toast({
              title: 'Feedback failed',
              description: 'Your feedback failed to send',
              status: 'error',
              duration: 3000
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
    <Flex direction={'column'} w={{base: '90%', md: '60%'}} alignItems={'center'} gap={4}>
      <FormControl>
        <FormLabel>SUBJECT</FormLabel>
        <Flex
          w={'100%'}
        >
          <Input type={'text'} bg={'gray.100'} border={'none'}
                 value={subject} onChange={e => setSubject(e.target.value)}/>
        </Flex>
      </FormControl>
      <FormControl>
        <FormLabel>MESSAGE</FormLabel>
        <Textarea type={'text'} bg={'gray.100'} border={'none'} rows={5}
               value={message} onChange={e => setMessage(e.target.value)}/>
      </FormControl>
      <Flex
        mt={20}
        w={'100%'}
        justifyContent={'center'}
      >
        <Button variant={'primary'} bg={'primary.500'} color={'white'} w={'80%'} h={14} fontWeight={400}
                onClick={sendFeedback} disabled={pending} isLoading={pending}
        >
          Submit
        </Button>
      </Flex>
    </Flex>
  </CustomerSettingsLayout>
}
