import {Avatar, Button, Flex, Heading, Image, Text, Textarea} from "@chakra-ui/react";
import moment from 'moment'
import {useState} from "react";
import {useAdminApi} from "../../../services/fasterDriver";

export default function FeedbackDetails({data}) {
  const {id, subject, message, user, created_at, responded} = data || {}

  const [text, setText] = useState('')
  const [pending, setPending] = useState(false)

  const api = useAdminApi()

  const respond = () => {
    if (!text)
      return

    setPending(true)
    api.respondFeedback({
      feedback: id,
      message: text,
    })
      .then(({ok}) => {
        if (ok) {
          setText('')
        }
      })
      .finally(() => {
        setPending(false)
      })
  }

  if (id)
    return (
      <Flex direction={'column'} boxShadow={'lg'} gap={2} position={'relative'}>
        <Flex p={3} borderBottom={'1px solid'} borderBottomColor={'gray.300'}>
          <Text>{moment.utc(created_at).format('dddd, hh:mm A')}</Text>
        </Flex>
        <Flex p={3} gap={2}>
          <Avatar src={user?.[user?.type?.toLowerCase()]?.photo} alt={''} objectFit={'cover'}/>
          <Flex
            direction={'column'}
            justifyContent={'space-between'}
            >
            <Text fontSize={16} fontWeight={'bold'}>{user?.name}</Text>
            <Text>{user?.email}</Text>
          </Flex>
        </Flex>
        <Flex direction={'column'} gap={3} borderBottomWidth={1} p={4}>
          <Heading fontSize={20}>{subject}</Heading>
          <Text color={'gray.700'}>{message}</Text>
        </Flex>
        {responded ? <>
        </> : <>

          <Flex p={3} gap={2}>
            <Text color={'gray.500'}>Message:</Text>
            <Textarea value={text} onChange={e => setText(e.target.value)}/>
          </Flex>
          <Flex justifyContent={'center'} mb={10}>
            <Button bg={'primary.500'} color={'white'} px={12} borderRadius={10} onClick={respond} isLoading={pending} _hover={{bg: 'primary.600'}}>
              SEND MESSAGE
            </Button>
          </Flex>
        </>}
      </Flex>
    )

  return <Flex></Flex>
}
