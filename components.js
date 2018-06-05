
import React, { Component } from 'react';
import { 
    StyleSheet, View, ActivityIndicator, Modal
  } from 'react-native';
class CardView extends Component{
    render(){
        return(
            <View style={styles.container}>
                {this.props.children}
            </View>
        )
    }
}

class LoadingModal extends Component{
    render(){
        return(
            <Modal
            animationType="fade"
            transparent={false}
            visible={this.props.isVisible}>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#0000ff" />
            </View>
            </Modal>
        )
    }
}

export{
    CardView, LoadingModal
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 1,
        padding: 8,
        backgroundColor: 'white'
    }
  });