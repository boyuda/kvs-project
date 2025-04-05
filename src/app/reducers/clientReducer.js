// Reducer to handle filter state updates
export const initialState = {
  searchName: '',
  selectedService: '',
  start_date: '',
  end_date: '',
  selectedCity: '',
};

export function clientsReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH_NAME':
      return { ...state, searchName: action.payload };
    case 'SET_SELECTED_SERVICE':
      return { ...state, selectedService: action.payload };
    case 'SET_START_DATE':
      return { ...state, start_date: action.payload };
    case 'SET_END_DATE':
      return { ...state, end_date: action.payload };
    case 'SET_SELECTED_CITY':
      return { ...state, selectedCity: action.payload };
    case 'RESET_FILTERS':
      return initialState;
    default:
      return state;
  }
}
