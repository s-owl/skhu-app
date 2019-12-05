import React, {Component} from 'react';
import Constants from 'expo-constants';
import {ScrollView, View, Image, FlatList, Linking, SectionList} from 'react-native';
import ListItem from '../components/listitem';
import {InfoModal} from '../components/infoModal';
import {ThemeText} from '../components/components';
import {Map} from 'immutable';
import * as WebBrowser from 'expo-web-browser';
import LegalInfo from '../legal';
import BuildConfigs from '../config';

export default class About extends Component{
    static navigationOptions = ({navigation, navigationOptions}) => {
      const {params} = navigation.state;
      
      return {
        title: '앱 정보',
      };
    };

    constructor(props){
      super(props);
      this.state = {
        modal: Map({
          teamInfo: false,
          oss: false,
          legal: false,
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
      const onBack = this.props.navigation.getParam('onBack');
      if (onBack) {
        onBack();
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
            <ThemeText style={{fontWeight: 'bold', fontSize: 36}}>{Constants.manifest.name}</ThemeText>
            <ThemeText>{Constants.manifest.version}</ThemeText>
            <ThemeText>OTA - {BuildConfigs.OtaDeployedAt}</ThemeText>
          </View>
          <ListItem isHeader={true}>
            <ThemeText style={{fontWeight: 'bold'}}>개발자 정보</ThemeText>
          </ListItem>
          <ListItem onPress={()=>{
            this.setModal('teamInfo', true);
          }}>
            <ThemeText>
            성공회대학교 S.OWL {Constants.manifest.name} 개발팀{'\n'}
            (눌러서 팀원 목록 보기)
            </ThemeText>
          </ListItem>
          <ListItem isHeader={true}>
            <ThemeText style={{fontWeight: 'bold'}}>웹사이트</ThemeText>
          </ListItem>
          <ListItem onPress={()=>{
            Linking.openURL('https://www.facebook.com/SKHUsMobileApp/');
          }}>
            <ThemeText>Facebook Page</ThemeText>
          </ListItem>
          <ListItem onPress={()=>{
            Linking.openURL('https://skhus.sleepy-owl.com/');
          }}>
            <ThemeText>홈페이지</ThemeText>
          </ListItem>
          <ListItem onPress={()=>{
            Linking.openURL('https://sleepy-owl.com/');
          }}>
            <ThemeText>성공회대 S.OWL(Sleepy OWL) 홈페이지</ThemeText>
          </ListItem>

          <ListItem isHeader={true}>
            <ThemeText style={{fontWeight: 'bold'}}>법적 고지사항</ThemeText>
          </ListItem>
          <ListItem onPress={async()=>{
            await WebBrowser.openBrowserAsync('https://github.com/s-owl/skhus/wiki/PrivacyAndPermissions');
          }}>
            <ThemeText>개인정보취급방침, 사용되는 시스템 권한 안내</ThemeText>
          </ListItem>
          <ListItem onPress={()=>{
            this.setModal('oss', true);
          }}>
            <ThemeText>
            개발에 사용된 오픈소스 소프트웨어 정보{'\n'}
            (눌러서 목록 보기)
            </ThemeText>
          </ListItem>
          <ListItem onPress={()=>{
            this.setModal('legal', true);
          }}>
            <ThemeText>면책사항{'\n'}(눌러서 보거나 숨기기)
            </ThemeText>
          </ListItem>
          <InfoModal visible={modal.get('teamInfo')}
            icon='account-group'
            title={`성공회대학교 S.OWL ${Constants.manifest.name} 개발팀`}
            buttons={[{label: '닫기', onPress: ()=>{this.setModal('teamInfo', false);}}]}>
            <SectionList style={{height: '100%'}}
              renderItem={({item, index, section}) => (
                <ListItem key={index} >
                  <ThemeText>{item}</ThemeText>
                </ListItem>
              )}
              renderSectionHeader={({section: {period}}) => (
                <ListItem style={{flex: 0, flexDirection: 'row'}}>
                  <ThemeText style={{fontWeight: 'bold'}}>{period}</ThemeText>
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
                    <ThemeText style={{fontWeight: 'bold'}}>{item.name}</ThemeText>
                    <ThemeText>by {item.author}</ThemeText>
                    <ThemeText>Licensed under {item.license}</ThemeText>
                  </ListItem>
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    <ListItem style={{flex: 1, alignItems: 'center'}} onPress={()=>{
                      Linking.openURL(item.url);
                    }}>
                      <ThemeText>Source Code</ThemeText>
                    </ListItem>
                    <ListItem style={{flex: 1, alignItems: 'center'}} onPress={()=>{
                      Linking.openURL(item.licenseUrl);
                    }}>
                      <ThemeText>License Copy</ThemeText>
                    </ListItem>
                  </View>
                </View>
              )}/>
          </InfoModal>
          <InfoModal visible={modal.get('legal')}
            icon='library-books'
            title='면책사항'
            buttons={[{label: '닫기', onPress: ()=>{this.setModal('legal', false);}}]}>
            <ThemeText>
                본 앱은 성공회대학교 공식 인증 앱이 아니며, 사용 중 발생하는 모든 책임은 사용자 본인에게 있습니다.
            </ThemeText>
          </InfoModal>
        </ScrollView>
      );
    }
}
