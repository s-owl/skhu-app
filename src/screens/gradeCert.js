import React, {useEffect, useState, useLayoutEffect} from 'react';
import ListItem from '../components/listitem';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import ForestApi from '../tools/apis';
import Printer from '../tools/printer';
import {MaterialHeaderButtons} from '../components/headerButtons';
import BuildConfigs from '../config';
import {ThemedText} from '../components/components';

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
              <ThemedText style={{fontWeight: 'bold'}}>학생 정보</ThemedText>
            </ListItem>
            <ListItem>
              {userinfo.map(((item, index)=>{
                return(
                  <ThemedText key={`info${index}`}>{item.name}: {item.value}</ThemedText>
                );
              }))}
            </ListItem>
            <ListItem isHeader={true}>
              <ThemedText style={{fontWeight: 'bold'}}>성적 내역 상세</ThemedText>
            </ListItem>
          </View>
        )}
        
        data={details}
        renderItem={({item}, index)=>(
          <ListItem style={{flex: 0, flexDirection: 'row'}} key={`details${index}`}>
            <ThemedText style={{flex: 2}}>{item.year}{'\n'}{item.semester}</ThemedText>
            <View style={{flex: 4}}>
              <ThemedText style={{fontWeight: 'bold'}}>{item.subject}</ThemedText>
              <ThemedText>{item.code}</ThemedText>
            </View>
            <ThemedText style={{flex: 1}}>{item.type}</ThemedText>
            <ThemedText style={{flex: 1}}>{item.credit}</ThemedText>
            <ThemedText style={{flex: 1}}>{item.grade}</ThemedText>
          </ListItem>
        )}
        ListFooterComponent={()=>(
          <View>
            <ListItem isHeader={true}>
              <ThemedText style={{fontWeight: 'bold'}}>요약</ThemedText>
            </ListItem>
            <ListItem style={{flex: 0, flexDirection: 'row', flexWrap: 'wrap'}}>
              {summary.map(((item, index)=>{
                return(
                  <View style={{padding: 2}} key={`summ${index}`}>
                    <ThemedText style={{fontWeight: 'bold'}}>{item.type}</ThemedText>
                    <ThemedText>{item.credit}</ThemedText>
                  </View>
                );
              }))}
            </ListItem>
            <ListItem>
              <ThemedText style={{fontWeight: 'bold'}}>{date}</ThemedText>
            </ListItem>
          </View>
        )}
      />
    );
  }
}

