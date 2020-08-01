import React, {useEffect, useState, } from 'react';
import ListItem from '../components/listitem';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';
import {ThemedText, Collapsible} from '../components/components';

export default function GradeChart(props){

  const [details, setDetails] = useState([]);
  const [summary, setSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    (async ()=>{
      setIsLoading(true);
      const gradeCert = await ForestApi.get('/grade/certificate', true);
      if(gradeCert.ok){
        const data = await gradeCert.json();        
        let groups = [];
        let detailsData = [];
        let summaryData = [];
        for(const item of data.details){
          if(item.subject.includes("백분율")){
            detailsData.push({
              title: item.subject,
              subjects: []
            })
          }else if(item.subject.includes("취득학점")){
            detailsData.push({
              title: `${item.year}-${item.semester} | ${item.subject}`,
              subjects: groups
            });
            let splited = item.subject.split(" ");
            summaryData.push({
              year: item.year,
              semester: item.semester,
              earned: Number(splited[1]),
              grade: Number(splited[3])
            })
            groups = [];
          }else{
            groups.push(item);
          }
        }
        
        setDetails(detailsData);
        setSummary(summaryData);
        setIsLoading(false);
      }
    })();
  }, []);
  
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
          </View>
        )}
        
        data={details}
        renderItem={({item}, index)=>(
          <Collapsible title={item.title}>
            {item.subjects.map((sub)=>(
              <ListItem style={{flex: 0, flexDirection: 'row'}} key={`details${index}`}>
                <View style={{flex: 4}}>
                  <ThemedText style={{fontWeight: 'bold'}}>{sub.subject}</ThemedText>
                  <ThemedText>{sub.code}</ThemedText>
                </View>
                <ThemedText style={{flex: 1}}>{sub.type}</ThemedText>
                <ThemedText style={{flex: 1}}>{sub.credit}</ThemedText>
                <ThemedText style={{flex: 1}}>{sub.grade}</ThemedText>
              </ListItem>
            ))}
          </Collapsible>
        )}
      />
    );
  }
}

