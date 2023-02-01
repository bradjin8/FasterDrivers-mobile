import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = size => (width / guidelineBaseWidth) * size;
export const scaleVertical = size => (height / guidelineBaseHeight) * size;
