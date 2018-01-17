/**
 * TeleMedicine App index
 * @providesModule TeleMedicine.App
 */

import React from 'react';
import { BackHandler } from 'react-native';
import _ from 'lodash';
import {
  StackNavigator,
  DrawerNavigator,
  TabNavigator,
  addNavigationHelpers
} from 'react-navigation';
import I18n from 'app/I18n/I18n';

import { connect } from 'react-redux';
import store from 'app/redux/store';

import * as asyncdata from 'app/data/asyncdata';

// Screens
import Login from 'app/components/Login';
import LoginWithFb from 'app/components/LoginWithFb';
import Register from 'app/components/Register';
import LoginOtp from 'app/components/LoginOtp';
import ForgotPassword from 'app/components/ForgotPasswordScreen';
import ChangePassword from 'app/components/ChangePasswordScreen';
import ListViewSearch from 'app/components/ListViewSearchScreen';
import DetailDoctor from 'app/components/DetailDoctor';
import DetailClinic from 'app/components/DetailClinic';
import Appointments from 'app/components/Appointments';
import SideBar from 'app/components/SideBar';
import Intro from './components/AppIntro';
import Term from './components/Term';
import MapView from './components/MapView';
import AccountBalance from './components/AccountBalance';
import AccountProfile from './components/AccountProfile';
import Message from './components/Message';
import Calling from './components/Calling';
import MedicalRecord from './components/MedicalRecord';
import DetailMedicalRecord from './components/DetailMedicalRecord';
import PatientStory from './components/PatientStory';
import ListFavorite from './components/ListFavorite';
import MedicalSurvivalDetail from './components/MedicalSurvivalDetail';
import MedicalProfile from './components/MedicalProfile';
import BasicInformation from './components/BasicInformation';

import Splash from './components/Splash';

const SearchListScreenStack = StackNavigator(
  {
    // MapView: { 
    //   screen: MapView, 
    //   navigationOptions: ({navigation}) => ({
    //     header: null,
    //   }) 
    // }, 
    ListViewSearch: { 
      screen: ListViewSearch, 
      navigationOptions: ({navigation}) => ({
        header: null,
      }) 
    },
  }
);

const SearchListDrawer = DrawerNavigator(
  {
    Main: { screen: SearchListScreenStack },
  },
  {
    mode: 'card',
    headerMode: 'none',
    drawerPosition: 'left',
    contentComponent: props => <SideBar {...props} data={asyncdata.getUserData()} />
  }
);

export const AppNavigator = StackNavigator(
  {
    DetailMedicalRecord: { screen: DetailMedicalRecord },
    Intro: { screen: Intro },
    Login: { screen: Login },
    LoginOtp: { screen: LoginOtp },
    Register: { screen: Register },
    Forgot: { screen: ForgotPassword },
    ChangePassword: { screen: ChangePassword },
    LoginWithFb: { screen: LoginWithFb },
    SearchListDrawer: 
      {
        screen: SearchListDrawer,
        navigationOptions: ({navigation}) => ({
          header: null,
        }),
      },
    DetailDoctor: { screen: DetailDoctor },
    DetailClinic: { screen: DetailClinic },
    Term: { screen: Term },
    AccountBalance: { screen: AccountBalance },
    AccountProfile: { screen: AccountProfile },
    Appointments: { screen: Appointments },
    Message: { screen: Message },
    Calling: { screen: Calling },
    MedicalRecord : { screen : MedicalRecord},
    PatientStory : { screen : PatientStory},
    ListFavorite : { screen : ListFavorite},
    MedicalSurvivalDetail : { screen : MedicalSurvivalDetail},
    MedicalProfile : { screen : MedicalProfile},
    BasicInformation : { screen : BasicInformation},
  }
); 


const AppWithNavigationState = ({ dispatch, nav, language, loading }) => {
  BackHandler.addEventListener('hardwareBackPress', () => {
    const canBackToPreviousScreen = (nav.index > 1);
    if ( canBackToPreviousScreen ) {
      dispatch({ type: 'hardwareBackPress' });
      return true;
    } else {
      return false;
    }
  });
  
  I18n.locale = language;

  if (loading) {
    return <Splash />
  }

  return <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />;
} 

const mapStateToProps = state => ({
  nav: state.nav,
  language: state.language.defaultlanguage,
  loading: state.staticData.loading,
});

const Root = connect(mapStateToProps)(AppWithNavigationState);

export default Root;
