import React, { Component } from 'react';
import { 
  StyleSheet, Text ,View,  ScrollView,
  SafeAreaView, SectionList
} from 'react-native';
import { CardItem } from './components/components';
// import { CardView } from './components';
// import { MaterialIcons } from '@expo/vector-icons';


export default class Menu extends Component {
static navigationOptions = ({ navigation, navigationOptions }) => {
  const { params } = navigation.state;

  return {
    title: '전체 메뉴',
  };
};
render() {
  return(
    <SafeAreaView>
      <SectionList
        renderItem={({item, index, section}) => (
          <CardItem key={index} onPress={item.onPress} style={{flex: 0, flexDirection: 'row'}}>
            <Text>{item.label}</Text>
          </CardItem>
        )}
        renderSectionHeader={({section: {title}}) => (
          <CardItem style={{flex: 0, flexDirection: 'row'}} isHeader={true}>
            <Text style={{fontWeight: 'bold'}}>{title}</Text>
          </CardItem>
        )}
        sections={[
          {title: '학교 생활', data: [
            {label: '나의 상담 이력', onPress: ()=>{
              this.props.navigation.navigate('Counsel');
            }}
          ]},
          {title: '수강 관리', data: [
            {label: '강의계획서 조회', onPress: ()=>{
              this.props.navigation.navigate('Syllabus');
            }},
            {label: '학점세이브 조회', onPress: ()=>{
              this.props.navigation.navigate('SavedCredits');
            }}
          ]},
          {title: '성적 및 장학 관리', data: [
            {label: '장학 내역 조회', onPress: ()=>{
              this.props.navigation.navigate('ScholarshipHistory');
            }}
          ]},
          {title: '관리', data: [
            {label: '앱 정보', onPress: ()=>{}},
            {label: '로그아웃', onPress: ()=>{ alert('Logging Out');}}
          ]},
        ]}
        keyExtractor={(item, index) => item + index}
      />
    </SafeAreaView>
  );
}
}