import { combineReducers, configureStore } from '@reduxjs/toolkit'
import  userReducer  from './user/userSlice'
import { persistReducer , persistStore} from 'redux-persist'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

// ✅ Safe storage for Vite. This is basically a safe wrapper around localStorage. But sometimes with Vite/SSR: "window is undefined".errors happen.
const storage = {
  getItem: (key) => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(null)
        return
      }
      resolve(localStorage.getItem(key))
    })
  },
  setItem: (key, value) => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined'){
        resolve()
        return
      } 
      localStorage.setItem(key, value)
      resolve();
    })
  },
  removeItem: (key) => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined'){
        resolve()
        return
      } 
      localStorage.removeItem(key)
      resolve();
    })
  },
}

//combine reducer:
const rootReducer = combineReducers({user: userReducer})

// Configuration for saving Redux state
const persistConfig = {
  key : 'root', //save data with name "root" in localStorage
  storage, //store it in browser localStorage
  version: 1 //Used for future updates If your state structure changes later, you can increase version
}

// Wrap rootReducer to enable persistence
//  persistConfig → tells how/where to save data
//  rootReducer → contains state update logic
//  persistReducer → wraps rootReducer and enhances it
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false, // Serializable data = data that can be safely converted to JSON
  })
})

export const persistor = persistStore(store)



/*
======================== REDUX STORE EXPLANATION ========================

This file creates and configures the Redux store of the application.

Redux:
Redux is a state management library used to store global app data in one central place called the store.
Global state means data that can be accessed from any component without passing props manually.

Store:
The store is the main global storage of the app.
Example:
{
user: {
currentUser: {},
loading: false,
error: null
}
}

Slices and Reducers:
A slice is a small part of the Redux state with its own logic.
Example:
userSlice manages user-related state.

Reducers are functions that update/change state.
combineReducers() combines multiple reducers into one main reducer called rootReducer.

Example:
const rootReducer = combineReducers({
user: userReducer
})

This creates:
{
user: ...
}

Redux Persist:
Normally Redux state resets after page refresh.
redux-persist saves Redux state into browser localStorage and restores it after refresh so user data remains available.

localStorage:
Browser storage that keeps data even after refresh or browser restart.

Storage Object:
The storage object is a safe wrapper around localStorage.
redux-persist expects:

* getItem()
* setItem()
* removeItem()

Functions:

1. getItem(key)
   Reads data from localStorage.

2. setItem(key, value)
   Saves data into localStorage.

3. removeItem(key)
   Deletes data from localStorage.

Promises:
Each storage function returns a Promise because redux-persist expects asynchronous storage functions.
resolve() means the operation completed successfully.

Window Check:
if(typeof window === 'undefined')

Checks whether code is running inside browser.
This prevents errors in Vite/SSR environments because localStorage only exists in browsers.

persistConfig:
Configuration object for redux-persist.

key:
Name used while saving data in localStorage.
Example:
persist:root

storage:
Tells redux-persist where data should be stored.

version:
Used for future Redux state structure changes and migrations.

persistReducer():
persistReducer(persistConfig, rootReducer)

Wraps the normal reducer and adds persistence functionality.
Now Redux state can:

* update normally
* save automatically
* restore automatically

persistedReducer:
Enhanced reducer with persistence support.

configureStore():
Creates the Redux store.
Redux Toolkit automatically:

* sets up Redux DevTools
* adds default middleware
* simplifies Redux configuration

middleware:
Functions that run between dispatch(action) and reducer execution.

serializableCheck:
Redux prefers serializable (JSON-safe) data.
redux-persist internally uses some non-serializable values which create warnings.

serializableCheck: false
Disables those warnings.

persistStore(store):
Creates the persistor object responsible for saving and restoring Redux state.

Complete Flow:

1. App starts
2. Redux store is created
3. redux-persist checks localStorage
4. Saved state is restored
5. Components access state using useSelector()
6. Components update state using dispatch()
7. Updated Redux state is automatically saved again

=======================================================================
*/

