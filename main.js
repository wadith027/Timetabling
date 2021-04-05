const reader = require('xlsx');
// const file = reader.readFile('./input_multi_course.xlsx');
const file = reader.readFile('./input_multi_course_impossible_2.xlsx');
// const file = reader.readFile('./input.xlsx');
const dayjs = require('dayjs');
// dayjs.extend(customParseFormat);
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log('Server running at http://' + hostname + ':' + port + '/');
});
let data = []
  
const sheets = file.SheetNames
  
for(let i = 0; i < sheets.length; i++)
{
   const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]]);
        // console.log(temp[0]["Full Name"]);
        
   temp.forEach((res) => {
      data.push(res)

   })
}
// console.log(reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]));
// Printing data
// console.log(data);
var year_timetable = [];
var teacher_timetable = [];
var periodDayjsTime = [];
var lecture = [];
var solutionDomain = [];
var noFlag = false;
var multipleTeacherFlag = false;
const days_in_weeks = ["Sunday","Monday", "Tuesday","Wednesday","Thursday"];
var TLE = 0;
// var unsuccessfulNumber = 0;
var unsuccessfulCourses = [];
function initialize(){
  
  // Here we are setting up a 3d array where 2nd index represent days like
  // Sunday,Monday and 3rd index represents the the period like 8:30, 10:00


  // year base student routines which 
  // are set to 0 that no class is initialized here

var day_to_check = dayjs("12-25-1995 8:30 am", "MM-DD-YYYY h:mm a");
periodDayjsTime.push(day_to_check);
var day_to_check = dayjs("12-25-1995 10:00 am", "MM-DD-YYYY h:mm a");
periodDayjsTime.push(day_to_check);
var day_to_check = dayjs("12-25-1995 11:30 am", "MM-DD-YYYY h:mm a");
periodDayjsTime.push(day_to_check);
var day_to_check = dayjs("12-25-1995 1:00 pm", "MM-DD-YYYY h:mm a");
periodDayjsTime.push(day_to_check);
var day_to_check = dayjs("12-25-1995 2:00 pm", "MM-DD-YYYY h:mm a");
periodDayjsTime.push(day_to_check);
var day_to_check = dayjs("12-25-1995 3:30 pm", "MM-DD-YYYY h:mm a");
periodDayjsTime.push(day_to_check);
var day_to_check = dayjs("12-25-1995 5:00 pm", "MM-DD-YYYY h:mm a");
periodDayjsTime.push(day_to_check);
// console.log(periodDayjsTime[0]);

   for(var i = 1 ; i<= 4; i++){
    var time_arr = {year : i, Sunday: [0,0,0,0,0], Monday: [0,0,0,0,0], Tuesday: [0,0,0,0,0], Wednesday: [0,0,0,0,0], Thursday: [0,0,0,0,0]};
    year_timetable.push(time_arr);
   }

  // console.log(year_timetable[1][1][3]);
  // 

  var teachers_info = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);

  for (var i = 0; i <teachers_info.length; i++){
    //teacher_timetable.push(teachers_info[i]['Teacher Initial']);
    var time_arr = 
      {Teacher : teachers_info[i]['Teacher Initial'], Sunday: [0,0,0,0,0], Monday: [0,0,0,0,0], Tuesday: [0,0,0,0,0], Wednesday: [0,0,0,0,0], Thursday: [0,0,0,0,0]};
    teacher_timetable.push(time_arr);
  }
  var teachers_free_time_info = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[2]]);
// console.log(teachers_free_time_info);

for(var i = 0; i <teachers_free_time_info.length; i++){
  var name = teachers_free_time_info[i].Teacher;
  for(days in days_in_weeks){
    //console.log(days_in_weeks[days]);
    //console.log(teachers_free_time_info[i][days_in_weeks[days]]);
    var str = teachers_free_time_info[i][days_in_weeks[days]]
    //var str = teachers_free_time_info[i].Sunday;
    // console.log(str);
    if(typeof(str) == "string")str = str.split(";");
    // console.log(str);
    for(time in str){
        var SE_time = str[time].split("-");
        // console.log(SE_time);
        teacherPeriodPlotter(name, days_in_weeks[days] ,SE_time[0],SE_time[1]);  
      }
  } 
  
  //console.log(teacher_timetable); 
  
}
}

