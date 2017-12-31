import React from 'react'
import { View, Text, StyleSheet, Button, Image } from 'react-native'

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
            <View style={styles.app}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/">
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <View style={styles.left}>
                                    <Button onPress={() => history.goBack()} title="back">
                                        <Image />
                                    </Button>
                                </View>
                                <View style={styles.body}>
                                    <Text> Main </Text>
                                </View>
                                <View style={styles.right}>
                                    <Button onPress={() => console.log('null')} title="after" />
                                </View>
                            </View>
                            <Switch>
                                <Route exact path="/main" component={Main} />
                                <Route exact path="/test" component={Test} />
                            </Switch>
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
                                <Link to="/" style={styles.tab} > 
                                    <Text> Null </Text>
                                </Link>
                            </View>
                        </View>
                    </Route>
                </Switch>
            </View>
        </Provider>
    </Router>
)

const styles = StyleSheet.create({
    app: {
        flex: 1
    },
    container: {
        flex: 1
    },
    header: {
        flexBasis: 84.5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    left: {
        flex: 1
    },
    body: {
        flex: 1,
        alignItems: 'center'
    },
    right: {
        flex: 1
    },
    tabs: {
        flexBasis: 60,
        flexDirection: 'row'
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fefefe',
        borderWidth: 1,
        borderColor: 'white',
        borderStyle: 'solid'
    }
})

export default App