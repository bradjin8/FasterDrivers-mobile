import {Flex, Grid, GridItem} from "@chakra-ui/react";
import {useState} from "react";
import {useDispatch} from "react-redux";
import FeedbackDetails from "./FeedbackDetails";
import FeedbackList from "./FeedbackList";

export default function Feedback () {
  const dispatch = useDispatch()
  const [activeFeedback, setActiveFeedback] = useState(null)

  return (
    <Flex flexDirection='column' pt={{base: "120px", md: "75px"}}>
      <Grid
        templateColumns={{md: "1fr", lg: "2fr 3fr"}}
        gridGap={6}
        // bg={'gray.100'}
      >
        <GridItem>
          <FeedbackList activeItem={activeFeedback} setActiveItem={setActiveFeedback}/>
        </GridItem>
        <GridItem>
          <FeedbackDetails data={activeFeedback}/>
        </GridItem>
      </Grid>
    </Flex>
  )
}