initialize();

// console.log(teacher_timetable); 
// console.log(periodDayjsTime[0].isBefore(periodDayjsTime[1]) + "ho lo");

function teacherPeriodPlotter(teachersName, days, startTime, endTime){
  startTime = startTime.replace("am", " am");
  startTime = startTime.replace("pm", " pm");
  endTime = endTime.replace("am", " am");
  endTime = endTime.replace("pm", " pm");
  var s_time = dayjs("12-25-1995 "+ startTime, "MM-DD-YYYY h:mm a");
  var e_time = dayjs("12-25-1995 "+ endTime, "MM-DD-YYYY h:mm a");
  for(var i =0; i< periodDayjsTime.length - 1; i++){
    if((periodDayjsTime[i].isAfter(s_time) || periodDayjsTime[i].isSame(s_time)) && (periodDayjsTime[i+1].isBefore(e_time) || periodDayjsTime[i+1].isSame(e_time))){
      // console.log("dhukse");
      for( j in teacher_timetable){
        if(teacher_timetable[j].Teacher == teachersName){
            // console.log("dhukse");
            if(i<= 2) teacher_timetable[j][days][i] = 1;
            else if(i > 3) teacher_timetable[j][days][i-1] = 1;
        }
      }
    }
  }  
}

var courses = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[1]]);

for(var i in courses){
  for (var key in courses[i]) {
    if (courses[i].hasOwnProperty(key)) {
      // console.log(key);
      var val = courses[i][key];
      // console.log(courses[i]["Teacher Initial"]);
      if(key != "Teacher Initial"){
        lectureMaker(val, courses[i]["Teacher Initial"]);
        // console.log(val);
      }
    }
  }
}

// var courseStr = [];
function lectureMaker(input, teacher){
  for (var i in lecture) {
    if(lecture[i].courseName == input){
      lecture[i].teacher.push(teacher);
      return;
    }
  }
  var courseStr = {courseName : "", year : "", teacher: [], isLabCourse: false, section: 0};
  courseStr.courseName = input;
  courseStr.teacher.push(teacher);
  
  // console.log(courseStr);
  var splittedStr = input.split(" ");
  courseStr.year = parseInt(splittedStr[1][0]);
  if(splittedStr[1][2] == "1") courseStr.isLabCourse = true;
  if(splittedStr.length > 2) {
    // courseStr.isLabCourse = true;
    courseStr.section = parseInt(splittedStr[3]);
  }
  // else {
  //   lecture.push(courseStr);
  // }
  
  if(!courseStr.isLabCourse){
    lecture.push(courseStr);
    lecture.push(courseStr);
  }
  else{
    lecture.push(courseStr);
  }
  
  // console.log(splittedStr);
    
}
// console.log(year_timetable);
// console.log(lecture.length);
// console.log(lecture);
// console.log(lecture);
CSP(lecture)

