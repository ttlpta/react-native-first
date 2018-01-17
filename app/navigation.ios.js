/**
 * TeleMedicine App index
 * @providesModule TeleMedicine.App
 */

import React from 'react';
import {
  StackNavigator,
  DrawerNavigator,
  TabNavigator,
  addNavigationHelpers,
} from 'react-navigation';
// import CardStackStyleInterpolator from 'react-navigation/src/views/CardStackStyleInterpolator';
import I18n from 'app/I18n/I18n';
import { connect } from 'react-redux';

import * as asyncdata from 'app/data/asyncdata';


// Screens
import Login from 'app/components/Login';
import LoginOtp from 'app/components/LoginOtp';
import Register from 'app/components/Register';
import LoginWithFb from 'app/components/LoginWithFb';
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
import Splash from './components/Splash';
import MedicalRecord from './components/MedicalRecord';
import DetailMedicalRecord from './components/DetailMedicalRecord';

import ListFavorite from './components/ListFavorite';
import PatientStory from './components/PatientStory';
import MedicalSurvivalDetail from './components/MedicalSurvivalDetail';


const SearchListScreenTab = TabNavigator(
  {
    // MapView: { screen: MapView }, 
    ListViewSearch: { screen: ListViewSearch },
  }
);

const SearchListDrawer = DrawerNavigator(
  {
    Main: { screen: SearchListScreenTab },
  },
  {
    mode: 'card',
    headerMode: 'none',
    drawerPosition: 'left',
    contentComponent: props => <SideBar {...props} data={asyncdata.getUserData()} />,
  }
);

export const AppNavigator = StackNavigator(
  {
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
        navigationOptions: () => ({
          header: null,
          gesturesEnabled: false,
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
    MedicalRecord: { screen: MedicalRecord },
    ListFavorite: { screen: ListFavorite },
    DetailMedicalRecord: { screen: DetailMedicalRecord },
    PatientStory: { screen: PatientStory },
    MedicalSurvivalDetail : { screen : MedicalSurvivalDetail },    
  }
); 
// , {
//   transitionConfig: () => ({ 
//     screenInterpolator: (sceneProps) => {
//       if (
//         sceneProps.index === 0 &&
//         sceneProps.scene.route.routeName !== 'LoginOtp' &&
//         sceneProps.scenes.length > 2
//       ) return CardStackStyleInterpolator.forInitial(sceneProps);

//       return CardStackStyleInterpolator.forHorizontal(sceneProps);
//     }
//   }),
// }

const AppWithNavigationState = ({ dispatch, nav, language, loading }) => {
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
