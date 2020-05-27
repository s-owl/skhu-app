import React, {Component} from 'react';
import Constants from 'expo-constants';
import {ScrollView, View, Image, FlatList, Linking, SectionList} from 'react-native';
import ListItem from '../components/listitem';
import {InfoModal} from '../components/infoModal';
import {ThemedText} from '../components/components';
import {Map} from 'immutable';
import * as WebBrowser from 'expo-web-browser';
import LegalInfo from '../legal';
import UpdateInfo from '../updateInfo';
import {WhatsNewModal} from '../components/whatsNewModal';

export default class About extends Component{
  constructor(props){
    super(props);
    this.state = {
      modal: Map({
        teamInfo: false,
        oss: false,
        legal: false,
        whatsNew: false,
      })
    };
  }

  setModal(name, visible) {
    let modal = this.state.modal.set(name, visible);
    this.setState({
      modal: modal
    });
  }

  // 해당 컴포넌트가 화면에서 사라질 때 작동할 것들
  componentWillUnmount() {
    try{
      const {onBack} = this.props.route.params;
      onBack();
    }catch(e){
      console.log(e);
    }
  }

  render(){
    let modal = this.state.modal;
    return(
      <ScrollView>
        <View style={{padding: 32, alignItems: 'center'}}>
          <Image style={{marginBottom: 16, width: 200, height: 200,
            borderColor: 'lightgrey', borderWidth: 1, borderRadius: 56}}
          source={ require('../../assets/imgs/icon.png') }/>
          <ThemedText style={{fontWeight: 'bold', fontSize: 36}}>{Constants.manifest.name}</ThemedText>
          <ListItem onPress={()=>{
            this.setModal('whatsNew', true);
          }} style={{alignItems: 'center'}}>
            <ThemedText>{Constants.manifest.version} / OTA - {UpdateInfo.OtaDeployedAt}</ThemedText>
            <ThemedText style={{fontWeight: 'bold'}}>업데이트 내역 보기</ThemedText>
          </ListItem>
        </View>
        <ListItem isHeader={true}>
          <ThemedText style={{fontWeight: 'bold'}}>개발자 정보</ThemedText>
        </ListItem>
        <ListItem onPress={()=>{
          this.setModal('teamInfo', true);
        }}>
          <ThemedText>
            성공회대학교 S.OWL {Constants.manifest.name} 개발팀{'\n'}
            (눌러서 팀원 목록 보기)
          </ThemedText>
        </ListItem>
        <ListItem isHeader={true}>
          <ThemedText style={{fontWeight: 'bold'}}>웹사이트</ThemedText>
        </ListItem>
        <ListItem onPress={()=>{
          Linking.openURL('https://www.facebook.com/SKHUsMobileApp/');
        }}>
          <ThemedText>Facebook Page</ThemedText>
        </ListItem>
        <ListItem onPress={()=>{
          Linking.openURL('https://skhus.sleepy-owl.com/');
        }}>
          <ThemedText>홈페이지</ThemedText>
        </ListItem>
        <ListItem onPress={()=>{
          Linking.openURL('https://sleepy-owl.com/');
        }}>
          <ThemedText>성공회대 S.OWL(Sleepy OWL) 홈페이지</ThemedText>
        </ListItem>

        <ListItem isHeader={true}>
          <ThemedText style={{fontWeight: 'bold'}}>법적 고지사항</ThemedText>
        </ListItem>
        <ListItem onPress={async()=>{
          await WebBrowser.openBrowserAsync('https://github.com/s-owl/skhus/wiki/PrivacyAndPermissions');
        }}>
          <ThemedText>개인정보취급방침, 사용되는 시스템 권한 안내</ThemedText>
        </ListItem>
        <ListItem onPress={()=>{
          this.setModal('oss', true);
        }}>
          <ThemedText>
            개발에 사용된 오픈소스 소프트웨어 정보{'\n'}
            (눌러서 목록 보기)
          </ThemedText>
        </ListItem>
        <ListItem onPress={()=>{
          this.setModal('legal', true);
        }}>
          <ThemedText>면책사항{'\n'}(눌러서 보거나 숨기기)
          </ThemedText>
        </ListItem>
        <InfoModal visible={modal.get('teamInfo')}
          icon='account-group'
          title={`성공회대학교 S.OWL ${Constants.manifest.name} 개발팀`}
          buttons={[{label: '닫기', onPress: ()=>{this.setModal('teamInfo', false);}}]}>
          <SectionList style={{height: '100%'}}
            renderItem={({item, index, section}) => (
              <ListItem key={index} >
                <ThemedText>{item}</ThemedText>
              </ListItem>
            )}
            renderSectionHeader={({section: {period}}) => (
              <ListItem style={{flex: 0, flexDirection: 'row'}}>
                <ThemedText style={{fontWeight: 'bold'}}>{period}</ThemedText>
              </ListItem>
            )}
            sections={LegalInfo.devlopers}
            keyExtractor={(item, index) => item + index}
          />
        </InfoModal>
        <InfoModal visible={modal.get('oss')}
          icon='apps'
          title='개발에 사용된 오픈소스 소프트웨어 정보'
          buttons={[{label: '닫기', onPress: ()=>{this.setModal('oss', false);}}]}>
          <FlatList
            data={LegalInfo.oss}
            renderItem={({item})=>(
              <View key={item.index}>
                <ListItem>
                  <ThemedText style={{fontWeight: 'bold'}}>{item.name}</ThemedText>
                  <ThemedText>by {item.author}</ThemedText>
                  <ThemedText>Licensed under {item.license}</ThemedText>
                </ListItem>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                  <ListItem style={{flex: 1, alignItems: 'center'}} onPress={()=>{
                    Linking.openURL(item.url);
                  }}>
                    <ThemedText>Source Code</ThemedText>
                  </ListItem>
                  <ListItem style={{flex: 1, alignItems: 'center'}} onPress={()=>{
                    Linking.openURL(item.licenseUrl);
                  }}>
                    <ThemedText>License Copy</ThemedText>
                  </ListItem>
                </View>
              </View>
            )}/>
        </InfoModal>
        <InfoModal visible={modal.get('legal')}
          icon='library-books'
          title='면책사항'
          buttons={[{label: '닫기', onPress: ()=>{this.setModal('legal', false);}}]}>
          <ThemedText>
                본 앱은 성공회대학교 공식 인증 앱이 아니며, 사용 중 발생하는 모든 책임은 사용자 본인에게 있습니다.
          </ThemedText>
        </InfoModal>
        <WhatsNewModal visible={modal.get('whatsNew')}
          onClose={()=>this.setModal('whatsNew', false)} isAuto={false}/>
      </ScrollView>
    );
  }
}