function CSP(domain){
  // console.log(domain.length);
  // console.log(days_in_weeks[4]);
  // checkDomain = domain;
  const totalNumberofLectures = domain.length;
  var ind = 0;
  var chosenLecture;
  while(domain.length != 0){
  // while(ind < totalNumberofLectures){
    chosenLecture = selectLecture(domain);
    // console.log("-----------------choosing lecture-----------");
    // if(chosenLecture != null)console.log(chosenLecture.choosingCourse);
    if(chosenLecture == null){
      ind = ind - 1;
      if(ind < 0){
        console.log("No Solution");
        return;
      }
      // unassign works
      // TODO : ekhanei shob jhamela hoitese
      TLE = TLE + 1;
      // if(TLE >= 5 ) return;
      console.log("----------------index of Lecture-----------");
      console.log(ind);
      console.log("unassign e dhukse");
      console.log("----------------DOmain Length---------------------");
      console.log(domain.length);
      // console.log("-------Solution Domain karbar-------" );
      // console.log(solutionDomain);
      // console.log("----------------DOmain karbar---------------------");
      // console.log(domain);
      var falseCourse = solutionDomain.pop();
      // solutionDomain.pop( );
      // solutionDomain.pop();
      unsuccessfulCourses.push(falseCourse.choosingCourse);
      // domain.push(falseCourse.choosingCourse);
      
      // console.log("-------Solution Domain-------" );
      // console.log(solutionDomain);
      // console.log("----------------DOmain---------------------");
      // console.log(domain);
      console.log("----------------False Course---------------------");
      console.log(falseCourse);
      
      var batch = falseCourse.year;
      var day =  falseCourse.chosenDay;
      var index = falseCourse.period ;
      if(!falseCourse.choosingCourse.isLabCourse){
        var teacherIndex = falseCourse.teacherInd;
        // console.log(teacherIndex);
        // console.log(falseCourse);
        teacher_timetable[teacherIndex][day][index] = 1;
        year_timetable[batch -1][day][index] = 0;
      }
      else{
        var teacherIndex = falseCourse.multiTeacherIndex;
        for(var t_index in teacherIndex){
          teacher_timetable[teacherIndex[t_index]][day][index+1] = 1;
          teacher_timetable[teacherIndex[t_index]][day][index] = 1;
        }        
        year_timetable[batch -1][day][index+1] = 0;
        year_timetable[batch -1][day][index] = 0;
        // TODO: 2 ta teacher r kaj baki
      }

    }
    else{
      // console.log("----------------Domain e dhukar age ---------------");
      // console.log(chosenLecture);
      // while(unsuccessfulCourses.length!=0){
      //   domain.push(unsuccessfulCourses.pop());
      // }
      console.log("--------------eta Choose hoise---------");
      console.log(ind);
      console.log(chosenLecture);
      solutionDomain.push(chosenLecture);
      ind = ind + 1;
      var len = solutionDomain.length;
      // console.log("---------------domain r vittrer choosing course--------");
      // console.log(solutionDomain[len-1].choosingCourse);
      // console.log(solutionDomain.choosingCourse);
      // solutionDomain.choosingCourse.teacher = chosenLecture.choosingCourse.teacher;
      // console.log("--------------secelted er index  and solution DOmain--------");
      // console.log(solutionDomain);
      // console.log("---------------Index dekhi r kandi ---------------");
      // console.log();
      console.log(ind);
    }
  }
  // console.log(solutionDomain);
  // console.log(checkDomain);
}
// selectLecture(lecture);
function selectLecture(domain){
  var ind = 0;
  const length = domain.length;
  var choosingCourse;
  var checkDomain = []; // this is here because it would reset every time the function calls
  // console.log(lecture[ind]);
  while(domain.length != 0){
    console.log(domain.length);
    choosingCourse = domain[ind];
    checkDomain.push(domain[ind]);
    // console.log("----------------CheckDomain-------------------");
    // console.log(checkDomain);
    domain.splice(ind,1);
    // console.log("----------------Splice korar por Domain r obostha-------------------");
    // console.log(domain);
    // console.log(checkDomain);
    for(teacherInd in teacher_timetable){
      // console.log(choosingCourse.teacher);
      // console.log(domain);
      // console.log(domain.length);
      // console.log("------------------------------------------");
      if(teacher_timetable[teacherInd].Teacher == choosingCourse.teacher[0]){
        for(days in days_in_weeks){          
          for(var i=0; i<5; i++){
            if(teacher_timetable[teacherInd][days_in_weeks[days]][i] == 1){
              noFlag = false;;
              if(!choosingCourse.isLabCourse){
                for(var j=0; j<i ; j++){                  
                  // console.log(choosingCourse);
                  // console.log(year_timetable[choosingCourse.year - 1][days_in_weeks[days]][j]); 
                  if(choosingCourse.courseName == year_timetable[choosingCourse.year - 1][days_in_weeks[days]][j])
                  {
                    noFlag = true;
                    // console.log("No FLAG");
                    // console.log(choosingCourse.courseName);
                  }
                }
                if(year_timetable[choosingCourse.year - 1][days_in_weeks[days]][i] == 0 && !noFlag){
                    teacher_timetable[teacherInd][days_in_weeks[days]][i] = choosingCourse.courseName;
                    year_timetable[choosingCourse.year - 1][days_in_weeks[days]][i] = choosingCourse.courseName;
                    var chosenDay = days_in_weeks[days];
                    var period = i;
                    var year = choosingCourse.year;

                    checkDomain.pop();
                    // console.log("course : _______________________");
                    // console.log(checkDomain);
                    domain.push.apply(domain,checkDomain);
                    return {
                      choosingCourse,
                      teacherInd,
                      year,
                      chosenDay,
                      period 
                    };
                }
              }
              else{
                // var other
                // Here i means period
                var multiTeacherIndex = [];
                multipleTeacherFlag = false;
                for(var j=0; j<choosingCourse.teacher.length ; j++){
                  for(k = 0 ; k<teacher_timetable.length ; k++){
                    if(teacher_timetable[k].Teacher == choosingCourse.teacher[j]){
                      // multipleTeacherFlag = false;
                      
                      multiTeacherIndex.push(k);
                      if(teacher_timetable[k][days_in_weeks[days]][i] != 1 || teacher_timetable[k][days_in_weeks[days]][i+1] != 1){
                        multipleTeacherFlag = true;
                      }
                      // if(choosingCourse.courseName == "CSE 1211 Section 1"){
                      //   // console.log(teacher_timetable[k].Teacher);
                      //   console.log(teacher_timetable[k]);
                      //   console.log("Day of the week and period");
                      //   console.log(days_in_weeks[days]);
                      //   console.log(i);
                      //   console.log("availability");
                      //   console.log("first");
                      //   console.log(teacher_timetable[k][days_in_weeks[days]][i]);
                      //   console.log(teacher_timetable[k][days_in_weeks[days]][i+1]);
                      //   console.log("second");
                      //   console.log(multipleTeacherFlag);
                      // }
                    }
                  }
                }
                if(i!=2 && i!=4 && year_timetable[choosingCourse.year - 1][days_in_weeks[days]][i] == 0 && year_timetable[choosingCourse.year - 1][days_in_weeks[days]][i+1] == 0 && !multipleTeacherFlag)
                {
                  // here lala is an index of teacher timeTable in
                  // sorry out of variable names in mind right now
                  for(var lala in multiTeacherIndex ){
                    teacher_timetable[lala][days_in_weeks[days]][i] = choosingCourse.courseName;
                    teacher_timetable[lala][days_in_weeks[days]][i+1] = choosingCourse.courseName;
                  }
                  
                  year_timetable[choosingCourse.year - 1][days_in_weeks[days]][i] = choosingCourse.courseName;
                  year_timetable[choosingCourse.year - 1][days_in_weeks[days]][i+1] = choosingCourse.courseName;
                  var chosenDay = days_in_weeks[days];
                  var period = i;
                  var year = choosingCourse.year;
                  checkDomain.pop();
                  // console.log("LAB : _______________________");
                  // console.log(checkDomain);
                  domain.push.apply(domain,checkDomain);
                    return {
                      choosingCourse,
                      multiTeacherIndex,
                      year,
                      chosenDay,
                      period 
                    };
                }
              }
            } 
          }          
        }
      }
    }
    
    // ind = ind + 1;
    // console.log("ekta fail korse");
    // lecture.splice(i,1);
  }
  domain.push.apply(domain,checkDomain);
  // console.log("--------------shob bair hoi gese erpor abar domain r obostha");
  // console.log(domain);
  return null;
}
function assignTeacher(courseName, teacherIndex, day, period){
  teacher_timetable[teacherIndex][day][period] = courseName;
}
function assignBatchPeriod(courseName, year, day, period ){
  year_timetable[year][day][period] = courseName;
}

// console.log(teacher_timetable[0][days_in_weeks[0]][0]);

console.log(teacher_timetable);
console.log(year_timetable);
// console.log(lecture);

// var year_timetable = [];
// var teacher_timetable = [];
// var periodDayjsTime = [];
// var lecture = [];
// console.log(course[0].keys());

// console.log(course[0]);
// lecture[0].teacher.push("MMR");
// console.log(lecture);
// console.log(lecture.length);
// console.log(unsuccessfulCourses);