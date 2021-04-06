// Author : Shadman Wadith
// It's an console based project that
// just put your excell sheet in the same folder as
// and change the name in reader.readfile() then it will get you an output 
// that's it

const reader = require('xlsx');
// const file = reader.readFile('./input_multi_course.xlsx');
// const file = reader.readFile('./input_multi_course_impossible_2.xlsx');
const file = reader.readFile('./input.xlsx');
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

var year_timetable = [];
var teacher_timetable = [];
var periodDayjsTime = [];
var lecture = [];
var solutionDomain = [];
var noFlag = false;
var multipleTeacherFlag = false;
const days_in_weeks = ["Sunday","Monday", "Tuesday","Wednesday","Thursday"];
var TLE = 0;
var isSolutionExist = true;
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

   for(var i = 1 ; i<= 4; i++){
    var time_arr = {year : i, Sunday: [0,0,0,0,0], Monday: [0,0,0,0,0], Tuesday: [0,0,0,0,0], Wednesday: [0,0,0,0,0], Thursday: [0,0,0,0,0]};
    year_timetable.push(time_arr);
   }


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
    var str = teachers_free_time_info[i][days_in_weeks[days]]
    if(typeof(str) == "string")str = str.split(";");
    
    for(time in str){
        var SE_time = str[time].split("-");
        
        teacherPeriodPlotter(name, days_in_weeks[days] ,SE_time[0],SE_time[1]);  
      }
  } 
  
  //console.log(teacher_timetable); 
  
}
}

initialize();


function teacherPeriodPlotter(teachersName, days, startTime, endTime){
  startTime = startTime.replace("am", " am");
  startTime = startTime.replace("pm", " pm");
  endTime = endTime.replace("am", " am");
  endTime = endTime.replace("pm", " pm");
  var s_time = dayjs("12-25-1995 "+ startTime, "MM-DD-YYYY h:mm a");
  var e_time = dayjs("12-25-1995 "+ endTime, "MM-DD-YYYY h:mm a");
  for(var i =0; i< periodDayjsTime.length - 1; i++){
    if((periodDayjsTime[i].isAfter(s_time) || periodDayjsTime[i].isSame(s_time)) && (periodDayjsTime[i+1].isBefore(e_time) || periodDayjsTime[i+1].isSame(e_time))){
      
      for( j in teacher_timetable){
        if(teacher_timetable[j].Teacher == teachersName){
      
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
      
      var val = courses[i][key];
      
      if(key != "Teacher Initial"){
        lectureMaker(val, courses[i]["Teacher Initial"]);
        
      }
    }
  }
}


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
  
  
  var splittedStr = input.split(" ");
  courseStr.year = parseInt(splittedStr[1][0]);
  if(splittedStr[1][2] == "1") courseStr.isLabCourse = true;
  if(splittedStr.length > 2) {
    
    courseStr.section = parseInt(splittedStr[3]);
  }
  
  if(!courseStr.isLabCourse){
    lecture.push(courseStr);
    lecture.push(courseStr);
  }
  else{
    lecture.push(courseStr);
  }
  
  
    
}

CSP(lecture)

function CSP(domain){
 
  const totalNumberofLectures = domain.length;
  var ind = 0;
  var chosenLecture;
  while(domain.length != 0){
  // while(ind < totalNumberofLectures){
    chosenLecture = selectLecture(domain);
    if(chosenLecture == null){
      ind = ind - 1;
      if(ind <= 0){
        console.log("No Solution");
        isSolutionExist = false;
        return;
      }
      // unassign works
      TLE = TLE + 1;
      // if(TLE >= 5 ) return;
      var falseCourse = solutionDomain.pop();
      unsuccessfulCourses.push(falseCourse.choosingCourse);
      
      var batch = falseCourse.year;
      var day =  falseCourse.chosenDay;
      var index = falseCourse.period ;
      if(!falseCourse.choosingCourse.isLabCourse){
        var teacherIndex = falseCourse.teacherInd;
        
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
      }

    }
    else{
      while(unsuccessfulCourses.length!=0){
        domain.push(unsuccessfulCourses.pop());
      }
      console.log("--------------eta Choose hoise---------");
      console.log(ind);
      console.log(chosenLecture);
      solutionDomain.push(chosenLecture);
      ind = ind + 1;
      console.log(ind);
    }
  }
}
function selectLecture(domain){
  var ind = 0;
  const length = domain.length;
  var choosingCourse;
  var checkDomain = []; // this is here because it would reset every time the function calls
  while(domain.length != 0){
    console.log(domain.length);
    choosingCourse = domain[ind];
    checkDomain.push(domain[ind]);
    domain.splice(ind,1);
    for(teacherInd in teacher_timetable){
      if(teacher_timetable[teacherInd].Teacher == choosingCourse.teacher[0]){
        for(days in days_in_weeks){          
          for(var i=0; i<5; i++){
            if(teacher_timetable[teacherInd][days_in_weeks[days]][i] == 1){
              noFlag = false;;
              if(!choosingCourse.isLabCourse){
                for(var j=0; j<i ; j++){                  
                  if(choosingCourse.courseName == year_timetable[choosingCourse.year - 1][days_in_weeks[days]][j])
                  {
                    noFlag = true;
                  }
                }
                if(year_timetable[choosingCourse.year - 1][days_in_weeks[days]][i] == 0 && !noFlag){
                    teacher_timetable[teacherInd][days_in_weeks[days]][i] = choosingCourse.courseName;
                    year_timetable[choosingCourse.year - 1][days_in_weeks[days]][i] = choosingCourse.courseName;
                    var chosenDay = days_in_weeks[days];
                    var period = i;
                    var year = choosingCourse.year;

                    checkDomain.pop();
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
                var multiTeacherIndex = [];
                multipleTeacherFlag = false;
                for(var j=0; j<choosingCourse.teacher.length ; j++){
                  for(k = 0 ; k<teacher_timetable.length ; k++){
                    if(teacher_timetable[k].Teacher == choosingCourse.teacher[j]){
                      
                      
                      multiTeacherIndex.push(k);
                      if(teacher_timetable[k][days_in_weeks[days]][i] != 1 || teacher_timetable[k][days_in_weeks[days]][i+1] != 1){
                        multipleTeacherFlag = true;
                      }
                      
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
    
  }
  domain.push.apply(domain,checkDomain);
  return null;
}
function assignTeacher(courseName, teacherIndex, day, period){
  teacher_timetable[teacherIndex][day][period] = courseName;
}
function assignBatchPeriod(courseName, year, day, period ){
  year_timetable[year][day][period] = courseName;
}

if(isSolutionExist){
  
  console.log(teacher_timetable);
  console.log(year_timetable);
}
// console.log(lecture);
