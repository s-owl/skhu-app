import React, {Component} from 'react';
import {Constants, Linking} from 'expo';
import {ScrollView, View, Text, Image, FlatList} from 'react-native';
import {CardItem, BottomModal} from '../components/components';
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
      this.state={
        showDevs: false,
        showOss: false,
        showLegal: false
      };
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
            this.setState({
              showDevs: !this.state.showDevs
            });
          }}>
            <Text>
            성공회대학교 S.OWL {Constants.manifest.name} 개발팀{'\n'}
            (눌러서 팀원 목록 보기)
            </Text>
          </CardItem>
          <BottomModal
            title={`성공회대학교 S.OWL ${Constants.manifest.name} 개발팀`} visible={this.state.showDevs}
            onRequestClose={()=>{
              this.setState({showDevs: false});
            }}
            buttons={[{
              label: '닫기',
              onPress: ()=>{this.setState({showDevs: false});}
            }]}>
            <CardItem>
              <Text style={{fontWeight: 'bold', marginTop: 8}}>현재 개발팀 구성원</Text>
              {LegalInfo.currentDevelopers.map((item, index)=>(
                <Text style={{padding: 2}}>* {item}</Text>
              ))}
              <Text style={{fontWeight: 'bold', marginTop: 8}}>이전 개발팀 구성원</Text>
              {LegalInfo.formerDevelopers.map((item, index)=>(
                <Text style={{padding: 2}}>* {item}</Text>
              ))}
            </CardItem>
          </BottomModal>
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
            <Text style={{fontWeight: 'bold'}}>오류 보고/기능 제안/문의</Text>
          </CardItem>
          <CardItem onPress={()=>{
            Linking.openURL('https://github.com/s-owl/skhus/wiki/FAQs');
          }}>
            <Text>자주 묻는 질문</Text>
          </CardItem>
          <CardItem onPress={()=>{
            Linking.openURL('https://github.com/s-owl/skhus/issues/new');
          }}>
            <Text>새 의견 제출하기(GitHub 계정 필요)</Text>
          </CardItem>
          <CardItem onPress={()=>{
            Linking.openURL('https://github.com/s-owl/skhus/issues');
          }}>
            <Text>오류 보고/기능 제안 목록 보기</Text>
          </CardItem>
          <CardItem onPress={()=>{
            Linking.openURL('mailto:s.owl.contact@gmail.com');
          }}>
            <Text>이메일로 문의하기(s.owl.contact@gmail.com)</Text>
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
            this.setState({
              showOss: !this.state.showOss
            });
          }}>
            <Text>
            개발에 사용된 오픈소스 라이브러리/프레임워크 정보{'\n'}
            (눌러서 목록 보기)
            </Text>
          </CardItem>
          <BottomModal
            title="개발에 사용된 오픈소스 라이브러리/프레임워크 정보" visible={this.state.showOss}
            onRequestClose={()=>{
              this.setState({showOss: false});
            }}
            buttons={[{
              label: '닫기',
              onPress: ()=>{this.setState({showOss: false});}
            }]}>
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
          </BottomModal>
          <CardItem onPress={()=>{
            this.setState({
              showLegal: !this.state.showLegal
            });
          }}>
            <Text>면책사항{'\n'}(눌러서 보거나 숨기기)
            </Text>
          </CardItem>
          <BottomModal
            title="면책사항" visible={this.state.showLegal}
            onRequestClose={()=>{
              this.setState({showLegal: false});
            }}
            buttons={[{
              label: '닫기',
              onPress: ()=>{this.setState({showLegal: false});}
            }]}>
            <CardItem>
              <Text>
                본 앱은 성공회대학교 공식 인증 앱이 아니며, 사용 중 발생하는 모든 책임은 사용자 본인에게 있습니다.
              </Text>
            </CardItem>
          </BottomModal>
        </ScrollView>
      );
    }
}