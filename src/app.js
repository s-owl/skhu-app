import React from 'react'
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native'

import { connect } from 'react-redux'
import { fetchData } from './actions/actions'

let styles

const App = (props) => {
    const {
        container,
        text,
        button,
        buttonText,
        mainContent,
        innerContent
    } = styles

    return (
        <View style={container}>
            <Text style={text}>Redux Examples</Text>
            <TouchableHighlight style={button}>
                <Text 
                    style={buttonText}
                    onPress={() => props.fetchData()}
                >
                    Load Data
                </Text>
            </TouchableHighlight>
            <View style={mainContent}>
                {
                    props.appData.isFetching && <Text>Loading</Text>
                }
                {
                    props.appData.data.length ? (
                        props.appData.data.map((user, i) => {
                            return (
                                <View key={i} style={innerContent}>
                                    <Text>Name: {user.name}</Text>
                                    <Text>Email: {user.email}</Text>
                                </View>
                            )
                        })
                    ) : null
                }
            </View>
        </View>
    )
}

styles = StyleSheet.create({
    container: {
        marginTop: 100
    },
    text: {
        textAlign: 'center'
    },
    button: {
        height: 60,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0b7eff'
    },
    buttonText: {
        color: 'white'
    },
    mainContent: {
        margin: 10
    },
    innerContent: {
        padding: 10
    }
})

function mapStateToProps (state) {
    return {
        appData: state.appData
    }
}

function mapDispatchToProps (dispatch) {
    return {
        fetchData: () => dispatch(fetchData())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)