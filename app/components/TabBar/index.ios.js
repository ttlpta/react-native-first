/**
 * @providesModule TeleMedicine.Components.Base.TabBar
 */

const React = require('react');
const { ViewPropTypes } = ReactNative = require('react-native');
const {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} = ReactNative;


/**
 * A customized tab bar used in this app.
 * TODO: Need to provide more customizable to users.
 */
const TabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    backgroundColor: React.PropTypes.string,
    activeTextColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: ViewPropTypes.style,
    renderTab: React.PropTypes.func,
    underlineStyle: ViewPropTypes.style,
  },

  getDefaultProps() {
    return {};
  },

  renderTabOption(name, page) {
  },

  renderTab(name, page, isTabActive, onPressHandler) {
    const tabStyle = isTabActive ? styles.activeTab : styles.tab;
    const tabHeadingStyle = isTabActive ? styles.activeTabHeading : styles.tabHeading;

    return (
      <TouchableOpacity
        style={styles.flexOne}
        key={page}
        onPress={() => onPressHandler(page)}
      >
        <View style={tabStyle}>
          <Text style={tabHeadingStyle}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabWidth = containerWidth / numberOfTabs;

    const tabUnderlineStyle = {
      ...styles.tabUnderline,
      width: tabWidth,
    };

    const left = {
      transform: [{
        translateX: this.props.scrollValue.interpolate({
          inputRange: [0, 1,],
          outputRange: [0, tabWidth],
        })
      }]
    };

    return (
      <View style={[styles.tabs, this.props.style]}>
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
        <Animated.View style={[tabUnderlineStyle, left]} />
      </View>
    );
  },
});

const styles = {
  flexOne: {
    flex: 1,
  },

  tabs: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 7,
  },

  activeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 7,
  },

  tabHeading: {
    fontSize: 18,
    backgroundColor: 'transparent', 
    color: '#fff',
    fontFamily: 'Roboto',
    fontWeight: '200', 
  },

  activeTabHeading: {
    fontSize: 18,
    backgroundColor: 'transparent', 
    color: '#fff',
    fontFamily: 'Roboto',
    shadowColor: '#6FCF97',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    fontWeight: '200',
  },

  tabUnderline: {
    height: 1,
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    // shadow
    shadowOffset: { width: -1, height: -1 },
    shadowRadius: 3,
    shadowOpacity: 1.0,
    shadowColor: 'rgb(0, 255, 0)',
    elevation: 3, // Android only
  },
};

module.exports = TabBar;
