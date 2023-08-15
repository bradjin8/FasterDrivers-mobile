import {Button, Flex, Spinner, Text} from "@chakra-ui/react";
import moment from "moment";
import {useEffect, useState} from "react";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import {useAdminApi} from "../../../services/fasterDriver";
import AddKeywordDrawer from "./AddKeywordDrawer";

export default function Keywords() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeItem, setActiveItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const api = useAdminApi()

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = () => {
    setLoading(true)
    api.getHotKeywords()
      .then(({data, ok}) => {
        if (ok) {
          console.log('data', data)
          setData(data.sort((a, b) => moment(b.created_at).unix() - moment(a.created_at).unix()))
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const deleteItem = () => {
    if (!deleteId) return

    setDeleteId(null)
    api.deleteHotKeyword(deleteId)
      .then(({ok}) => {
        if (ok) {
          fetchData()
        }
      })
  }

  return (
    <Flex flexDirection='column' pt={{base: "120px", md: "75px"}} gap={2}>
      <Flex>
        <Button bg={'primary.500'} color={'white'} px={12} borderRadius={12} onClick={() => setActiveItem({})}>
          Add New
        </Button>
      </Flex>
      <Flex direction={'column'} gap={1}>
        <Flex
          justifyContent={'space-between'} h={12}
          alignItems={'center'}
          px={8}
          bg={'primary.500'}
          color={'white'}
          borderRadius={10}
        >
          <Text>Hot Keywords</Text>
          <Text>Action</Text>
        </Flex>
        {loading && <Flex justifyContent={'center'}>
          <Spinner/>
        </Flex>}
        {data.map((item, id) => {
          return <Flex
            key={id}
            justifyContent={'space-between'} h={14}
            alignItems={'center'}
            px={4}
            bg={'white'}
            boxShadow={'md'}
            borderRadius={10}
          >
            <Flex alignItems={'center'} gap={4}>
              {item.name}
            </Flex>
            <Flex gap={2}>
              <Button bg={'green.500'} color={'white'} px={4} borderRadius={12} onClick={() => setActiveItem(item)}>
                Edit
              </Button>
              <Button bg={'red.500'} color={'white'} px={4} borderRadius={12} onClick={() => setDeleteId(item.id)}>
                Delete
              </Button>
            </Flex>
          </Flex>
        })}
      </Flex>
      <AddKeywordDrawer data={activeItem} onFinish={() => {
        fetchData()
        setActiveItem(null)
      }}/>
      <ConfirmDialog
        isOpen={deleteId != null}
        title={'Delete Hot Keyword'}
        message={'Are you sure you want to delete this hot keyword?'}
        onClose={() => setDeleteId(null)}
        onOk={deleteItem}
      />
    </Flex>
  )
}
