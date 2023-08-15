import {Flex} from "@chakra-ui/react";

export default function SwitchButtons({options, option, setOption}) {
  const percent = 100 / options.length

  return <Flex w={'100%'}
               justifyContent={'space-between'}
  >
    {options.map((item, index) => <Flex
      key={index}
      onClick={() => setOption(item)}
      cursor='pointer'
      w={`${percent}%`}
      h='50px'
      bg={option === item ? 'blue.500' : 'white'}
      color={option === item ? 'white' : 'black'}
      borderWidth={1}
      borderColor={option=== item ? 'blue.500' : 'black'}
      justifyContent='center'
      alignItems='center'

    >
      {item}
    </Flex>)}
  </Flex>
}
