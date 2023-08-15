// Chakra imports
import {Button, Flex, FormControl, FormLabel, Heading, Input, Text, useToast,} from "@chakra-ui/react";
import React from "react";
import {useHistory} from "react-router-dom";
import {object, string} from "yup";
// Assets
import {forgotPasswordApi} from "../../services/fasterDriver";

const ForgotSchema = object().shape({
  email: string().email(`Invalid email`).required(`Email is required`),
})

function ForgotPassword() {
  const history = useHistory()
  const toast = useToast()

  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const onLogin = () => {
    if (!loading) {
      ForgotSchema.validate({email})
        .then(() => {
          setLoading(true)
          forgotPasswordApi({email})
            .then(({data, ok}) => {
              if (ok) {
                toast({
                  title: "Password reset link sent",
                  description: "Please check your email for the password reset link.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                })
              } else {
                toast({
                  title: "Error",
                  description: data?.email?.[0] || "Something went wrong. Please try again.",
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
        })
    }
  }

  const renderForm = () => {
    return <Flex
      direction='column'
      w={{sm: "80%", md: "50%", lg: "30%"}}
      rowGap={4}
    >
      <Heading>Forgot Password?</Heading>
      <Text>Enter your email to reset password.</Text>
      <FormControl mt={8}>
        <FormLabel fontSize='sm' fontWeight='normal' htmlFor={'email'} color={'black'}>
          EMAIL
        </FormLabel>
        <Input
          borderRadius='15px'
          mb='24px'
          fontSize='sm'
          type='email'
          placeholder='Your email adress'
          size='lg'
          bg={'gray.200'}
          color={'black'}
          name={'email'}
          id={'email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Request Reset
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

export default ForgotPassword;
