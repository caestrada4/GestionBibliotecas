const initialState = {
    books: [],
  };
  
  export default function bookReducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_BOOKS':
        return { ...state, books: action.payload };
      default:
        return state;
    }
  }
  