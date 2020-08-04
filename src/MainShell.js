import React from 'react';
import {Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Touchable from './components/touchable';
import Main from './Main';
import Menu from './Menu';
import AttendanceScreen from './screens/attendance';
import Schedules from './screens/schedules';
import {CreditsAndGrade, Credits, GradeChart} from './screens/creditsAndGrade';
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
import {ProfessorTimetable, SearchProfessors} from './screens/professorTimetable';
import {LectureRoomTimetable, SearchLectureRooms} from './screens/lectureRoomTimetable';
import Authinfo from './screens/authinfo';
import {Settings, PinRecovery, ChangePin} from './screens/settings';
import {useTheme} from '@react-navigation/native';

const HStack = createStackNavigator();
const MStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack(){
  const {colors} = useTheme();
  return(
    <HStack.Navigator initialRouteName="Home"
      screenOptions={{
        headerTruncatedBackTitle: '뒤로',
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <HStack.Screen name="Home" component={Main} options={{headerShown: false}}/>
      <HStack.Screen name="Attendance" component={AttendanceScreen} options={{title: '나의 출결 현황'}}/>
      <HStack.Screen name="Schedules" component={Schedules} options={{title: '학사 일정'}}/>
      <HStack.Screen name="Timetable" component={StudentTimetable} options={{title: '시간표'}}/>
      <HStack.Screen name="SyllabusDetails" component={SyllabusDetails} options={{title: '강의계획서 상세'}}/>
      <HStack.Screen name="Meal" component={Meal} options={{title: '주간 식단'}}/>
      <HStack.Screen name="Authinfo" component={Authinfo} options={{headerShown: false}}/>
      <HStack.Screen name="CreditsAndGrades" component={CreditsAndGrade} options={{title: '학점/성적'}}/>
      <MStack.Screen name="GradeCert" component={GradeCert} options={{title: '학내 제출용 성적증명서'}}/>
    </HStack.Navigator>
  );
}

function MenuStack(){
  const {colors} = useTheme();
  return(
    <MStack.Navigator initialRouteName="Menu"
      screenOptions={{
        headerTruncatedBackTitle: '뒤로',
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <MStack.Screen name="Menu" component={Menu} options={{title: '메뉴'}}/>
      <MStack.Screen name="Counsel" component={CounselHistory} options={{title: '나의 상담 이력'}}/>
      <MStack.Screen name="Syllabus" component={Syllabus} options={{title: '강의계획서 조회'}}/>
      <MStack.Screen name="SyllabusDetails" component={SyllabusDetails} options={{title: '강의계획서 상세'}}/>
      <MStack.Screen name="SavedCredits" component={SavedCredits} options={{title: '학점세이브 조회'}}/>
      <MStack.Screen name="ScholarshipHistory" component={ScholarshipHistory} options={{title: '장학 내역 조회'}}/>
      <MStack.Screen name="Subjects" component={Subjects} options={{title: '학과/학부별 개설과목 조회'}}/>
      <MStack.Screen name="About" component={About} options={{title: '앱 정보'}}/>
      <MStack.Screen name="Meal" component={Meal} options={{title: '학식'}}/>
      <MStack.Screen name="searchCondition" component={searchCondition} options={{title: '검색 조건'}}/>
      <MStack.Screen name="ProfessorTimetable" component={ProfessorTimetable} options={{title: '교원별 시간표'}}/>
      <MStack.Screen name="SearchProfessors" component={SearchProfessors} options={{title: '교원 검색(교원별 시간표)'}}/>
      <MStack.Screen name="LectureRoomTimetable" component={LectureRoomTimetable} options={{title: '강의실별 시간표'}}/>
      <MStack.Screen name="SearchLectureRooms" component={SearchLectureRooms} options={{title: '강의실 검색(강의실별 시간표)'}}/>
      <MStack.Screen name="Settings" component={Settings} options={{title: '앱 설정'}}/>
      <MStack.Screen name="PinRecovery" component={PinRecovery} options={{title: 'PIN 복구'}}/>
      <MStack.Screen name="ChangePin" component={ChangePin} options={{title: 'PIN 변경'}}/>
    </MStack.Navigator>
  );
}

export default function MainShell(){
  const {colors} = useTheme();
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
        activeTintColor: colors.primary,
        inactiveTintColor: 'gray',
        showLabel: false
      }}>
      <Tab.Screen name="Home" component={HomeStack}/>
      <Tab.Screen name="Menu" component={MenuStack}/>
    </Tab.Navigator>
  );
}
