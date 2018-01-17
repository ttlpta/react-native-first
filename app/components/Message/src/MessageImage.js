import PropTypes from 'prop-types';
import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';
import Lightbox from 'react-native-lightbox';

export default class MessageImage extends React.Component {
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Lightbox
          activeProps={{
            style: styles.imageActive,
          }}
          {...this.props.lightboxProps}
        >
          <Image
            {...this.props.imageProps}
            style={[styles.image, this.props.imageStyle]}
            source={{uri: this.props.currentMessage.image}}
          />
          
        </Lightbox>
        <Image
          style={styles.imagePreview}
          source={require('../../../assets/images/preview.png')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: 300,
    height: 165,
    borderRadius: 5,
    // margin: 30,
    resizeMode: 'cover',
  },
  imagePreview: {
    width: 25,
    height: 38,
    position: 'absolute',
    bottom:5,
    right:130,
    // alignItems: 'center',
    resizeMode: 'contain',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
    width: 400,
    height: 200,
  },
});

MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
};

MessageImage.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: PropTypes.object,
  lightboxProps: PropTypes.object,
};
