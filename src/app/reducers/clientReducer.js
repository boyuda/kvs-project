// Reducer to handle filter state updates
export const initialState = {
  searchName: '',
  selectedService: '',
  startDate: '',
  endDate: '',
  selectedCity: '',
};

export function clientsReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH_NAME':
      return { ...state, searchName: action.payload };
    case 'SET_SELECTED_SERVICE':
      return { ...state, selectedService: action.payload };
    case 'SET_START_DATE':
      return { ...state, startDate: action.payload };
    case 'SET_END_DATE':
      return { ...state, endDate: action.payload };
    case 'SET_SELECTED_CITY':
      return { ...state, selectedCity: action.payload };
    case 'RESET_FILTERS':
      return initialState;
    default:
      return state;
  }
}
