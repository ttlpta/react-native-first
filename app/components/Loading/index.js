import React from 'react';
import { StyleSheet , View, Dimensions } from 'react-native';
import Spinner from 'react-native-spinkit';

export default class Loading extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { isVisible } = this.props;
    return (
      isVisible && 
      <View style={styles.container}>
        <Spinner style={styles.spinner} size={100} type={'Bounce'} color={'#fff'} />
      </View>
    );
  }
}
Loading.defaultProps = {
  isVisible : false
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  spinner: {
    marginBottom: 50
  },
})


