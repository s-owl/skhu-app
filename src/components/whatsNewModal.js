import UpdateInfo from '../updateInfo';
import {InfoModal} from './infoModal';
import * as WebBrowser from 'expo-web-browser';
import {ThemedText} from './components';
import {AsyncStorage} from 'react-native';

export function WhatsNewModal(props){
  return(
    <InfoModal
      visible={props.visible}
      icon='gift-outline'
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