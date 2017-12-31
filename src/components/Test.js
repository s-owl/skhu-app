import React from 'react'
import { TouchableHighlight, ScrollView, View, Text, StyleSheet } from 'react-native'

import { connect } from 'react-redux'
import { fetchData } from '../actions/actions'

let styles

const Test = (props, navigationOptions) => {
    const {
        container,
        text,
        button,
        buttonText,
        mainContent,
        innerContent
    } = styles

    return (
        <ScrollView style={container}>
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
        </ScrollView>
    )
}

styles = StyleSheet.create({
    container: {
        flex: 1,
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

const mapStateToProps = (state) => ({
    appData: state.appData
})

const mapDispatchToProps = (dispatch) => ({
    fetchData: () => dispatch(fetchData())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Test)