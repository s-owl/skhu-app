import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './src/reducers'
import App from './src/app'

import { createEpicMiddleware } from 'redux-observable'
import fetchUserEpic from './src/epics/user'

const epicMiddleware = createEpicMiddleware(fetchUserEpic)

const store = createStore(rootReducer, applyMiddleware(epicMiddleware))

export default class SkhuApp extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}
