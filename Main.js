import React, { Component } from 'react';
import { 
    StyleSheet, Text ,View,  ScrollView,
     SafeAreaView,
  } from 'react-native';
import { CardView } from './components';
import { MaterialIcons } from '@expo/vector-icons';


export default class Main extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
    
        return {
          header: null // 헤더 비활성화
        };
    };

    render() {
        return(
            <SafeAreaView>
                <ScrollView>
                    <View style={{marginTop: 100, padding: 16}}>
                        <Text style={{fontSize: 30}}>한영빈(201632034)님,{"\n"}안녕하세요.</Text>
                        <CardView style={{flex: 0, flexDirection: 'row'}} onPress={()=>{alert('clicked!')}}>
                            <MaterialIcons name="check-circle" size={20} style={{flex: 1}}/>
                            <Text style={{flex: 0}}>나의 출결 현황</Text>
                        </CardView>
                        <CardView style={{flex: 0, flexDirection: 'row'}} onPress={()=>{alert('clicked!')}}>
                            <MaterialIcons name="insert-chart" size={20} style={{flex: 1}}/>
                            <Text style={{flex: 0}}>현재 이수 학점</Text>
                        </CardView>
                        <Text style={{fontSize: 20, marginTop: 16}}>다음 강의</Text>
                        <CardView>
                            <Text style={{fontSize: 25, fontWeight: 'bold'}}>알고리즘</Text>
                            <Text style={{fontSize: 20}}>오전 09:00 @ 6202</Text>
                            <Text>출석 12, 지각 1, 결석 1, 공결 1, 생공 0, 조최 0</Text>
                        </CardView>
                        <Text style={{fontSize: 20, marginTop: 16}}>학사 일정</Text>
                        <CardView>
                            <Text>
                            05-28 ~ 06-01	계절학기 수강신청기간{"\n"}
                            06-06	현충일{"\n"}
                            06-07 ~ 06-14	계절학기 등록금납부기간{"\n"}
                            06-13	전국동시지방선거일{"\n"}
                            06-15 ~ 06-25	기말고사{"\n"}
                            06-25	종강
                            </Text>
                        </CardView>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', ()=>{
            // If back button pressed, exit the app.
            // Do not move back to the login screen
            BackHandler.exitApp();
          });
    }
  }