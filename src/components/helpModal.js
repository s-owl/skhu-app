import React, {useState, useEffect} from 'react';
import {SectionList, Linking} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import ListItem from './listitem';
import {InfoModal} from './infoModal';
import * as WebBrowser from 'expo-web-browser';
import {useTheme} from '@react-navigation/native';
import {ThemedText} from './components';

export function HelpModal(props){
  const {colors} = useTheme();
  const [visible, setVisible] = useState(false);
  useEffect(()=>{
    setVisible(props.visible);
  }, [props.visible]);

  let sections = [
    {title: '공지사항 및 도움말 확인', data: [
      {label: '공지사항 확인(페이스북 페이지)', icon: 'facebook-box', onPress: ()=>{
        Linking.openURL('https://fb.me/SKHUsMobileApp');
      }},
      {label: '자주 묻는 질문', icon: 'help-circle-outline', onPress: async()=>{
        await WebBrowser.openBrowserAsync('https://github.com/s-owl/skhus/wiki/FAQs');
      }}
    ]},
    {title: '문의하거나 오류 보고하기', data: [
      {label: '페이스북 메신저로 문의', icon: 'facebook-messenger', onPress: ()=>{
        Linking.openURL('https://m.me/SKHUsMobileApp');
      }},
      {label: '이메일로 문의', icon: 'email-outline', onPress: ()=>{
        Linking.openURL(`mailto:s.owl.contact@gmail.com?body=${props.errorMsg}`);
      }},
      {label: 'GitHub에 이슈 등록', icon: 'github-circle', onPress: async()=>{
        await WebBrowser.openBrowserAsync('https://github.com/s-owl/skhus/issues');
      }}
    ]}
  ];
  if(props.isDuringLogin){
    sections = [
      ...sections,
      {title: '계정 복구', data: [
        {label: '계정 찾기', icon: 'account-search', onPress: async ()=>{
          await WebBrowser.openBrowserAsync('http://sid.skhu.ac.kr/SID03/SID0301');
        }},
        {label: '비밀번호 복구', icon: 'textbox-password', onPress: async ()=>{
          await WebBrowser.openBrowserAsync('http://sid.skhu.ac.kr/SID02/SID0201');
        }}
      ]
      },
      {title: '앱 정보', data: [
        {label: '앱 정보', icon: 'information', onPress: ()=>{
          let restoreModal = ()=>{
            setVisible(true);
          };
          setVisible(false);
          props.navigation.navigate('About', {onBack: restoreModal});
        }},
      ]
      }
    ];
  }
    
  return(
    <InfoModal
      visible={visible}
      icon='help-circle-outline'
      title='앱 사용에 어려움이 있나요?'
      buttons={[
        {label: '닫기', onPress: ()=>props.onClose()}
      ]}>
      <SectionList style={{height: '100%'}}
        renderItem={({item, index, section}) => (
          <ListItem key={index} onPress={item.onPress} style={{flex: 0, flexDirection: 'row'}}>
            <MaterialCommunityIcons color={colors.text} name={item.icon} size={16}
              style={{flex: 0, marginRight: 8}}/>
            <ThemedText style={{flex: 1}}>{item.label}</ThemedText>
          </ListItem>
        )}
        renderSectionHeader={({section: {title}}) => (
          <ListItem style={{flex: 0, flexDirection: 'row'}}>
            <ThemedText style={{fontWeight: 'bold'}}>{title}</ThemedText>
          </ListItem>
        )}
        sections={sections}
        keyExtractor={(item, index) => item + index}
      />
    </InfoModal>
  );
  
}
