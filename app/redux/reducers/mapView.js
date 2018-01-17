export default function map(state = {}, action) {
  const markerLocation = [{
    latitude: 20.9856769,
    longitude: 105.7948475,
    type: 'doctor',
  }, {
    latitude: 20.9902169,
    longitude: 105.8008795,
    type: 'clinic',
  }, {
    latitude: 20.9751784,
    longitude: 105.7830205,
    type: 'doctor',
  }, {
    latitude: 20.9742724,
    longitude: 105.7831875,
    type: 'doctor',
  }, {
    latitude: 20.9778207,
    longitude: 105.7873796,
    type: 'clinic',
  }];

  state = { markerLocation };
  switch (action.type) {
    case 'SEARCH_MAP_VIEW':
      if (action.searchTxt) {
        const markerLocationSearch = [{
          latitude: 20.9856769,
          longitude: 105.7948475,
          type: 'doctor',
        }, {
          latitude: 20.9902169,
          longitude: 105.8008795,
          type: 'clinic',
        }];

        state = { markerLocation: markerLocationSearch };
      } else {

        state = { markerLocation };
      }

      return state;
      break;
  }
  return state;
}
