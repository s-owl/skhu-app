import React, {Component} from 'react';
import Constants from 'expo-constants';
import {ScrollView, View, Text, Image, FlatList, Linking, SectionList} from 'react-native';
import {CardItem, BottomModal} from '../components/components';
import {InfoModal} from '../components/infoModal';
import LegalInfo from '../legal';

export default class About extends Component{
    static navigationOptions = ({ navigation, navigationOptions }) => {
      const { params } = navigation.state;
      
      return {
        title: '앱 정보',
      };
    };
    constructor(props){
      super(props);
      this.teamInfoModal = React.createRef();
      this.ossModal = React.createRef();
      this.legalModal = React.createRef();
    }

    render(){
      return(
        <ScrollView style={{backgroundColor: 'whitesmoke'}}>
          <View style={{padding: 32, alignItems: 'center'}}>
            <Image style={{marginBottom: 16, width:200, height:200}} source={ require('../../assets/imgs/icon.png') }/>
            <Text style={{fontWeight: 'bold', fontSize: 36}}>{Constants.manifest.name}</Text>
            <Text>{Constants.manifest.version}</Text>
          </View>
          <CardItem isHeader={true}>
            <Text style={{fontWeight: 'bold'}}>개발자 정보</Text>
          </CardItem>
          <CardItem onPress={()=>{
            this.teamInfoModal.current.open();
          }}>
            <Text>
            성공회대학교 S.OWL {Constants.manifest.name} 개발팀{'\n'}
            (눌러서 팀원 목록 보기)
            </Text>
          </CardItem>
          <CardItem isHeader={true}>
            <Text style={{fontWeight: 'bold'}}>웹사이트</Text>
          </CardItem>
          <CardItem onPress={()=>{
            Linking.openURL('https://www.facebook.com/SKHUsMobileApp/');
          }}>
            <Text>Facebook Page</Text>
          </CardItem>
          <CardItem onPress={()=>{
            Linking.openURL('https://skhus.sleepy-owl.com/');
          }}>
            <Text>홈페이지</Text>
          </CardItem>
          <CardItem onPress={()=>{
            Linking.openURL('https://sleepy-owl.com/');
          }}>
            <Text>성공회대 S.OWL(Sleepy OWL) 홈페이지</Text>
          </CardItem>

          <CardItem isHeader={true}>
            <Text style={{fontWeight: 'bold'}}>법적 고지사항</Text>
          </CardItem>
          <CardItem onPress={()=>{
            Linking.openURL('https://github.com/s-owl/skhus/wiki/PrivacyAndPermissions');
          }}>
            <Text>개인정보취급방침, 사용되는 시스템 권한 안내</Text>
          </CardItem>
          <CardItem onPress={()=>{
            this.ossModal.current.open();
          }}>
            <Text>
            개발에 사용된 오픈소스 소프트웨어 정보{'\n'}
            (눌러서 목록 보기)
            </Text>
          </CardItem>
          <CardItem onPress={()=>{
            this.legalModal.current.open();
          }}>
            <Text>면책사항{'\n'}(눌러서 보거나 숨기기)
            </Text>
          </CardItem>
          <InfoModal ref={this.teamInfoModal}
            icon='account-group'
            title={`성공회대학교 S.OWL ${Constants.manifest.name} 개발팀`}
            buttons={[{label: '닫기', onPress: ()=>this.teamInfoModal.current.close()}]}>
            <SectionList style={{height:'100%'}}
              renderItem={({item, index, section}) => (
                <CardItem key={index} >
                  <Text>{item}</Text>
                </CardItem>
              )}
              renderSectionHeader={({section: {period}}) => (
                <CardItem style={{flex: 0, flexDirection: 'row'}}>
                  <Text style={{fontWeight: 'bold'}}>{period}</Text>
                </CardItem>
              )}
              sections={LegalInfo.devlopers}
              keyExtractor={(item, index) => item + index}
            />
          </InfoModal>
          <InfoModal ref={this.ossModal}
            icon='apps'
            title='개발에 사용된 오픈소스 소프트웨어 정보'
            buttons={[{label: '닫기', onPress: ()=>this.ossModal.current.close()}]}>
            <FlatList
              data={LegalInfo.oss}
              renderItem={({item})=>(
                <View key={item.index}>
                  <CardItem>
                    <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                    <Text>by {item.author}</Text>
                    <Text>Licensed under {item.license}</Text>
                  </CardItem>
                  <View style={{flex:1, flexDirection: 'row', justifyContent: 'center'}}>
                    <CardItem style={{flex: 1, alignItems:'center'}} onPress={()=>{
                      Linking.openURL(item.url);
                    }}>
                      <Text>Source Code</Text>
                    </CardItem>
                    <CardItem style={{flex: 1, alignItems:'center'}} onPress={()=>{
                      Linking.openURL(item.licenseUrl);
                    }}>
                      <Text>License Copy</Text>
                    </CardItem>
                  </View>
                </View>
              )}/>
          </InfoModal>
          <InfoModal ref={this.legalModal}
            icon='library-books'
            title='면책사항'
            buttons={[{label: '닫기', onPress: ()=>this.legalModal.current.close()}]}>
            <Text>
                본 앱은 성공회대학교 공식 인증 앱이 아니며, 사용 중 발생하는 모든 책임은 사용자 본인에게 있습니다.
            </Text>
          </InfoModal>
        </ScrollView>
      );
    }
}