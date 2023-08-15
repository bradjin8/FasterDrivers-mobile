// Chakra imports
import {Box, Flex, Skeleton, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {CiInstagram} from "react-icons/ci";
import {useSelector} from "react-redux";
import Card from "../../../components/Card/Card";
import CardBody from "../../../components/Card/CardBody";
import CardHeader from "../../../components/Card/CardHeader";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import {useAdminApi} from "../../../services/fasterDriver";
import UsersRow from "./UsersRow";
import UsersTable from "./UsersTable";



function Users() {
  const textColor = useColorModeValue("gray.700", "white");
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const api = useAdminApi()

  useEffect(() => {
    fetchUsers()
  }, [])
  const fetchUsers = () => {
    setLoading(true)
    api.getUsers()
      .then(({ok, data}) => {
        if (ok) {
          setData(data)
        }
      })
      .finally(() => setLoading(false))
  }

  return (
    <Flex direction='column' pt={{base: "120px", md: "75px"}}>
      <Card overflowX={{sm: "scroll", xl: "hidden"}}>
        <CardHeader p='6px 0px 22px 0px'>
          <Text fontSize='xl' color={textColor} fontWeight='bold'>
            Users
          </Text>
        </CardHeader>
        <CardBody w={'100%'}>
          <UsersTable data={data} loading={loading} updateData={fetchUsers}/>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default Users;
