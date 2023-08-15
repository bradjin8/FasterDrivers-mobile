// Chakra imports
import {Button, Flex, FormControl, FormLabel, Heading, Image, Input, Link, Text, useToast,} from "@chakra-ui/react";
import querystring from "query-string";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useLocation} from "react-router-dom";
import logo from "../../assets/svg/logo.svg";
import {object, string} from "yup";
// Assets
import PatternSignInUp from "../../assets/svg/pattern-sign-in-up.svg";
import {USER_TYPES} from "../../constants/users";
import {setUser} from "../../reducers/auth";
import {emptyCart} from "../../reducers/cart";
import {loginApi} from "../../services/fasterDriver";

const signInSchema = object().shape({
  email: string().email(`Invalid email`).required(`Email is required`),
  password: string().required(`Password is required`),
})

function SignInAsAdmin() {
  const history = useHistory()
  const dispatch = useDispatch()
  const {userId} = useSelector(state => state.cart)

  const [userType] = React.useState(USER_TYPES.ADMIN)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const toast = useToast()

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onLogin()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [email, password])

  const onLogin = () => {
    if (!loading) {
      signInSchema.validate({email, password})
        .then(() => {
          setLoading(true)
          loginApi({email, password})
            .then(({data, ok}) => {
              console.log(data)
              if (ok) {
                if (data?.user?.type === USER_TYPES.ADMIN) {
                  dispatch(setUser(data))
                  dispatch(emptyCart())
                  history.push(`/admin`)
                } else {
                  toast({
                    title: `Error`,
                    description: `You are not an admin`,
                    status: `error`,
                  })
                  setLoading(false)
                }
              } else {
                toast({
                  title: `Error`,
                  description: data?.detail?.[0] || `Something went wrong`,
                  status: `error`,
                })
                setLoading(false)
              }
            })
            .finally(() => {
            })
        })
        .catch((err) => {
          console.log(err)
          toast({
            title: `Error`,
            description: err?.message || `Something went wrong`,
            status: `error`,
          })
        })
    }
  }

  const renderLoginForm = () => {
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
          onChange={(e) => setPassword(e.target.value)}
        />
        <Flex
          justifyContent={'flex-end'}
          mb={'36px'}
        >
          <Text cursor={'pointer'} onClick={() => history.push('/forgot-password')}>
            Forgot Password?
          </Text>
        </Flex>

        <Button
          fontSize='16px'
          type='submit'
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
          Sign In
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
          Admin Panel
        </Heading>
        <Text color={'primary.500'} fontSize={{base: '1rem', md: '1.2rem', lg: '1.4rem', xl: '2rem'}}>
          Please use your credentials to login
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
        {renderLoginForm()}
      </Flex>
    </Flex>
  </Flex>);
}

export default SignInAsAdmin;
