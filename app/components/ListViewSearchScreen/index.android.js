/**
 * @providesModule TeleMedicine.Components.Screens.ListViewSearch
 */

/* eslint no-unused-vars: 0 */
import React from 'react';
import I18n from 'react-native-i18n';
import {
  View, Dimensions, Text, Image, TouchableOpacity,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import LeftCenterRight from 'app/components/LeftCenterRight';
import SearchBar from 'app/components/SearchBar';
import TabBar from 'app/components/TabBar';
import ClinicDoctorList from 'app/components/ClinicDoctorList';
import DoctorInfoItem from 'app/components/DoctorInfoItem';
import AdvanceSearchModal from 'app/components/AdvanceSearch';
import Loading from 'app/components/Loading';

import { BG_IMAGE, ICON_MENU, ICON_MAP_VIEW_NAV } from 'app/constants';
import withConnect from './withConnect';

/**
 * Clinic and Doctor search screen in list view.
 */
class ListViewSearch extends React.PureComponent {
  static navigationOptions = {
    tabBarVisible: false,
  }
  
  constructor(props) {
    super(props);
    this.state = {
      searchText: this.props.searchText,
      openFilterModal: false,
      isVisibleLoading : false
    };
    this._tabRefs = {
      root: null,
      mix: null,
      doctor: null,
      clinic: null,
    };
  }

  componentWillMount() {
    this.props.getListDoctor();
    this.props.getListClinic();
  }

  /// Getters ///

  get allTabs() {
    return [this._tabRefs.mix, this._tabRefs.doctor, this._tabRefs.clinic];
  }

  get activeTabIndex() {
    return this._tabRefs.root.state.currentPage;
  }

  get activeTab() {
    return this.allTabs[this.activeTabIndex];
  }

  /// Events ///

  onMenu = () => {
    this.props.navigation.navigate('DrawerOpen');
  }

  onNavigateMapView = () => {
    this.props.navigation.navigate('MapView');
  }

  onSearch = text => {
    this.setState({ searchText: text }, this.doSearch);
  }

  onChangeResultTab = info => {
    // if (info.i != info.from) {
    //   this.doSearch();
    // }
  }

  onClickItem = ref => {
    const { navigate } = this.props.navigation;

    if (ref instanceof DoctorInfoItem) {
      navigate('DetailDoctor',
        {
          doctor_id: ref.data.doctor_id,
          doctor_name: ref.data.doctor_name,
          speciality: ref.speciality,
          price_list: ref.price_list,
          description: ref.description,
          avatar_url: ref.avatar_url,
        }
      );
    } else {
      navigate('DetailClinic',
        {
          clinic_id: ref.clinic_id,
          clinic_name: ref.clinic_name,
          description: ref.description,
          image_url: ref.image_url,
          address: ref.address,
        }
      );
    }
  }

  onChangeItemFavorite = (ref, onChangeDone) => {
    const { favorite } = ref.state.data;
    onChangeDone(!favorite);
  }

  onFetchData = (ref, onFetchDone) => {
    const { searchText } = this.state;
    const dataSize = ref.dataSize;

    if (searchText && searchText.length > 0) {
      const result = this.props.listDoctor;
      onFetchDone(result, 3);
    } else {
      onFetchDone(this.props.listDoctor, 10);
    }
  }

  /// Functions ///

  clearAllData = () => {
    this.allTabs.forEach(item => {
      if (item) {
        item.onClearData();
        // Enable fetching data
        item.shouldFetchData = true;
      }
    });
  }

  doSearch = (text = null) => {
    // this.clearAllData();
    const searchText = text || this.state.searchText;

    // if (searchText && searchText.length > 0) {
      this.activeTab.onFetchData();
    // }
  }

  onOpenFilter = () => {
    this.setState({...this.state, openFilterModal : true});
  }

  onCloseFilter = () => {
    this.setState({...this.state, openFilterModal : false});
  }
  /// Header View ///

  renderHeader() {
    return (
      <LeftCenterRight
        style={styles.headerContainer}
        left={this.renderMenu()}
        body={
          <SearchBar
            placeholder={I18n.t('lvSearchScreen.searchPH')}
            onOpenFilter={this.onOpenFilter}
            onSearch={this.onSearch}
          />}
      />
    );
  }

  renderMenu() {
    return (
      <TouchableOpacity onPress={this.onMenu}>
        <Image style={styles.menuIcon} source={ICON_MENU} />
      </TouchableOpacity>
    );
  }

  /// Body View ///

  renderBody() {
    const tabsData = [{
      heading: I18n.t('lvSearchScreen.heading1'),
      dataType: 'mix',
    }, {
      heading: I18n.t('lvSearchScreen.heading2'),
      dataType: 'doctor',
    }, {
      heading: I18n.t('lvSearchScreen.heading3'),
      dataType: 'clinic',
    }];
    return (
      <View style={styles.bodyContainer}>
        <ScrollableTabView
          renderTabBar={() => <TabBar />}
          ref={item => this._tabRefs.root = item}
          style={styles.tabsContainer}
          onChangeTab={this.onChangeResultTab}
          initialPage={1}
          tabBarPosition="top"
          locked
        >
        {tabsData.map((item, index) => {
          return this.renderTab(item, index);
        })}
        </ScrollableTabView>
      </View>
    );
  }

  renderTab(item, index) {
    return (
      <View
        key={item.dataType}
        tabLabel={item.heading}
      >
        <ClinicDoctorList
          ref={tab => this._tabRefs[item.dataType] = tab}
          data={this.props.listDoctor}
          listDoctor={this.props.listDoctor}
          listClinic={this.props.listClinic}
          dataType={item.dataType}
          onFetchData={this.onFetchData}
          onClickItem={this.onClickItem}
          onChangeItemFavorite={this.onChangeItemFavorite}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  /// MapView navigation icon ///

  renderMapViewNav() {
    return (
      <TouchableOpacity
        style={styles.mapviewNavContainer}
        onPress={this.onNavigateMapView}
      >
        <Image
          style={styles.mapviewNavIcon}
          source={ICON_MAP_VIEW_NAV}
        />
        <Text style={styles.mapviewNavText}>
          {I18n.t('lvSearchScreen.titleButton')}
        </Text>
      </TouchableOpacity>
    );
  }

  renderAdvanceSearchModal() {
    return (
      <AdvanceSearchModal visible={ this.state.openFilterModal } onCloseFilter={this.onCloseFilter}/>
    );
  }


  /// Main render ///

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={BG_IMAGE}
          style={styles.rootBgImage}
        />
        <View style={styles.rootContainer}>
          {this.renderHeader()}
          {this.renderBody()}
          {this.renderMapViewNav()}
          {this.renderAdvanceSearchModal()}
        </View>
        <Loading isVisible = {this.state.isVisibleLoading  || this.props.isRequestingListDoctor || this.props.isRequestingListClinic} />
      </View>
    );
  }
}

/** Screen styles */
const styles = {
  container : {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  rootBgImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 10,
  },

  /// Header view ///

  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },

  menuIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: 0,
    marginRight: 20,
  },

  /// Body view ///

  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  /// Body view - Search result tabs ///

  tabsContainer: {
  },

  tabContainer: {
  },

  /// MapView navigation icon ///

  mapviewNavContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: Dimensions.get('window').height - 85,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    // shadow
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.6,
    shadowColor: 'rgb(0, 0, 0)',
  },

  mapviewNavIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },

  mapviewNavText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(44, 178, 9, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
};

export default withConnect(ListViewSearch);
