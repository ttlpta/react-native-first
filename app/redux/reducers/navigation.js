import { AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { purgeStoredState } from 'redux-persist';
import { getState } from 'redux';

import _ from 'lodash';

import { NAVIGATE_TO_HOMESCREEN, LOGOUT } from 'app/redux/types';
import { AppNavigator } from '../../navigation';

let lastActionRouteName = 'Intro';
const firstAction = AppNavigator.router.getActionForPathAndParams(lastActionRouteName);
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const initialNavState = AppNavigator.router.getStateForAction(
  firstAction,
  tempNavState
);
let debounce = 0;

export default function navigation (state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'Navigation/BACK':
    // nextState = AppNavigator.router.getStateForAction(action, state);
      break;

    case 'hardwareBackPress' : 
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;

    case LOGOUT:
      purgeStoredState({ storage: AsyncStorage }, ['user']).then(() => {
        console.log('Purge of someReducer success');
      }).catch(() => {
        console.log('Purge of someReducer failed');
      });

      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
        state
      );

      break;

    case NAVIGATE_TO_HOMESCREEN : 
      const firstAction = AppNavigator.router.getActionForPathAndParams('SearchListDrawer');
      const initialNavState = AppNavigator.router.getStateForAction(
        NavigationActions.init()
      );

      nextState = AppNavigator.router.getStateForAction(
        firstAction,
        initialNavState
      );
      break;
      
    default:
      if (_.startsWith(action.type, 'Navigation/')){
        lastActionRouteName = action.routeName || 'BACK';
        if(action.routeName == 'DrawerClose' || action.routeName == 'DrawerOpen'){
          nextState = AppNavigator.router.getStateForAction(action, state);
          break;
        }

        if (lastActionRouteName == action.routeName && debounce) {
          break;
        }

        nextState = AppNavigator.router.getStateForAction(action, state);

        debounce = setTimeout(() => {
          debounce = 0;
        }, 1000);
      }
      
      break;
  }
  return nextState || state;
}