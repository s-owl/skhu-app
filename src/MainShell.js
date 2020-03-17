import React from 'react';
import {Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Touchable from './components/touchable';
import Main from './Main';
import Menu from './Menu';
import AttendanceScreen from './screens/attendance';
import Schedules from './screens/schedules';
import Credits from './screens/credits';
import StudentTimetable from './screens/studentTimetable';
import CounselHistory from './screens/counsel';
import Syllabus from './screens/syllabus';
import SyllabusDetails from './screens/syllabusDetails';
import SavedCredits from './screens/savedCredits';
import ScholarshipHistory from './screens/scholarshopHistory';
import GradeCert from './screens/gradeCert';
import Subjects from './screens/subjects';
import About from './screens/about';
import {Meal} from './screens/meal';
import searchCondition from './screens/searchCondition';
import {MaterialIcons} from '@expo/vector-icons';
import BuildConfigs from './config';
import {ProfessorTimetable, SearchProfessors} from './screens/professorTimetable';
import {LectureRoomTimetable, SearchLectureRooms} from './screens/lectureRoomTimetable';
import Authinfo from './screens/authinfo';
import {Settings, PinRecovery, ChangePin} from './screens/settings';

const HStack = createStackNavigator();
const MStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack(){
  return(
    <HStack.Navigator initialRouteName="Home"
      screenOptions={{
        headerTruncatedBackTitle: '뒤로',
        headerTintColor: BuildConfigs.primaryColor,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <HStack.Screen name="Home" component={Main}/>
      <HStack.Screen name="Attendance" component={AttendanceScreen}/>
      <HStack.Screen name="Schedules" component={Schedules}/>
      <HStack.Screen name="Credits" component={Credits}/>
      <HStack.Screen name="Timetable" component={StudentTimetable}/>
      <HStack.Screen name="SyllabusDetails" component={SyllabusDetails}/>
      <HStack.Screen name="Meal" component={Meal}/>
      <HStack.Screen name="Authinfo" component={Authinfo}/>
    </HStack.Navigator>
  );
}

function MenuStack(){
  return(
    <MStack.Navigator initialRouteName="Menu"
      screenOptions={{
        headerTruncatedBackTitle: '뒤로',
        headerTintColor: BuildConfigs.primaryColor,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <MStack.Screen name="Menu" component={Menu}/>
      <MStack.Screen name="Counsel" component={CounselHistory}/>
      <MStack.Screen name="Syllabus" component={Syllabus}/>
      <MStack.Screen name="SyllabusDetails" component={SyllabusDetails}/>
      <MStack.Screen name="SavedCredits" component={SavedCredits}/>
      <MStack.Screen name="ScholarshipHistory" component={ScholarshipHistory}/>
      <MStack.Screen name="GradeCert" component={GradeCert}/>
      <MStack.Screen name="Subjects" component={Subjects}/>
      <MStack.Screen name="About" component={About}/>
      <MStack.Screen name="Meal" component={Meal}/>
      <MStack.Screen name="searchCondition" component={searchCondition}/>
      <MStack.Screen name="ProfessorTimetable" component={ProfessorTimetable}/>
      <MStack.Screen name="SearchProfessors" component={SearchProfessors}/>
      <MStack.Screen name="LectureRoomTimetable" component={LectureRoomTimetable}/>
      <MStack.Screen name="SearchLectureRooms" component={SearchLectureRooms}/>
      <MStack.Screen name="Settings" component={Settings}/>
      <MStack.Screen name="PinRecovery" component={PinRecovery}/>
      <MStack.Screen name="ChangePin" component={ChangePin}/>
    </MStack.Navigator>
  );
}

export default function MainShell(){
  return(
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarButtonComponent: Touchable,
        tabBarIcon: ({focused, color, size}) => {
          let iconName, label;
          switch(route.name){
          case 'Home': iconName = 'home'; label = '홈'; break;
          case 'Menu': iconName = 'menu'; label = '메뉴'; break;
          }
          // You can return any component that you like here! We usually use an
          // icon component from react-native-vector-icons
          return (
            <View>
              <MaterialIcons name={iconName} size={25} color={color} />
              <Text style={{color: color, textAlign: 'center'}}>{label}</Text>
            </View>
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: '#569f59',
        inactiveTintColor: 'gray',
        showLabel: false
      }}>
      <Tab.Screen name="Home" component={HomeStack}/>
      <Tab.Screen name="Menu" component={MenuStack}/>
    </Tab.Navigator>
  );
}
