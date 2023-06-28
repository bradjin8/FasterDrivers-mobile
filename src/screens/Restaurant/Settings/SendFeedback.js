import BaseScreen from "components/BaseScreen";
import React, {useState} from "react";
import {StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {color, scaleVertical} from "utils";
import {Button, CustomTextInput, Text} from "../../../components/index";
import SimpleHeader from "../../../components/SimpleHeader";
import {sendFeedbackRequest} from "../../../screenRedux/loginRedux";

const SendFeedback = ({}) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.loginReducer.user)
  const loading = useSelector(state => state.loginReducer.loading)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const onSignIn = () => {
    if(title && content) {
      let data = new FormData();
      data.append('subject', title);
      data.append('message', content);
      dispatch(sendFeedbackRequest(data))
    }
  }

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Send Feedback"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <Text variant="text" color="black" style={styles.inputTitle}>
            Title
          </Text>
          <CustomTextInput
            value={title}
            placeholder="Feedback Subject"
            onChangeText={(text) => setTitle(text)}
            errorMessage={"Enter valid subject"}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            Message Content
          </Text>
          <CustomTextInput
            value={content}
            placeholder="Message Content"
            onChangeText={(text) => setContent(text)}
            multiline={true}
            style={{textAlignVertical: 'top'}}
            errorMessage={"Enter valid message content"}
          />
        </View>
        <View style={styles.buttonView}>
          <Button loading={loading} text='Send Feedback' fontSize={16} onPress={onSignIn} />
        </View>
      </View>
    </BaseScreen>
  )
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white, padding: scaleVertical(25)},
  inputTitle: {
    marginTop: scaleVertical(7.5)
  },
  buttonView: {
    width: '100%',
    paddingTop: scaleVertical(50)
  }
})

export default SendFeedback;


