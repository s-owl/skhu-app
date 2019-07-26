import React, { Component } from 'react';
import {Modal, Text, View, ScrollView} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {CardItem} from './components';
import NavigationService from './tools/NavigationService';
export const CommonErrors = {
  noNetwork: {
    icon: 'lan-disconnect',
    title: '네트워크 연결이 필요합니다',
    desc: '본 앱을 사용하려면, 네트워크 연결이 필요합니다. 네트워크 연결을 설정한 후 앱을 다시 실행하세요.',
    buttons: [
      {label: '다시 시도', onPress:()=>{
        NavigationService.reset('Login');
      }}
    ]
  },

  loginError: {
    icon: 'alert-circle-outline',
    title: '로그인 실패',
    desc: '1. 입력된 학번(아이디) 또는 비밀번호를 다시한번 확인하세요.\n\n'
      + '2. forest.skhu.ac.kr 그리고 sam.skhu.ac.kr 양쪽 모두 로그인 가능해야 앱에서 로그인이 가능합니다.\n'
      + 'sam.skhu.ac.kr 쪽에서 로그인이 불가능한 경우, 성공회대학교 전자계산소에 문의하세요.\n\n'
      + '추가정보:\n',
    buttons: [
      {label: '다시 시도', onPress:()=>{
        NavigationService.reset('Login');
      }}
    ]
  },

  netError: {
    icon: 'alert-circle-outline',
    title: '로그인 오류',
    desc: '1. 네트워크 연결상태를 확인하세요.\n\n'
      + '2. forest.skhu.ac.kr 및 sam.skhu.ac.kr 접속이 정상인지 확인하세요.\n'
      + '3. 네트워크 연결 또는 SKHU\'s 서버에 문제가 있을 수 있습니다. 네트워크 연결 문제가 아닌 경우 SKHU\'s 개발팀에 보고해 주세요.\n\n'
      + '추가정보:\n',
    buttons: [
      {label: '다시 시도', onPress:()=>{
        NavigationService.reset('Login');
      }}
    ]
  }
};

export class ErrorModal extends Component{
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      icon: 'alert-circle-outline',
      title: '오류가 발생했습니다',
      desc: '오류 상세 내용...',
      buttons: [
        {label: '확인', onPress: ()=>{this.close();}}
      ]
    };
  }

  showError(errorObj, errorMsg=''){
    this.setState({
      visible: true,
      icon: errorObj.icon,
      title: errorObj.title,
      desc: errorObj.desc + errorMsg
    });
  }

  close(){
    this.setState({visible: false});
  }

  render(){
    return(
          
      <Modal
        animationType="slide"
        visible={this.props.visible}>
        <View style={{paddingTop: 40, padding: 16}}>
          <MaterialCommunityIcons name={this.state.icon} size={40} style={{padding: 8}}/>
          <Text style={{fontWeight: 'bold', padding: 8}}>{this.state.title}</Text>
          <ScrollView style={{padding: 8, height: '80%'}}>
            <Text>{this.state.desc}</Text>
          </ScrollView>
          <View style={{flex: 0, flexDirection: 'row', backgroundColor: 'white',
            height:50, width:'100%'}}>
            {this.state.buttons.map((item, index)=>{
              return(
                <CardItem key={index} style={{flex:1, alignItems:'center'}} onPress={item.onPress}>
                  <Text>{item.label}</Text>
                </CardItem>
              );
            })}
          </View>
        </View>
      </Modal>
    );
  }
}