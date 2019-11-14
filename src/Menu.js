import React, {Component} from 'react';
import { 
  Alert, SectionList, Linking, AsyncStorage
} from 'react-native';
import ListItem from './components/listitem';
import {ThemeText} from './components/components';
import NavigationService from './tools/NavigationService';
import * as SecureStore from 'expo-secure-store';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import DBHelper from './tools/dbhelper';
import SnackBar from 'react-native-snackbar-component';
import {HelpModal} from './components/helpModal';
import {Appearance} from 'react-native-appearance';

export default class Menu extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    const {params} = navigation.state;

    return {
      title: '메뉴',
    };
  };
  constructor(props){
    super(props);
    this.state = {msg: '', snackbar: false};
    this.helpModal = React.createRef();
  }
  componentDidMount(){
    this.subscription = Appearance.addChangeListener(({colorScheme}) => {
      this.setState({textColor: colorScheme==='dark'? 'white' : 'black'});
    });
  }
  showSnackbar(msg){
    this.setState({
      msg: msg,
      snackbar: true,
      textColor: Appearance.getColorScheme()==='dark'? 'white' : 'black'});
    setTimeout(()=>{
      this.setState({msg: '', snackbar: false});
    }, 3000);
  }
  render() {
    return(
      <ThemeBackground type="safeAreaView">
        <SectionList style={{height: '100%'}}
          renderItem={({item, index, section}) => (
            <ListItem key={index} onPress={item.onPress} style={{flex: 0, flexDirection: 'row'}}>
              <MaterialCommunityIcons color={this.state.textColor} name={item.icon} size={16} style={{flex: 0, marginRight: 8}}/>
              <ThemeText style={{flex: 1}}>{item.label}</ThemeText>
            </ListItem>
          )}
          renderSectionHeader={({section: {title}}) => (
            <ListItem style={{flex: 0, flexDirection: 'row'}} isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>{title}</ThemeText>
            </ListItem>
          )}
          sections={[
            {title: '학교 생활', data: [
              {label: '나의 상담 이력', icon: 'comment-multiple-outline', onPress: ()=>{
                this.props.navigation.navigate('Counsel');
              }}
            ]},
            {title: '수강 관리', data: [
              {label: '강의계획서 조회', icon: 'clipboard-text', onPress: ()=>{
                this.props.navigation.navigate('Syllabus');
              }},
              {label: '학과/학부별 개설과목 조회', icon: 'format-list-bulleted', onPress: ()=>{
                this.props.navigation.navigate('Subjects');
              }},
              {label: '학점세이브 조회', icon: 'archive', onPress: ()=>{
                this.props.navigation.navigate('SavedCredits');
              }},
              {label: '수강신청(외부링크 - sugang.skhu.ac.kr)', icon: 'clipboard-check', onPress: ()=>{
                Linking.openURL('http://sugang.skhu.ac.kr/');
              }}
            ]},
            {title: '시간표 조회', data: [
              {label: '교원별 시간표', icon: 'face', onPress: ()=>{
                this.props.navigation.navigate('SearchProfessors');
              }},
              {label: '강의실별 시간표', icon: 'map-marker-radius', onPress: ()=>{
                this.props.navigation.navigate('SearchLectureRooms');
              }}
            ]},
            {title: '성적 및 장학 관리', data: [
              {label: '장학 내역 조회', icon: 'school', onPress: ()=>{
                this.props.navigation.navigate('ScholarshipHistory');
              }},
              {label: '학내 제출용 성적증명서', icon: 'certificate', onPress: ()=>{
                this.props.navigation.navigate('GradeCert');
              }}
            ]},
            {title: '관리', data: [
              {label: '앱 정보', icon: 'information', onPress: ()=>{
                this.props.navigation.navigate('About');
              }},
              {label: '앱 설정', icon: 'settings-outline', onPress: ()=>{
                this.props.navigation.navigate('Settings');
              }},
              {label: '도움 받기', icon: 'help-circle-outline', onPress: ()=>{
                this.helpModal.current.open();
              }},
              {label: '로그아웃', icon: 'logout', onPress: ()=>{ 
                Alert.alert(
                  '로그아웃',
                  '앱에서 로그아웃 하시겠습니까?',
                  [
                    {text: '아니오', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: '예', onPress: async () => {
                      this.showSnackbar('로그아웃 중입니다...');
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
                      NavigationService.reset('Login', {loggedOut: true});
                    }},
                  ],
                  {cancelable: false}
                );
              }}
            ]},
          ]}
          keyExtractor={(item, index) => item + index}
        />
        <SnackBar visible={this.state.snackbar} textMessage={this.state.msg}/>
        <HelpModal ref={this.helpModal}/>
      </ThemeBackground>
    );
  }
}
