import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import bookReducer from './reducers/bookReducer';
import userReducer from './reducers/userReducer';
import loanReducer from './reducers/loanReducer';

const rootReducer = combineReducers({
  books: bookReducer,
  users: userReducer,
  loans: loanReducer,
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
