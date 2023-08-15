// Chakra imports
import {Button, Flex, FormControl, FormLabel, Heading, Input, Text, useToast,} from "@chakra-ui/react";
import querystring from "query-string";
import React from "react";
import {useHistory, useLocation} from "react-router-dom";
import {object, string} from "yup";
// Assets
import {resetPasswordApi} from "../../services/fasterDriver";

const ForgotSchema = object().shape({
  token: string().required(`Token is required`),
  password_1: string().required(`Password is required`),
  password_2: string().required(`Password is required`),
})

function ResetPassword() {
  const history = useHistory()
  const toast = useToast()

  // get query string's token parameter
  const location = useLocation()
  const queries = querystring.parse(location.search)

  const [token, setEmail] = React.useState(queries?.token)
  const [password_1, setPassword_1] = React.useState('')
  const [password_2, setPassword_2] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const onLogin = () => {
    if (!loading) {
      ForgotSchema.validate({token, password_1, password_2})
        .then(() => {
          if (password_1 !== password_2) {
            return toast({
              title: "Error",
              description: "Passwords do not match.",
              status: "error",
              duration: 5000,
              isClosable: true,
            })
          }

          setLoading(true)
          resetPasswordApi({token, password_1, password_2})
            .then(({data, ok}) => {
              if (ok) {
                toast({
                  title: "Success",
                  description: "Password was reset successfully.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                })
                setTimeout(() => {
                  history.push(`/signin`)
                }, 1000)
              } else {
                toast({
                  title: "Error",
                  description: data?.detail || "Something went wrong. Please try again.",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                })
              }
            })
            .finally(() => {
              setLoading(false)
            })
        })
        .catch((err) => {
          console.log(err)
          toast({
            title: "Error",
            description: err.message || "Something went wrong. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        })
    }
  }

  const renderForm = () => {
    return <Flex
      direction='column'
      w={{sm: "80%", md: "50%", lg: "30%"}}
      rowGap={4}
    >
      <Heading>Reset Password</Heading>
      <Text>Create New Password.</Text>
      <FormControl mt={8}>
        <FormLabel fontSize='sm' fontWeight='normal' htmlFor={'password_1'} color={'black'}>
          NEW PASSWORD
        </FormLabel>
        <Input
          borderRadius='15px'
          mb='24px'
          fontSize='sm'
          type='password'
          placeholder='At least 5 characters'
          size='lg'
          bg={'gray.200'}
          color={'black'}
          name={'password_1'}
          id={'password_1'}
          value={password_1}
          onChange={(e) => setPassword_1(e.target.value)}
        />
        <FormLabel fontSize='sm' fontWeight='normal' htmlFor={'password_2'} color={'black'}>
          REPEAT PASSWORD
        </FormLabel>
        <Input
          borderRadius='15px'
          mb='24px'
          fontSize='sm'
          type='password'
          placeholder='At least 5 characters'
          size='lg'
          bg={'gray.200'}
          color={'black'}
          name={'password_2'}
          id={'password_2'}
          value={password_2}
          onChange={(e) => setPassword_2(e.target.value)}
        />
        <Button
          fontSize='16px'
          type='submit'
          variant={'outline'}
          bg={'white'}
          w='100%'
          fontFamily={'Lato'}
          h='70px'
          mb='40px'
          color='primary.500'
          _hover={{
            bg: 'primary.600', color: 'white'
          }}
          mt='20px'
          onClick={onLogin}
          disabled={loading}
        >
          Reset Password
        </Button>
      </FormControl>
    </Flex>
  }

  return (<Flex bg={'white'} color={'primary.500'}>
    <Flex
      h={{sm: "50vh", md: "60vh", lg: "70vh"}}
      w='100%'
      mx='auto'
      justifyContent='center'
      alignItems={'center'}
    >
      {renderForm()}
    </Flex>
  </Flex>);
}

export default ResetPassword;
