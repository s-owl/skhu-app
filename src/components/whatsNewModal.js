import UpdateInfo from '../updateInfo';
import {InfoModal} from './infoModal';
import * as WebBrowser from 'expo-web-browser';
import {ThemedText} from './components';
import {AsyncStorage, View} from 'react-native';
import React from 'react';

export function WhatsNewModal(props){
  let info;
  if(props.isAuto){
    info = (
      <ThemedText>(앱 설정에서 업데이트 내역 자동 표시 여부 설정이 가능합니다.)</ThemedText>
    );
  }else{
    info = (<View></View>);
  }
  return(
    <InfoModal
      visible={props.visible}
      icon='gift'
      title='업데이트 내역'
      buttons={[
        {label: '모든 내역 보기', onPress: async()=>{
          await WebBrowser.openBrowserAsync(UpdateInfo.AllReleaseUrl);
        }},
        {label: '닫기', onPress: async()=>{
          props.onClose();
          await AsyncStorage.setItem(UpdateInfo.ReleaseIdKey, (true).toString());}}
      ]}>
      <View style={{padding: 8, alignItems: 'center', flex: 0}}>
        <ThemedText style={{padding: 8}}>
          {`${UpdateInfo.AppVersion} / OTA - ${UpdateInfo.OtaDeployedAt}`}
        </ThemedText>
      </View>
      <ThemedText>
        {UpdateInfo.ReleaseNoteSummaryContent}
      </ThemedText>
      {info}
    </InfoModal>
  );
}
export async function shouldShowWhatsNew(){
  const userConfig = await AsyncStorage.getItem('showWahtsNew');
  const alreadyShown = await AsyncStorage.getItem(UpdateInfo.ReleaseIdKey);
  let configValue = JSON.parse(userConfig);
  if(userConfig == null || userConfig == undefined){
    configValue = true;
  }
  if(configValue){
    let wasShown = JSON.parse(alreadyShown);
    if(alreadyShown == null || alreadyShown == undefined){
      wasShown = true;
    }
    return !wasShown;
  }else{
    return false;
  }
}