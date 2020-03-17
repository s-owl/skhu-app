import React, {useEffect, useState, useLayoutEffect} from 'react';
import ListItem from '../components/listitem';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import ForestApi from '../tools/apis';
import Printer from '../tools/printer';
import {MaterialHeaderButtons} from '../components/headerButtons';
import BuildConfigs from '../config';
import {ThemeText} from '../components/components';

export default function GradeCert(props){

  const [userinfo, setUserinfo] = useState([]);
  const [details, setDetails] = useState([]);
  const [summary, setSummary] = useState([]);
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    (async ()=>{
      setIsLoading(true);
      const gradeCert = await ForestApi.get('/grade/certificate', true);
      if(gradeCert.ok){
        const data = await gradeCert.json();
        setUserinfo(data.userinfo);
        setDetails(data.details);
        setSummary(data.summary);
        setDate(data.date);
        setIsLoading(false);
      }
    })();
  }, []);

  const print = () =>{
    Printer.printGradeCert(userinfo, details, summary, date);
  };

  useLayoutEffect((navigation, print) => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialHeaderButtons>
          <MaterialHeaderButtons.Item title="인쇄" iconName="print" onPress={print} />
        </MaterialHeaderButtons>
      ),
    });
  }, [props.navigation, print]);

  
  if(isLoading){
    return(
      <View style={{justifyContent: 'center', padding: 32}}>
        <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
      </View>
    );
  }else{
    return(
      <FlatList style={{height: '100%'}}
        ListHeaderComponent={()=>(
          <View>
            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>학생 정보</ThemeText>
            </ListItem>
            <ListItem>
              {userinfo.map(((item, index)=>{
                return(
                  <ThemeText key={`info${index}`}>{item.name}: {item.value}</ThemeText>
                );
              }))}
            </ListItem>
            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>성적 내역 상세</ThemeText>
            </ListItem>
          </View>
        )}
        
        data={details}
        renderItem={({item}, index)=>(
          <ListItem style={{flex: 0, flexDirection: 'row'}} key={`details${index}`}>
            <ThemeText style={{flex: 2}}>{item.year}{'\n'}{item.semester}</ThemeText>
            <View style={{flex: 4}}>
              <ThemeText style={{fontWeight: 'bold'}}>{item.subject}</ThemeText>
              <ThemeText>{item.code}</ThemeText>
            </View>
            <ThemeText style={{flex: 1}}>{item.type}</ThemeText>
            <ThemeText style={{flex: 1}}>{item.credit}</ThemeText>
            <ThemeText style={{flex: 1}}>{item.grade}</ThemeText>
          </ListItem>
        )}
        ListFooterComponent={()=>(
          <View>
            <ListItem isHeader={true}>
              <ThemeText style={{fontWeight: 'bold'}}>요약</ThemeText>
            </ListItem>
            <ListItem style={{flex: 0, flexDirection: 'row', flexWrap: 'wrap'}}>
              {summary.map(((item, index)=>{
                return(
                  <View style={{padding: 2}} key={`summ${index}`}>
                    <ThemeText style={{fontWeight: 'bold'}}>{item.type}</ThemeText>
                    <ThemeText>{item.credit}</ThemeText>
                  </View>
                );
              }))}
            </ListItem>
            <ListItem>
              <ThemeText style={{fontWeight: 'bold'}}>{date}</ThemeText>
            </ListItem>
          </View>
        )}
      />
    );
  }
}

