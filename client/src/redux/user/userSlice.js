import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user', 
    initialState, 
    reducers: { 
        signInStart: (state) => { 
            state.loading = true; 
        },
        
        signInSuccess: (state, action) => { 
            state.loading = false;
            state.currentUser = action.payload; 
            state.error = null;
        },
        
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        updateUserStart: (state) => {
            state.loading = true;
        },

        updateUserSuccess: (state, action) => {
            state.loading  = false;
            state.currentUser = action.payload;
            state.error = null;
        }, 

        updateUserFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        deleteUserStart: (state) => {
            state.loading = true;
        },

        deleteUserSuccess: (state) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },

        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        
        signOutUserStart: (state) => {
            state.loading = true;
        },

        signOutUserSuccess: (state) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },

        signOutUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

    }
});

export const { signInStart, signInSuccess, signInFailure, updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserFailure, signOutUserSuccess } = userSlice.actions;

export default userSlice.reducer;

/*
Redux stores global data of the app in one central place called the store.
This file creates a "user slice", which manages user-related state like currentUser, loading, and error.

initialState:
Defines the starting values of the state.

Reducers:
Reducers are functions that update/change the state.
Redux Toolkit automatically creates actions for each reducer.

Action:
An action is an object sent to Redux to tell it what change should happen.

action.payload:
payload contains the data sent with the action.
Example: user data from backend or an error message.

Flow:

1. signInStart -> starts loading when login request begins.
2. signInSuccess -> saves logged in user data and stops loading.
3. signInFailure -> stores error message and stops loading.

dispatch():
Used to trigger/run an action.
Example: dispatch(signInStart())

userSlice.actions:
Contains automatically generated action creators.

userSlice.reducer:
Exports the reducer so it can be added to the Redux store.
*/