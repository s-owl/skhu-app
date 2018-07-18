import { SQLite } from 'expo';
import ForestApi from './apis';
import DateTools from './datetools';
export default class DBHelper{
  constructor(){
    console.log('Init db connection');
    this.db = SQLite.openDatabase('db.db');
    console.log('creating attendance table');
    this.db.transaction(tx => {
      tx.executeSql(
        `create table if not exists attendance(
          id varchar(12) primary key not null,
          lecture_name varchar(20) not null,
          attend integer not null,
          late integer not null,
          absence integer not null,
          approved integer not null,
          menstrual integer not null,
          early integer not null);`,[],
        (tx, result)=>{
          console.log('done create attendance');
          console.log(result);
        },
        (err)=>{
          console.log('Error while create attendance');
          console.log(err);
        }
      );
    });
    console.log('creating timetable table');
    this.db.transaction(tx => {
      tx.executeSql(
        `create table if not exists timetable(
          id varchar(12) primary key not null, 
          title varchar(20) not null,
          professor varchar(20) not null,
          room varchar(10) not null,
          day integer not null,
          starts_at datetime not null,
          ends_at datetime not null,
					lecture_id varchar(12) not null);`,[], 
        (tx, result)=>{
          console.log('done create timetable');
          console.log(result);
        },
        (err)=>{
          console.log('Error while create timetable');
          console.log(err);
        }
      );
    });
  }
  async fetchAttendance(){
    console.log('fetching attendance');
    let attendance = await ForestApi.post('/user/attendance',
      JSON.stringify({'semester':'Z0101'}), true);
    if(attendance.ok){
      console.log('attendance');
      let data = await attendance.json();
      for(let item of data.attendance){
        this.db.transaction(tx => 
          tx.executeSql(
            'insert or replace into attendance values(?, ?, ?, ?, ?, ?, ?, ?);',
            [item.subject_code, item.subject, Number(item.attend), Number(item.late), 
              Number(item.absence), Number(item.approved), Number(item.menstrual), Number(item.early)],
            (tx, result)=>{
              console.log('done insert attendance');
              console.log(result);
            },
            (err)=>{
              console.log('error insert attendance');
              console.log(err);
            }
          )
        );
      }
    }
  }
  queryAttendance(){
    return new Promise((resolve, reject)=>{
      this.db.transaction(tx =>
        tx.executeSql('select * from attendance',[],
          (tx, result)=>{
            resolve(result.rows._array);
          },
          (err)=>{
            reject(err);
          })
      );
    });
  }
  async fetchTimeTable(){
    try{
      const today = new Date();
      const semester = DateTools.getSemesterCode(today.getMonth()+1);
      // const semester = DateTools.getSemesterCode(5);
            
      let timetable = await ForestApi.postToSam('/SSE/SSEAD/SSEAD03_GetList', 
        JSON.stringify({
          'Yy': today.getFullYear(),
          'Haggi': semester.code,
          'HaggiNm': semester.name
        }), false);
      if(timetable.ok){
        console.log('timetable');
        let data = await timetable.json();
        for(let item of data.DAT){
          const dayOfWeek = DateTools.dayOfWeekStrToNum(item.YoilNm);
          this.db.transaction(tx => 
            tx.executeSql(
              'insert or replace into timetable values(?, ?, ?, ?, ?, time(?), time(?), ?);',
              [`${item.GwamogCd}-${dayOfWeek}`, item.GwamogKorNm, item.GyosuNm, item.HosilCd,
                Number(dayOfWeek), item.FrTm, item.ToTm, `${item.GwamogCd}-${item.Bunban}`],
              (tx, result)=>{
                console.log('done insert timetable');
                console.log(result);
              },
              (err)=>{
                console.log('Error while insert timetable');
                console.log(err);
              })
          );
        }
      }
      console.log('done');
    }catch(err){
      console.log('Error while fetching timetable');
      console.log(err);
    }
        
  }

  getNextClassInfo(){
    return new Promise((resolve, reject)=>{
      const today = new Date();
      this.db.transaction(tx => {
        tx.executeSql(
          `select t.title, t.room, t.day, t.starts_at, t.ends_at, 
			         a.attend, a.late, a.absence, a.approved, a.menstrual, a.early
			         from timetable as t, attendance as a
					 where t.lecture_id = a.id and t.day = ? and t.starts_at > ?
					 order by t.starts_at limit 1;`,
          [today.getDay(), `${today.getHours()}:${today.getMinutes()}`],
          // [1, `${'09'}:${today.getMinutes()}`],
          (tx, result)=>{
            if(result.rows.length > 0){
              resolve(result.rows.item(0));
            }else{
              resolve(undefined);
            }
          },
          (err)=>{
            reject(err);
          }
        );
      }
      );
    });
		
  }

    
}
