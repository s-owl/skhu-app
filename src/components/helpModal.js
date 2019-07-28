import React, { Component } from 'react';
import {Modal, Text, View, ScrollView, SectionList, Linking} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {CardItem} from './components';

export class HelpModal extends Component{
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      errorMsg: '',
      isDuringLogin: false
    };
  }

  open(errorMsg='', isDuringLogin=false){
    this.setState({
      visible: true,
      errorMsg: errorMsg,
      isDuringLogin: isDuringLogin
    });
  }

  close(){
    this.setState({visible: false});
  }

  render(){
    return(
          
      <Modal
        animationType="slide"
        visible={this.state.visible}>
        <View style={{paddingTop: 40, padding: 16}}>
          <View style={{padding: 32, alignItems: 'center'}}>
            <MaterialCommunityIcons name='help-circle-outline' size={40} style={{padding: 8}}/>
            <Text style={{fontWeight: 'bold', padding: 8, fontSize: 20}}>앱 사용에 어려움이 있나요?</Text>
          </View>
          <ScrollView style={{padding: 8, height: '70%'}}>
            <SectionList style={{height:'100%', backgroundColor: 'whitesmoke'}}
              renderItem={({item, index, section}) => (
                <CardItem key={index} onPress={item.onPress} style={{flex: 0, flexDirection: 'row'}}>
                  <MaterialCommunityIcons name={item.icon} size={16} style={{flex: 0, marginRight: 8}}/>
                  <Text style={{flex: 1}}>{item.label}</Text>
                </CardItem>
              )}
              renderSectionHeader={({section: {title}}) => (
                <CardItem style={{flex: 0, flexDirection: 'row'}}>
                  <Text style={{fontWeight: 'bold'}}>{title}</Text>
                </CardItem>
              )}
              sections={[
                {title: '공지사항 및 도움말 확인', data: [
                  {label: '공지사항 확인(페이스북 페이지)', icon: 'facebook-box', onPress: ()=>{
                    Linking.openURL('https://fb.me/SKHUsMobileApp');
                  }},
                  {label: '자주 묻는 질문', icon: 'help-circle-outline', onPress: ()=>{
                    Linking.openURL('https://github.com/s-owl/skhus/wiki/FAQs');
                  }}
                ]},
                {title: '문의하거나 오류 보고하기', data: [
                  {label: '페이스북 메신저로 문의', icon: 'facebook-messenger', onPress: ()=>{
                    Linking.openURL('https://m.me/SKHUsMobileApp');
                  }},
                  {label: '이메일로 문의', icon: 'email-outline' ,onPress: ()=>{
                    Linking.openURL('mailto:s.owl.contact@gmail.com');
                  }},
                  {label: 'GitHub에 이슈 등록', icon: 'github-circle', onPress: ()=>{
                    Linking.openURL('https://github.com/s-owl/skhus/issues');
                  }}
                ]},
                {title: '계정 복구', data: [
                  {label: '계정 찾기', icon: 'account-search' ,onPress: ()=>{
                    Linking.openURL('http://sid.skhu.ac.kr/SID03/SID0301');
                  }},
                  {label: '비밀번호 복구', icon: 'textbox-password', onPress: ()=>{
                    Linking.openURL('http://sid.skhu.ac.kr/SID02/SID0201');
                  }}
                ]},
              ]}
              keyExtractor={(item, index) => item + index}
            />
          </ScrollView>
          <View style={{flex: 0, flexDirection: 'row', backgroundColor: 'white',
            height:50, width:'100%'}}>
         
            <CardItem style={{flex:1, alignItems:'center'}} onPress={()=>this.close()}>
              <Text>닫기</Text>
            </CardItem>
              
          </View>
        </View>
      </Modal>
    );
  }
}