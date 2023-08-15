import {
  Avatar,
  Badge,
  Button,
  Flex, Skeleton,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, {useState} from "react";
import {USER_TYPES} from "../../../constants/users";
import {getColorByUserType} from "../../../utils/ui";

function UsersRow(props) {
  const {photo, phone, name, email, type, onDelete, onSuspend, loading} = props;
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Tr>
      <Td w={{sm: "50px"}} pl="0px">
        <Skeleton isLoaded={!loading}>
          <Flex align="center" py=".2rem" minWidth="100%" flexWrap="nowrap">
            <Avatar src={photo} w="50px" borderRadius="12px"/>
          </Flex>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!loading}>
          <Text
            fontSize="sm"
            color={textColor}
            fontWeight="bold"
          >
            {name}
          </Text>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!loading}>
          <Text fontSize="sm" color={textColor} fontWeight="normal">
            {email}
          </Text>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!loading}>
          <Badge
            bg={getColorByUserType(type)}
            color={'white'}
            fontSize="12px"
            p="3px 10px"
            borderRadius="8px"
          >
            {type}
          </Badge>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!loading}>
          <Text fontSize="sm" color={textColor} fontWeight="normal">
            {phone}
          </Text>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!loading}>
          <Flex gap={1} justifyContent={'center'}>
            <Button p={4} borderRadius={6} bg={'red.500'} _hover={{bg: 'red.400'}} onClick={onSuspend}>
              <Text
                fontSize="sm"
                color={'white'}
              >
                SUSPEND
              </Text>
            </Button>
            <Button p={4} borderRadius={6} borderWidth={2} borderColor={'black'} bg="transparent" variant="outline" onClick={onDelete}>
              <Text
                fontSize="sm"
              >
                DELETE
              </Text>
            </Button>
          </Flex>
        </Skeleton>
      </Td>
    </Tr>
  );
}

export default UsersRow;
