export default class DateTools{
  static getSemesterCode(month){
    if(month >=1 && month < 2){
      return {code:'Z0104', name:'겨울학기'};
    }
    else if(month >=2 && month < 7){
      return {code:'Z0101', name:'1학기'};
    }
    else if(month >=7 && month < 8){
      return {code:'Z0103', name:'여름학기'};
    }
    else {
      return {code:'Z0102', name:'2학기'};
    }
  }
      
  static dayOfWeekStrToNum(str){
    switch(str){
    case '일': return 0;
    case '월': return 1;
    case '화': return 2;
    case '수': return 3;
    case '목': return 4;
    case '금': return 5;
    case '토': return 6;
    default: return 0;
    }
  }

  static dayOfWeekNumToStr(num){
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[num];
  }
}