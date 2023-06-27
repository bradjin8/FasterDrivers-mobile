import {navigate} from "navigation/NavigationService";
import React, {useRef, useState} from "react";
import {Image, StyleSheet, View} from "react-native";
import Carousel, {Pagination} from "react-native-snap-carousel";
import {Images} from "src/theme";
import {color, scale, scaleVertical, screenHeight, screenWidth} from "utils";
import {Button} from "../../components/index";

const SliderScreen = ({}) => {
  const carouselRef = useRef(null);
  const [index, setIndex] = useState(0);

  const renderCarouselItem = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <Image
          source={Images.AppLogo}
          style={styles.icon}
          resizeMode={'contain'}
        />
      </View>
    );
  };

  const renderMultipleMedia = () => {
    return (
      <Carousel
        layout="default"
        // layoutCardOffset={9}
        // ref={carouselRef}
        data={[{}, {}, {}]}
        renderItem={() => renderCarouselItem()}
        sliderWidth={screenWidth-50}
        itemWidth={screenWidth-50}
        // inactiveSlideShift={0}
        // useScrollView={true}
        onSnapToItem={index => setIndex(index)}
      />
    );
  };
  const renderDots = () => (
    <Pagination
      dotsLength={3}
      activeDotIndex={index}
      carouselRef={carouselRef}
      dotStyle={styles.dotStyle}
      inactiveDotOpacity={0.4}
      inactiveDotScale={0.6}
      tappableDots={true}
      containerStyle={styles.dotContainer}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.imageContain}>
        {renderMultipleMedia()}
        {renderDots()}
      </View>
      <View style={{ width: "100%" }}>
        <Button text="Get Started" fontSize={16} onPress={() => navigate("UserSelection")} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    justifyContent: "space-between",
    alignItems: "center",
    padding: scaleVertical(25),
    paddingVertical: scaleVertical(50),
  },
  imageContain: {
    height: screenHeight- 300,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dotStyle: {
    width: scale(24),
    height: scale(3),
    backgroundColor: color.dotColor,
  },
  dotContainer: {
    alignSelf: "flex-start",
    paddingVertical: 0
  },
  icon: {
    width: scale(294),
    height: scaleVertical(168),
  },
});

export default SliderScreen;
