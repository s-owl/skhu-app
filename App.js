import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { Home, Main, Test } from './src/components'

// Redux, react-router-redux
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import createHistory from 'history/createMemoryHistory'
import { Router, Route, Link, Switch } from 'react-router-native'

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import reducers from './src/reducers'

const history = createHistory()

const middleware = routerMiddleware(history)

// Redux-observable
import { createEpicMiddleware } from 'redux-observable'
import fetchUserEpic from './src/epics/user'
const epicMiddleware = createEpicMiddleware(fetchUserEpic)

// Redux Store
const store = createStore(
    combineReducers({
        ...reducers,
        router: routerReducer
    }), 
    applyMiddleware(middleware, epicMiddleware)
)

const App = () => (
    <Router history={history}>
        <Provider store={store}>
            <View style={styles.container}>
                <Route exact path="/" component={Home} />
                <Route path="/main" component={Main} />
                <Route path="/test" component={Test} />
                <View style={styles.tabs}>
                    <Link to="/" style={styles.tab}> 
                        <Text> Home </Text>
                    </Link>
                    <Link to="/main" style={styles.tab}> 
                        <Text> Main </Text>
                    </Link>
                    <Link to="/test" style={styles.tab} > 
                        <Text> Test </Text>
                    </Link>
                </View>
            </View>
        </Provider>
    </Router>
)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabs: {
        flexBasis: 60,
        flexDirection: 'row',
        backgroundColor: 'steelblue'
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'orange',
        borderWidth: 1,
        borderColor: 'white',
        borderStyle: 'solid'
    }
})

export default App