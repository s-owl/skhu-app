import UpdateInfo from '../updateInfo';
import {InfoModal} from './infoModal';
import * as WebBrowser from 'expo-web-browser';
import {ThemedText} from './components';
import {AsyncStorage, View, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import moment from 'moment';
import BuildConfigs from '../config';


export function WhatsNewModal(props){
  const allReleaseUrl = 'https://github.com/s-owl/skhu-app/releases';
  const releaseNoteUrl = `https://api.github.com/repos/s-owl/skhu-app/releases/tags/${UpdateInfo.ReleaseTag}`;
  const [releaseNoteContent, setReleaseNoteContent] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [isLoading, setLoading] = useState(false);
  const loadErrMsg = '업데이트 내역을 GitHub 에서 불러오지 못했습니다. 닫았다가 열어 다시 시도하거나 아래 "모든 내역 보기" 버튼을 이용하세요.';
  let info;
  if(props.isAuto){
    info = (
      <ThemedText>(앱 설정에서 업데이트 내역 자동 표시 여부 설정이 가능합니다.)</ThemedText>
    );
  }else{
    info = (<View></View>);
  }

  useEffect(()=>{
    (async()=>{
      if(props.visible){
        setLoading(true);
        let body = '';
        try{
          const res = await fetch(releaseNoteUrl);
          const data = await res.json();
          body = data.body;
          setPublishedAt(moment.utc(data.published_at).local().format('YYYY.MM.DD hh:mm:ss'));
        }catch(e){
          body = loadErrMsg;
        }
        setReleaseNoteContent(body);
        setLoading(false);
      }
    })();
  }, [props.visible]);

  let content = isLoading? (
    <View style={{padding: 8, alignItems: 'center'}}>
      <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
    </View>
  ):(
    <View>
      <View style={{padding: 8, alignItems: 'center', flex: 0, marginBottom: 8}}>
        <ThemedText>
          {`${UpdateInfo.AppVersion} / OTA - ${UpdateInfo.OtaDeployedAt}`}
        </ThemedText>
        <ThemedText>
          {publishedAt}
        </ThemedText>
      </View>
      <ThemedText>
        {releaseNoteContent}
      </ThemedText>
      {info}
    </View>
  );

  return(
    <InfoModal
      visible={props.visible}
      icon='gift'
      title='업데이트 내역'
      buttons={[
        {label: '모든 내역 보기', onPress: async()=>{
          await WebBrowser.openBrowserAsync(allReleaseUrl);
        }},
        {label: '닫기', onPress: async()=>{
          props.onClose();
          await AsyncStorage.setItem(UpdateInfo.ReleaseIdKey, (true).toString());}}
      ]}>
      {content}
    </InfoModal>
  );
}
export async function shouldShowWhatsNew(){
  const userConfig = await AsyncStorage.getItem('showWhatsNew');
  const alreadyShown = await AsyncStorage.getItem(UpdateInfo.ReleaseIdKey);
  let configValue = JSON.parse(userConfig);
  if(userConfig == null){
    configValue = true;
  }
  if(configValue){
    let wasShown = JSON.parse(alreadyShown);
    if(alreadyShown == null){
      wasShown = false;
    }
    return !wasShown;
  }else{
    return false;
  }
}
