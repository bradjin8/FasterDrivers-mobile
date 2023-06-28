import BaseScreen from "components/BaseScreen";
import OrDivider from "components/OrDivider";
import React from "react";
import {Pressable, StyleSheet, View, Image, Share, Linking} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {color, scaleVertical} from "utils";
import {Button, Text} from "../../../components/index";
import SimpleHeader from "../../../components/SimpleHeader";
import {appConfig} from "../../../config/app";
import Images from "../../../theme/Images";
import {Flex, Margin} from "../../../theme/Styles";

const InviteFriends = ({}) => {
  const user = useSelector(state => state.loginReducer.user)

  const inviteLink = `${appConfig.webAppUrl}/signup?ref=${user.id}`

  const shareWith = async (via) => {
    try {
      switch (via) {
        case 'email':
          const result = await Share.share({
            title: 'Please join me on this app',
            url: `${inviteLink}`,
            message: `${inviteLink}`,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
          break
        case 'instagram':
          const appUrl = `instagram://share?text=${inviteLink}`
          if (await Linking.canOpenURL(appUrl)) {
            await Linking.openURL(appUrl)
          } else {
            await Linking.openURL(`https://www.instagram.com/?hl=en`)
          }
          break
        case 'facebook':
          const appUrl2 = `fb://share?text=${inviteLink}`
          if (await Linking.canOpenURL(appUrl2)) {
            await Linking.openURL(appUrl2)
          } else {
            await Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${inviteLink}`)
          }
          break
        case 'messenger':
          const appUrl3 = `fb-messenger://share?text=${inviteLink}`
          if (await Linking.canOpenURL(appUrl3)) {
            await Linking.openURL(appUrl3)
          } else {
            await Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${inviteLink}`)
          }
          break
        default:
          break
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Invite Friends"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={[Margin.v10]}>
          <View style={styles.codeContainer}>
            <Text variant={'strong'}>
              {inviteLink}
            </Text>
            <Button style={styles.copyButton} text={'Copy Link'} fontSize={16}/>
          </View>
        </View>
        <View style={[Margin.v10]}>
          <OrDivider/>
        </View>
        <View style={[Flex.row, Flex.justifyCenter, Margin.v10]}>
          <Text color={'item'} fontSize={16}>Share</Text>
        </View>
        <View style={[Flex.row, Flex.justifyEvenly, Flex.itemsCenter, Margin.v10]}>
          <Pressable onPress={() => shareWith('email')}>
            <Image source={Images.IcMessage} style={styles.shareButton}/>
          </Pressable>
          <Pressable onPress={() => shareWith('instagram')}>
            <Image source={Images.IcInstagram} style={styles.shareButton}/>
          </Pressable>
          <Pressable onPress={() => shareWith('facebook')}>
            <Image source={Images.IcFacebook2} style={styles.shareButton}/>
          </Pressable>
          <Pressable onPress={() => shareWith('messenger')}>
            <Image source={Images.IcMessager} style={styles.shareButton}/>
          </Pressable>
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
  codeContainer: {
    backgroundColor: color.lightGray,
    padding: scaleVertical(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    position: "relative",
    height: scaleVertical(70)
  },
  copyButton: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    height: scaleVertical(70),
    borderRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  shareButton: {
    width: 40,
    height: 40,
  },
})

export default InviteFriends;


