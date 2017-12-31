import React from 'react'
import { Link } from 'react-router-native'
import { View, Text, Button, StyleSheet } from 'react-native'

let styles

const Main = () => {
    const { container, wrapper } = styles
    return (
        <View style={container}>
            <View style={wrapper}>
                <Text style={styles.hello}> Wellcome!! </Text>
            </View>
        </View>
    )
}

styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    hello: {
        textAlign: 'center',
        padding: 30,
        backgroundColor: 'aqua',
        color: 'purple'
    }
})

export default Main