/**
 * @providesModule TeleMedicine.Components.Base.ScrollableTabBar
 */
const React = require('react');
const { ViewPropTypes } = ReactNative = require('react-native');
const {
  View,
  Animated,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  Dimensions,
  I18nManager,
  TouchableOpacity,
} = ReactNative;

const WINDOW_WIDTH = Dimensions.get('window').width;

const ScrollableTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    backgroundColor: React.PropTypes.string,
    activeTextColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    scrollOffset: React.PropTypes.number,
    style: ViewPropTypes.style,
    tabStyle: ViewPropTypes.style,
    tabsContainerStyle: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
    renderTab: React.PropTypes.func,
    underlineStyle: ViewPropTypes.style,
    onScroll: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      scrollOffset: 52,
      activeTextColor: 'navy',
      inactiveTextColor: 'black',
      backgroundColor: null,
      style: {},
      tabStyle: {},
      tabsContainerStyle: {},
      underlineStyle: {},
    };
  },

  getInitialState() {
    this._tabsMeasurements = [];
    return {
      _leftTabUnderline: new Animated.Value(0),
      _widthTabUnderline: new Animated.Value(0),
      _containerWidth: null,
    };
  },

  componentDidMount() {
    this.props.scrollValue.addListener(this.updateView);
  },

  updateView(offset) {
    const position = Math.floor(offset.value);
    const pageOffset = offset.value % 1;
    const tabCount = this.props.tabs.length;
    const lastTabPosition = tabCount - 1;

    if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
      return;
    }

    if (this.necessarilyMeasurementsCompleted(position, position === lastTabPosition)) {
      this.updateTabPanel(position, pageOffset);
      this.updateTabUnderline(position, pageOffset, tabCount);
    }
  },

  necessarilyMeasurementsCompleted(position, isLastTab) {
    return this._tabsMeasurements[position] &&
      (isLastTab || this._tabsMeasurements[position + 1]) &&
      this._tabContainerMeasurements &&
      this._containerMeasurements;
  },

  updateTabPanel(position, pageOffset) {
    const containerWidth = this._containerMeasurements.width;
    const tabWidth = this._tabsMeasurements[position].width;
    const nextTabMeasurements = this._tabsMeasurements[position + 1];
    const nextTabWidth = nextTabMeasurements && nextTabMeasurements.width || 0;
    const tabOffset = this._tabsMeasurements[position].left;
    const absolutePageOffset = pageOffset * tabWidth;
    let newScrollX = tabOffset + absolutePageOffset;

    // center tab and smooth tab change (for when tabWidth changes a lot between two tabs)
    newScrollX -= (containerWidth - (1 - pageOffset) * tabWidth - pageOffset * nextTabWidth) / 2;
    newScrollX = newScrollX >= 0 ? newScrollX : 0;

    if (Platform.OS === 'android') {
      this._scrollView.scrollTo({ x: newScrollX, y: 0, animated: false, });
    } else {
      const rightBoundScroll = this._tabContainerMeasurements.width - (this._containerMeasurements.width);
      newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX;
      this._scrollView.scrollTo({ x: newScrollX, y: 0, animated: false, });
    }

  },

  updateTabUnderline(position, pageOffset, tabCount) {
    const lineLeft = this._tabsMeasurements[position].left;
    const lineRight = this._tabsMeasurements[position].right;

    if (position < tabCount - 1) {
      const nextTabLeft = this._tabsMeasurements[position + 1].left;
      const nextTabRight = this._tabsMeasurements[position + 1].right;

      const newLineLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft);
      const newLineRight = (pageOffset * nextTabRight + (1 - pageOffset) * lineRight);

      this.state._leftTabUnderline.setValue(newLineLeft);
      this.state._widthTabUnderline.setValue(newLineRight - newLineLeft);
    } else {
      this.state._leftTabUnderline.setValue(lineLeft);
      this.state._widthTabUnderline.setValue(lineRight - lineLeft);
    }
  },

  renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler) {
    const tabStyle = isTabActive ? styles.activeTab : styles.tab;
    const tabHeadingStyle = isTabActive ? styles.activeTabHeading : styles.tabHeading;

    return (
      <TouchableOpacity
        key={`${name}_${page}`}
        onPress={() => onPressHandler(page)}
        onLayout={onLayoutHandler}
      >
        <View style={tabStyle}>
          <Text style={tabHeadingStyle}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  measureTab(page, event) {
    const { x, width, height, } = event.nativeEvent.layout;
    this._tabsMeasurements[page] = { left: x, right: x + width, width, height, };
    this.updateView({ value: this.props.scrollValue._value, });
  },

  render() {
    const key = I18nManager.isRTL ? 'right' : 'left';
    const dynamicTabUnderline = {
      [`${key}`]: this.state._leftTabUnderline,
      width: this.state._widthTabUnderline
    }

    return (
      <View
        style={[styles.container, this.props.style,]}
        onLayout={this.onContainerLayout}
      >
        <ScrollView
          automaticallyAdjustContentInsets={false}
          ref={(scrollView) => { this._scrollView = scrollView; }}
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          directionalLockEnabled
          onScroll={this.props.onScroll}
          bounces={false}
          scrollsToTop={false}
        >
          <View
            style={[styles.tabs, { width: this.state._containerWidth, }, this.props.tabsContainerStyle,]}
            ref={'tabContainer'}
            onLayout={this.onTabContainerLayout}
          >
            {this.props.tabs.map((name, page) => {
              const isTabActive = this.props.activeTab === page;
              const renderTab = this.props.renderTab || this.renderTab;
              return renderTab(name, page, isTabActive, this.props.goToPage, this.measureTab.bind(this, page));
            })}
            <Animated.View style={[styles.tabUnderline, dynamicTabUnderline]} />
          </View>
        </ScrollView>
        <Text style={{position:'absolute', top:5, right: 5, color:'white', backgroundColor:'transparent'}}>&#9654;</Text>
      </View>
    );
  },

  componentWillReceiveProps(nextProps) {
    // If the tabs change, force the width of the tabs container to be recalculated
    if (JSON.stringify(this.props.tabs) !== JSON.stringify(nextProps.tabs) && this.state._containerWidth) {
      this.setState({ _containerWidth: null, });
    }
  },

  onTabContainerLayout(e) {
    this._tabContainerMeasurements = e.nativeEvent.layout;
    let width = this._tabContainerMeasurements.width;
    if (width < WINDOW_WIDTH) {
      width = WINDOW_WIDTH;
    }
    this.setState({ _containerWidth: width, });
    this.updateView({ value: this.props.scrollValue._value, });
  },

  onContainerLayout(e) {
    this._containerMeasurements = e.nativeEvent.layout;
    this.updateView({ value: this.props.scrollValue._value, });
  },
});

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingRight:18,
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  tab: {
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
  },

  activeTab: {
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
  },

  tabHeading: {
    fontSize: 15,
    fontWeight: 'normal',
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  activeTabHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    // shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
  },

  tabUnderline: {
    height: 2,
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
});

module.exports = ScrollableTabBar;
