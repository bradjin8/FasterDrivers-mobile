// Chakra imports
import {Button, Flex, FormControl, FormLabel, Heading, Image, Input, Text, useToast,} from "@chakra-ui/react";
import querystring from "query-string";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useHistory, useLocation} from "react-router-dom";
import {object, string} from "yup";
import logo from "../../assets/svg/logo.svg";
// Assets
import PatternSignInUp from "../../assets/svg/pattern-sign-in-up.svg";
import {USER_TYPES} from "../../constants/users";
import {setUser} from "../../reducers/auth";
import {emptyCart} from "../../reducers/cart";
import {signupApi} from "../../services/fasterDriver";

const SignUpSchema = object().shape({
  email: string().email(`Invalid email`).required(`Email is required`),
  password: string().required(`Password is required`),
  passwordConfirm: string().required(`Type your password again`),
  type: string().required(`Type is required`),
})

function SignUp() {
  const location = useLocation()
  const queries = querystring.parse(location.search)
  const history = useHistory()
  const dispatch = useDispatch()

  const [type, setType] = React.useState(queries.userType || USER_TYPES.NONE)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirm, setPasswordConfirm] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState({})


  const showLoginForm = [USER_TYPES.CUSTOMER, USER_TYPES.RESTAURANT].includes(type)
  const toast = useToast()

  useEffect(() => {
    setErrors({})
  }, [email, type, password, passwordConfirm])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onSignup()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [email, password, passwordConfirm])

  const onSignup = () => {
    if (!loading) {

      SignUpSchema.validate({email, password, passwordConfirm, type})
        .then(() => {
          if (password !== passwordConfirm) {
            console.log('Passwords do not match')
            toast({
              title: "Error",
              description: "Passwords do not match",
              status: "error",
              duration: 5000,
              isClosable: true,
            })
            return
          }
          setLoading(true)
          signupApi({email, password, type})
            .then(({data, ok}) => {
              if (ok) {
                dispatch(setUser(data))
                dispatch(emptyCart())
              } else {
                setErrors(data)
                toast({
                  title: "Error",
                  description: data?.email?.[0] || data?.password?.[0] || "An error occurred.",
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
            description: "An error occurred.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        })
    }
  }
  const changeUserType = (_type) => {
    setType(_type)
    history.push(`/signup?userType=${_type}`)
  }
  const renderUserTypeButtons = () => {
    return <Flex
      direction='column'
      w='100%'
      background={'transparent'}
      p='48px'
      mt={{md: "150px", lg: "80px"}}>
      <Heading fontSize={{base: '1.4rem', md: '1.2rem'}} textAlign={'center'} mb={4}>
        Choose the account type you want to sign up.
      </Heading>
      {[USER_TYPES.RESTAURANT, USER_TYPES.CUSTOMER].map((it, id) => (<Button
        fontSize='16px'
        fontFamily={'Lato'}
        bg={'white'}
        color={'black'}
        w='100%'
        h='70px'
        mb='20px'
        mt='20px'
        _hover={{
          bg: 'primary.600', color: 'white'
        }}
        textTransform={'capitalize'}
        key={id}
        onClick={() => changeUserType(it)}>
        {it}
      </Button>))}
    </Flex>
  }

  const renderSignUpForm = () => {
    return <Flex
      direction='column'
      w='100%'
      background={'transparent'}
      p='48px'
      mt={{md: "150px", lg: "80px"}}>
      <FormControl>
        <FormLabel fontSize='sm' fontWeight='normal' htmlFor={'email'}>
          EMAIL
        </FormLabel>
        <Input
          borderRadius='15px'
          mb='24px'
          fontSize='sm'
          type='email'
          placeholder='Your email adress'
          size='lg'
          bg={'white'}
          color={'black'}
          name={'email'}
          id={'email'}
          value={email}
          isInvalid={errors?.email !== undefined}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormLabel fontSize='sm' fontWeight='normal' htmlFor={'password'}>
          PASSWORD
        </FormLabel>
        <Input
          borderRadius='15px'
          mb='12px'
          bg={'white'}
          color={'black'}
          fontSize='sm'
          type='password'
          placeholder='Your password'
          size='lg'
          name={'password'}
          id={'password'}
          value={password}
          isInvalid={errors?.password !== undefined}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormLabel fontSize='sm' fontWeight='normal' htmlFor={'passwordConfirm'}>
          REPEAT PASSWORD
        </FormLabel>
        <Input
          borderRadius='15px'
          mb='12px'
          bg={'white'}
          color={'black'}
          fontSize='sm'
          type='password'
          placeholder='Your password'
          size='lg'
          name={'passwordConfirm'}
          id={'passwordConfirm'}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <Button
          fontSize='16px'
          type='submit'
          bg={'white'}
          w='100%'
          fontFamily={'Lato'}
          h='70px'
          mb='20px'
          color='primary.500'
          _hover={{
            bg: 'primary.600', color: 'white'
          }}
          mt='40px'
          onClick={onSignup}
          disabled={loading}
        >
          Sign Up
        </Button>
      </FormControl>
    </Flex>
  }

  return (<Flex bg={'primary.500'} color={'white'}>
    <Flex
      h={{sm: "initial", md: "90vh", lg: "100vh"}}
      w='100%'
      mx='auto'
      justifyContent='space-between'
      flexDir={{base: "column", md: "row"}}
      position={'relative'}
      overflow={'hidden'}
    >
      <Image
        src={PatternSignInUp} alt='Pattern Sign In Up'
        position={'absolute'}
        top={0}
        left={0}
        bottom={0}
        h={'144%'}
        // width={'120%'}
        opacity={0.9}
        objectFit={'fill'}
        display={{base: "none", md: "block"}}
      />
      <Flex
        w={{
          base: "100%", md: '46%', lg: '40%'
        }}
        position={'relative'}
        px={{base: "24px", md: "64px"}}
        py={{base: "10px", md: "64px"}}
        // justifyContent={'center'}
        // alignItems={'center'}
        flexDir={'column'}
        rowGap={8}
        bg={{
          base: 'rgba(255,255,255,0.9)', md: 'transparent'
        }}
      >
        <Flex justifyContent={{
          base: 'flex-start', md: 'center'
        }}>
          <Image src={logo} w={{base: '120px', md: '320px'}} h={{base: '64px', md: '170px'}}/>
        </Flex>
        <Heading fontSize={{base: '2.5rem', md: '2.7rem', lg: '2.9rem', xl: '4rem'}} color={'primary.500'}>
          Please sign up to join our system
        </Heading>
        <Text color={'primary.500'} fontSize={{base: '1rem', md: '1.2rem', lg: '1.4rem', xl: '2rem'}}>
          or log in to your account.
        </Text>
      </Flex>
      <Flex
        alignItems='center'
        justifyContent='start'
        style={{userSelect: "none"}}
        w={{base: "100%", md: "40%"}}
        pr={{
          base: "0px", lg: "24px", xl: "200px",
        }}
      >
        {showLoginForm ? renderSignUpForm() : renderUserTypeButtons()}
      </Flex>
    </Flex>
  </Flex>);
}

export default SignUp;
