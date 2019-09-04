
import {
    combineReducers,
    createStore,
} from 'redux';

// actions
export const toggleForm = form => ({
    type: 'TOGGLE_FORM',
    form
});

// reducers
export const form = (state = {}, action) => {
    switch (action.type) {
        case 'TOGGLE_FORM':
            return action.form;
        default:
            return state;
    }
};

export const reducers = combineReducers({
    form,
});

// store
export function configureStore(initialState = {}) {
    const store = createStore(reducers, initialState);
    return store;
};

export const store = configureStore();