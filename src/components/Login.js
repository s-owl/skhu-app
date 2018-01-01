import React, { Component } from 'react'
import { 
    View,
    KeyboardAvoidingView,
    TextInput,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity } from 'react-native'

export default class Login extends Component {

    login = () => {
        this.props.history.push('/home')
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={styles.logoWrapper}>
                    <Image 
                        style={styles.logo}
                        source={require('../assets/img/logo.png')} 
                    />
                    <Text style={styles.title}> Login </Text>
                </View>
                <View style={styles.inputWrapper}> 
                    <TextInput
                        placeholder="student number"
                        placeholderTextColor="rgba(255, 255, 255, 0.85)"
                        underlineColorAndroid="rgba(0, 0, 0, 0)"
                        returnKeyType="next"
                        onSubmitEditing={() => this.passwordInput.focus()}
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="password"
                        placeholderTextColor="rgba(255, 255, 255, 0.85)"
                        underlineColorAndroid="rgba(0, 0, 0, 0)"
                        secureTextEntry
                        returnKeyType="go"
                        style={styles.input}
                        ref={(input) => this.passwordInput = input}
                    />
                    <TouchableOpacity style={styles.buttonWrapper}>
                        <Text 
                            style={styles.button}
                            onPress={this.login}
                        > 
                            LOGIN 
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    logoWrapper: {
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
        color: '#1abc9c'
    },
    inputWrapper: {
        marginBottom: 30,
        width: '100%',
        padding: 20
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(26, 188, 156, 0.7)',
        marginBottom: 10,
        fontSize: 15,
        color: '#ffffff',
        paddingHorizontal: 10,
        borderBottomWidth: 0
    },
    buttonWrapper: {
        paddingVertical: 12,
        backgroundColor: '#3498db'
    },
    button: {
        textAlign: 'center',
        fontSize: 15,
        letterSpacing: 30,
        fontWeight: '500',
        color: '#ffffff'
    }
})