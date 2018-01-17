import React from 'react';
import { Image, View , StyleSheet, TextInput, TouchableHighlight, TouchableOpacity } from 'react-native';
import I18n from 'react-native-i18n';
import LinearGradient from 'react-native-linear-gradient';
import withConnect from './withConnect';
import { ICON_MENU, ICON_SEARCH } from '../../constants/'

class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      onFocus: false,
    };
  }

  onFocus = () => {
    this.setState({ onFocus: true });
  }

  onBlur = () => {
    this.setState({ onFocus: false });
  }
  
  onChangeSearchTxt = (text) => {
    this.setState({ ...this.state, searchTxt: text });
  }

  onOpenFilter = () => {
    this.props.onOpenFilter();
  }

  render() {
    const { onSearch } = this.props;

    return (
      <View style={styles.container} >
        <TouchableOpacity style={styles.menu} onPress={() => this.props.navigation.navigate('DrawerOpen')}>
          <Image source={ICON_MENU} style={styles.menuImage} />
        </TouchableOpacity>
        <LinearGradient 
          colors={['rgba(27, 91, 5, 0.9)' , 'rgba(64, 219, 23, 0.7)',]} 
          end={{ x: 1, y: 1.0 }} 
          locations={[0,1]}  
          start={{ x: 0.0, y: 1 }} 
          style={styles.linearGradient} 
        >
          <TextInput
            blurOnSubmit
            placeholder={I18n.t('lvSearchScreen.searchPH'  )}
            placeholderTextColor="#fff"
            selectionColor="white"
            style={(this.state.onFocus) ? [styles.textInput, styles.focusRootContainer] : styles.textInput}
            underlineColorAndroid="transparent"
            autoFocus
            value={this.state.searchTxt}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onChangeText={(text) => this.onChangeSearchTxt(text)}
            onSubmitEditing={() => onSearch(this.state.searchTxt)}
          />
          {/* <TouchableOpacity style={styles.search} onPress={() => onSearch(this.state.searchTxt)}> */}
          <TouchableOpacity style={styles.search} onPress={this.onOpenFilter}>
            <Image
              style={styles.searchIcon}
              source={ICON_SEARCH}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute', 
    top: 28,
    flexDirection: 'row',
  },
  focusRootContainer: {
    // shadow
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 1,
    shadowColor: 'rgb(0, 255, 0)',
  },
  linearGradient: {
    flex: 6,
    marginHorizontal: 5,
    alignSelf: 'stretch',
    borderColor: 'rgba(62, 199, 25, 0.9)',
    borderRadius: 22.5,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row'
    // height: 40, 
  },
  textInput: {
    flex: 5,
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    height: 40,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  search: {
    flex: 1,
    position: 'absolute',
    top: 9,
    right: 9
  },
  searchIcon: {
    width: 25,
    height: 25
  },
  menu : {
    flex: 1, 
  },
  menuImage : {
    width: 26,
    height: 25,
    position: 'relative',
    top: 10,
    left: 10
  },
});

export default withConnect(SearchBar);
