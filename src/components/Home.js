import React from 'react'
import { Link } from 'react-router-native'
import { View, Text, Button, StyleSheet } from 'react-native'

let styles

const Home = ({ history }) => {
    const { container, wrapper, item } = styles
    return (
        <View style={container}>
            <View style={wrapper}>
                <Text style={item}> Wellcome Home!! </Text>
                <Button
                    title="Home Page"
                    style={item}
                    onPress={() => history.push('/home')}
                />
                <Button
                    title="Test Page"
                    style={item}
                    onPress={() => history.push('/test')} 
                />
                <Button
                    title="Splash Page"
                    style={item}
                    onPress={() => history.push('/')} 
                />
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
    item: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'aqua',
        color: 'purple'
    }
})

export default Home