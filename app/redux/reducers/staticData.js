import * as types from '../types';

export default function staticData(state = { loading : true }, action) {
  
  switch (action.type ) {
    case types.LOADING_STATIC_DATA_DONE :
      return { ...state, loading: false }
      break;
  }
  
  return state;
}