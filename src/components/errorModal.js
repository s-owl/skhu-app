import React, {useState, useEffect} from 'react';
import {View, Clipboard} from 'react-native';
import {HelpModal} from './helpModal';
import {InfoModal} from './infoModal';
import {ThemedText} from './components';
import {CommonActions} from '@react-navigation/native';

export const CommonErrors = {
  noNetwork: {
    icon: 'lan-disconnect',
    title: '네트워크 연결이 필요합니다',
    desc: '본 앱을 사용하려면, 네트워크 연결이 필요합니다. 네트워크 연결을 설정한 후 앱을 다시 실행하세요.',
    buttons: ['retryBtn', 'helpBtn' ]
  },

  wrongLogin: {
    icon: 'alert-circle-outline',
    title: '틀린 로그인 정보',
    desc: '아이디(학번) 또는 비밀번호 입력란이 비어 있거나, 비밀번호가 8자리 미만입니다.\n'
      + '신/편입생 신규 계정에 종합정보시스템이 부여하는 초기 비밀번호는 s + (주민번호 뒤 7자리)로, 총 8자리 이며, 비밀번호 변경시 9자리 이상을 요구합니다.\n'
      + '8자리 미만 비밀번호 사용 시 PC 에서 종합정보시스템에 접속하여 비밀번호 변경 후 사용해 주세요.\n'
      + '비밀번호 변경에 문제가 있는 경우 성공회대학교 전자계산소에 문의하시기 바랍니다.',
    buttons: [ 'retryBtn', 'helpBtn' ]
  },

  loginError: {
    icon: 'alert-circle-outline',
    title: '로그인 실패',
    desc: '1. 입력된 학번(아이디) 또는 비밀번호를 다시한번 확인하세요.\n\n'
      + '2. forest.skhu.ac.kr 그리고 sam.skhu.ac.kr 양쪽 모두 로그인 가능해야 앱에서 로그인이 가능합니다.\n'
      + 'sam.skhu.ac.kr 쪽에서 로그인이 불가능한 경우, 성공회대학교 전자계산소에 문의하세요.\n\n'
      + '추가정보:\n',
    buttons: [ 'closeBtn', 'copyErrBtn', 'helpBtn' ]
  },

  netError: {
    icon: 'web',
    title: '네트워크 오류',
    desc: '1. 네트워크 연결상태를 확인하세요. 속도가 느려 시간 초과로 오류가 발생했을 수도 있습니다.\n\n'
      + '2. forest.skhu.ac.kr 및 sam.skhu.ac.kr 접속이 정상인지 확인하세요.\n\n'
      + '3. 학번이나 비밀번호가 틀렸을 수도 있습니다. 다시 한번 확인하세요.\n\n'
      + '4. SKHU\'s 서버에 문제가 있을 수 있습니다. 네트워크 연결 문제가 아닌 경우 SKHU\'s 개발팀에 보고해 주세요.\n\n'
      + '추가정보:\n',
    buttons: [ 'closeBtn', 'copyErrBtn', 'helpBtn' ]
  }
};

export function ErrorModal(props){
  const [visible, setVisible] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [buttons, setButtons] = useState([]);

  const closeBtn = {label: '닫기', onPress: ()=>{
    props.onClose();
  }};

  const retryBtn = {label: '다시 시도', onPress: ()=>{
    props.onClose();
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {name: 'AuthStack'}
        ]
      })
    );
  }};

  const copyErrBtn = {label: '오류 정보 복사', onPress: ()=>{
    Clipboard.setString(props.error.desc + props.errorMsg);
  }};

  const helpBtn = {label: '도움 받기', onPress: ()=>{
    setVisible(false);
    setHelpModal(true);
  }};
  
  useEffect(()=>{
    setVisible(props.visible);
  }, [props.visible]);

  useEffect(()=>{
    let buttons = [];
    if(typeof props.error.buttons == 'object'){
      props.error.buttons.forEach((item)=>{
        switch(item){
        case 'closeBtn': buttons.push(closeBtn); break;
        case 'retryBtn': buttons.push(retryBtn); break;
        case 'copyErrBtn': buttons.push(copyErrBtn); break;
        case 'helpBtn': buttons.push(helpBtn); break;
        }
      });
      setButtons(buttons);
    }
  }, [props.error.buttons]);
  
  return(
    <View>
      <InfoModal
        visible={visible}
        title={props.error.title}
        icon={props.error.icon}
        buttons={buttons}>
        <ThemedText>{props.error.desc + props.errorMsg}</ThemedText>
      </InfoModal>
      <HelpModal onClose={()=>setVisible(true)} visible={helpModal}
        navigation={props.navigation} isDuringLogin={true}/>
    </View>
  );
}

