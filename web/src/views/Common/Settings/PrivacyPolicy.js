import {Flex, Heading, Spinner, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import CustomerSettingsLayout from "./index";
import renderHTML from "react-render-html";

export default function PrivacyPolicy() {
  const [content, setContent] = useState('')
  useEffect(() => {
    fetch('https://fancy-cherry-36842-staging.botics.co/api/v1/privacy-policy/')
      .then((res) => res.text())
      .then((data) => {
        setContent(data)
      })
  }, [])

  return <CustomerSettingsLayout>
    <Flex direction='column' gap={4} jusitfyContent={'center'} alignItems={'center'}>
      {content ? renderHTML(content) : <Spinner/>}
    </Flex>
  </CustomerSettingsLayout>
}
