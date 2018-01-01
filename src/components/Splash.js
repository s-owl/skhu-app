import React, { Component } from 'react'
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ActivityIndicator } from 'react-native'

import { Login } from './'

export default class Splash extends Component {

    // componentDidMount() {
    //     this.props.history.push('/login')
    // }
    
    // Test 2 seconds later
    componentDidMount = () => {
        setTimeout(() => {
            this.props.history.push('/login')
        }, 2000)
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo} 
                    source={require('../assets/img/logo.png')}
                />
                <Text style={styles.title}> SKHU APP </Text>
                <Text style={styles.subtitle}> made by s-owl </Text>
                <ActivityIndicator style={styles.loading} size="large" color="#1abc9c" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center'
    },
    logo: {
        resizeMode: 'contain',
        overlayColor:'#1abc9c',
        tintColor: '#1abc9c',
        overflow: 'visible'
    },
    title: {
        fontSize: 25,
        fontWeight: '200',
        marginTop: 15,
        color: '#1abc9c',
        justifyContent:'center',
        alignItems: 'center'
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '200',
        marginTop: 6,
        color: '#1abc9c',
        justifyContent:'center',
        alignItems: 'center'
    },
    loading: {
        position: 'absolute',
        bottom: 50
    }
})