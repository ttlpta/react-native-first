import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Animated
} from 'react-native';

export const DoneButton = ({
  styles, onDoneBtnClick, onNextBtnClick,
  rightTextColor, isDoneBtnShow,
  doneBtnLabel, nextBtnLabel,
  doneFadeOpacity, skipFadeOpacity, nextOpacity
}) => {
  return (
    <View style={styles.btnContainer}>
      
      <Animated.View style={[styles.full, { height: 0 }]}>
        <TouchableOpacity style={styles.full}
          onPress={ isDoneBtnShow ? onDoneBtnClick : onNextBtnClick}>
            <Text style={[styles.controllText, {
              color: rightTextColor, paddingRight: 0,
            }]}>
              {doneBtnLabel} 
            </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default DoneButton
        