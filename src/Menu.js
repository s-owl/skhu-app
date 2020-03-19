import React, {useState, useRef} from 'react';
import { 
  Alert, SectionList, Linking, AsyncStorage, View
} from 'react-native';
import ListItem from './components/listitem';
import {ThemedText} from './components/components';
import * as SecureStore from 'expo-secure-store';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import DBHelper from './tools/dbhelper';
import SnackBar from 'react-native-snackbar-component';
import {HelpModal} from './components/helpModal';
import {CommonActions} from '@react-navigation/native';
import {useTheme} from '@react-navigation/native';

export default function Menu(props) {
  const {colors} = useTheme();
  let helpModal = useRef();
  const [msg, setMsg] = useState('');
  const [snackbar, setSnackbar] = useState(false);

  const showSnackbar = (msg) => {
    setMsg(msg);
    setSnackbar(true);
    setTimeout(()=>{
      setSnackbar(false);
      setMsg('');
    }, 3000);
  };
  return(
    <View>
      <SectionList style={{height: '100%'}}
        renderItem={({item, index, section}) => (
          <ListItem key={index} onPress={item.onPress} style={{flex: 0, flexDirection: 'row'}}>
            <MaterialCommunityIcons color={colors.text} name={item.icon} size={16}
              style={{flex: 0, marginRight: 8}}/>
            <ThemedText style={{flex: 1}}>{item.label}</ThemedText>
          </ListItem>
        )}
        renderSectionHeader={({section: {title}}) => (
          <ListItem style={{flex: 0, flexDirection: 'row'}} isHeader={true}>
            <ThemedText style={{fontWeight: 'bold'}}>{title}</ThemedText>
          </ListItem>
        )}
        sections={[
          {title: '학교 생활', data: [
            {label: '나의 상담 이력', icon: 'comment-multiple-outline', onPress: ()=>{
              props.navigation.navigate('Counsel');
            }}
          ]},
          {title: '수강 관리', data: [
            {label: '강의계획서 조회', icon: 'clipboard-text', onPress: ()=>{
              props.navigation.navigate('Syllabus');
            }},
            {label: '학과/학부별 개설과목 조회', icon: 'format-list-bulleted', onPress: ()=>{
              props.navigation.navigate('Subjects');
            }},
            {label: '학점세이브 조회', icon: 'archive', onPress: ()=>{
              props.navigation.navigate('SavedCredits');
            }},
            {label: '수강신청(외부링크 - sugang.skhu.ac.kr)', icon: 'clipboard-check', onPress: ()=>{
              Linking.openURL('http://sugang.skhu.ac.kr/');
            }}
          ]},
          {title: '시간표 조회', data: [
            {label: '교원별 시간표', icon: 'face', onPress: ()=>{
              props.navigation.navigate('SearchProfessors');
            }},
            {label: '강의실별 시간표', icon: 'map-marker-radius', onPress: ()=>{
              props.navigation.navigate('SearchLectureRooms');
            }}
          ]},
          {title: '성적 및 장학 관리', data: [
            {label: '장학 내역 조회', icon: 'school', onPress: ()=>{
              props.navigation.navigate('ScholarshipHistory');
            }},
            {label: '학내 제출용 성적증명서', icon: 'certificate', onPress: ()=>{
              props.navigation.navigate('GradeCert');
            }}
          ]},
          {title: '관리', data: [
            {label: '앱 정보', icon: 'information', onPress: ()=>{
              props.navigation.navigate('About');
            }},
            {label: '앱 설정', icon: 'settings-outline', onPress: ()=>{
              props.navigation.navigate('Settings');
            }},
            {label: '도움 받기', icon: 'help-circle-outline', onPress: ()=>{
              helpModal.current.open();
            }},
            {label: '로그아웃', icon: 'logout', onPress: ()=>{ 
              Alert.alert(
                '로그아웃',
                '앱에서 로그아웃 하시겠습니까?',
                [
                  {text: '아니오', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: '예', onPress: async () => {
                    showSnackbar('로그아웃 중입니다...');
                    await SecureStore.deleteItemAsync('userid');
                    await SecureStore.deleteItemAsync('userpw');
                    await SecureStore.deleteItemAsync('CredentialOld');
                    await SecureStore.deleteItemAsync('CredentialNew');
                    await SecureStore.deleteItemAsync('CredentialNewToken');
                    await SecureStore.deleteItemAsync('sessionUpdatedAt');
                    await SecureStore.deleteItemAsync('localAuthPin');
                    await AsyncStorage.clear();
                    const db = new DBHelper();
                    await db.dropAllTables();
                    props.navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [
                          {name: 'AuthStack'}
                        ]
                      })
                    );
                  }},
                ],
                {cancelable: false}
              );
            }}
          ]},
        ]}
        keyExtractor={(item, index) => item + index}
      />
      <SnackBar visible={snackbar} textMessage={msg}/>
      <HelpModal ref={helpModal}/>
    </View>
  );
}

