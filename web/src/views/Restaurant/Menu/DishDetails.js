import {Button, Flex, Image, Text} from "@chakra-ui/react";
import {BiPencil, BiTrash} from "react-icons/bi";
import {useSelector} from "react-redux";

export default function DishDetails({onEdit, onDelete}) {
  const activeDish = useSelector(state => state.ui.activeDish) || {}

  const {id, name, image_1, image_2, description, price} = activeDish

  if (id)
    return (
      <Flex direction={'column'} boxShadow={'lg'} gap={2} position={'relative'}>
        <Image src={image_1} alt={name} h={'300px'} objectFit={'cover'}/>
        <Flex direction={'column'} gap={2} borderBottomWidth={1} p={4}>
          <Text>{name}</Text>
          <Text>${price}</Text>
          <Text color={'gray.500'} fontWeight={'light'}>{description}</Text>
        </Flex>
        <Flex
          position={'absolute'}
          top={4}
          right={4}
          zIndex={100}
          gap={2}
        >
          <Button
            bg={'green.400'}
            w={'40px'}
            p={0}
            onClick={onEdit}
          >
            <BiPencil/>
          </Button>
          <Button
            bg={'red.400'}
            onClick={onDelete}
            w={'40px'}
            p={0}
          >
            <BiTrash/>
          </Button>
        </Flex>
      </Flex>
    )

  return <Flex></Flex>
}
