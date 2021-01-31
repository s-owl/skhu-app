import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Image,
  Platform,
  AsyncStorage,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {CardView, ThemedText} from './components/components';
import ForestApi from './tools/apis';
import SummaryWidget from './components/summaryWidget';
import BuildConfigs from './config';
import DateTools from './tools/datetools';
import DBHelper from './tools/dbhelper';
import {MaterialIcons} from '@expo/vector-icons';
import Touchable from './components/touchable';
import LocalAuth from './components/localauth';
import ScheduleTable from './components/scheduletable';
import {MealCard} from './screens/meal';
import {useTheme} from '@react-navigation/native';
import {WhatsNewModal, shouldShowWhatsNew} from './components/whatsNewModal';
export default function Main(props) {
  let db = new DBHelper();
  const [localAuth, setlocalAuth] = useState(false);
  const [whatsNew, setWhatsNew] = useState(false);
  const {colors} = useTheme();

  useEffect(() => {
    (async () => {
      if (await shouldShowWhatsNew()) {
        setWhatsNew(true);
      }
    })();
    db.fetchAttendance();
    db.fetchTimetable();
  }, []);
  const topMargin = Platform.OS == 'ios' ? 20 : 50;
  return (
    <SafeAreaView style={{backgroundColor: colors.backgroundWithCards}}>
      <ScrollView>
        <View style={{marginTop: topMargin, padding: 16}}>
          <SummaryWidget />
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              width: '100%',
              marginTop: 8,
              marginBottom: 8,
            }}
          >
            <ShortcutButton
              icon="check-circle"
              label="출결 현황"
              onPress={() => props.navigation.navigate('Attendance')}
            />
            <ShortcutButton
              icon="insert-chart"
              label="학점/성적"
              onPress={() => props.navigation.navigate('CreditsAndGrades')}
            />
            <ProfileButton onPress={() => setlocalAuth(true)} />
          </View>

          <ThemedText style={{fontSize: 20, marginTop: 16, marginLeft: 16}}>
            다음 강의
          </ThemedText>
          <NextClassInfo
            dbHelper={db}
            onPress={() => {
              props.navigation.navigate('Timetable');
            }}
          />
          <ThemedText style={{fontSize: 20, marginTop: 16, marginLeft: 16}}>
            학사 일정
          </ThemedText>
          <MonthlySchedule
            onPress={() => {
              props.navigation.navigate('Schedules');
            }}
          />
          <ThemedText style={{fontSize: 20, marginTop: 16, marginLeft: 16}}>
            학식
          </ThemedText>
          <MealCard
            onPress={() => {
              props.navigation.navigate('Meal');
            }}
          />
        </View>
        <LocalAuth
          visible={localAuth}
          onClose={() => setlocalAuth(false)}
          onAuthSuccess={() => props.navigation.navigate('Authinfo')}
        />
        <WhatsNewModal
          visible={whatsNew}
          onClose={() => setWhatsNew(false)}
          isAuto={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

class ProfileButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: require('../assets/imgs/profilePlaceholder.png'),
      name: '인증 정보',
    };
  }

  async componentDidMount() {
    try {
      let res = await ForestApi.get('/user/profile', true);
      if (res.ok) {
        let profile = await res.json();
        let rawConfig = await AsyncStorage.getItem('hideProfile');
        let configValue = JSON.parse(rawConfig);
        if (rawConfig == null || rawConfig == undefined) {
          configValue = true;
        }
        if (configValue) {
          this.setState({
            name: profile.name,
          });
        } else {
          this.setState({
            name: profile.name,
            image: {uri: profile.image},
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <Touchable
        borderless={true}
        style={{flex: 1, alignItems: 'center'}}
        onPress={this.props.onPress}
      >
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            padding: 8,
            borderColor: 'lightgrey',
            borderWidth: 1,
            backgroundColor: 'lightgrey',
          }}
          source={this.state.image}
          onError={(error) => console.log(error)}
        />
        <ThemedText style={{padding: 8}}>{this.state.name}</ThemedText>
      </Touchable>
    );
  }
}

function ShortcutButton(props) {
  const {colors} = useTheme();
  return (
    <Touchable
      borderless={true}
      style={{flex: 1, alignItems: 'center'}}
      onPress={props.onPress}
    >
      <MaterialIcons
        name={props.icon}
        size={32}
        color={colors.text}
        style={{
          borderRadius: 24,
          borderColor: 'lightgrey',
          borderWidth: 1,
          padding: 8,
        }}
      />
      <ThemedText style={{padding: 8}}>{props.label}</ThemedText>
    </Touchable>
  );
}

class NextClassInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      time: '',
      attendance: '',
      isLoading: false,
    };
  }
  async componentDidMount() {
    try {
      this.setState({isLoading: true});
      let data = await this.props.dbHelper.getNextClassInfo();
      if (data == undefined) {
        data = await this.props.dbHelper.getNextClassWithoutAttendance();
      }
      if (data) {
        const attendanceString = data.attend
          ? `출석 ${data.attend}, 지각 ${data.late}, 결석 ${data.absence}, ` +
            `공결 ${data.approved}, 생공 ${data.menstrual}, 조퇴 ${data.early}`
          : 'LMS 에서 출결을 확인해 주세요.';
        this.setState({
          name: data.title,
          time:
            `${DateTools.dayOfWeekNumToStr(data.day)} ` +
            `${data.starts_at} ~ ${data.ends_at} @ ${data.room}`,
          attendance: attendanceString,
          isLoading: false,
        });
      } else {
        this.setState({time: '다음 강의가 없습니다.', isLoading: false});
      }
    } catch (err) {
      this.setState({
        time: '다음 강의 정보를 조회하지 못했습니다.',
        isLoading: false,
      });
      console.log(err);
    }
  }
  render() {
    let content;
    if (this.state.isLoading) {
      content = (
        <View style={{justifyContent: 'center', padding: 32}}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    } else {
      content = (
        <View>
          <ThemedText style={{fontSize: 25, fontWeight: 'bold'}}>
            {this.state.name}
          </ThemedText>
          <ThemedText style={{fontSize: 20}}>{this.state.time}</ThemedText>
          <ThemedText>{this.state.attendance}</ThemedText>
        </View>
      );
    }
    return (
      <CardView
        onPress={this.props.onPress}
        elevate={true}
        actionLabel="이번 학기 시간표 보기 >"
      >
        {content}
      </CardView>
    );
  }
}

class MonthlySchedule extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
  }
  render() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return (
      <CardView
        onPress={this.props.onPress}
        elevate={true}
        actionLabel="학사 일정 더 보기 >"
      >
        <ScheduleTable year={year} month={month} />
      </CardView>
    );
  }
}
