import {Flex, Spinner} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import renderHTML from "react-render-html";

export default function TermsAndConditions() {
  const [content, setContent] = useState('')

  useEffect(() => {
    fetch('https://fancy-cherry-36842-staging.botics.co/api/v1/privacy-policy/')
      .then((res) => res.text())
      .then((data) => {
        setContent(data)
      })
  }, [])

  return <Flex bg={'white'} justifyContent={'center'} w={'100%'} p={10}>
    <Flex direction='column' gap={4} jusitfyContent={'center'} alignItems={'center'}>
      {content ? renderHTML(content) : <Spinner/>}
    </Flex>
  </Flex>
}
