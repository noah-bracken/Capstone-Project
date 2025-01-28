function displayStudents() {
  const classData = [ // dummy data
    { id: 1, name: 'Math 101', students: ['Alice', 'Bob', 'Sara', 'Noah', 'Michael', 'Owen'] },
  ];
  const root = document.getElementById("students"); // Get where I want the list of students to be added to
  classData.forEach((classItem) => {
      const studentList = document.createElement('ul'); //creates a list of students and the html
      studentList.id = "placeholder"
      classItem.students.forEach((student) => { // loops through each student in classdata
        const listItem = document.createElement('li'); // creates the html list for each student
        listItem.textContent = student;
        studentList.appendChild(listItem);
      });
      root.appendChild(studentList); // adds the new html where specified
    });
}

/* This is the function that uniquely identifies each button and the associated class
as well as what it will do when the button is clicked Right now it is a general listener and its template will be used elseware
the final version will be trimmed down since only 1 students button*/
function studentsButtonListener() {
  let displayed = false;
  const classButton = document.querySelectorAll('.students-button') // gets all html elements with ".Class-Button" as the class
  classButton.forEach((button) => { // for loop to cycle through all the buttons
      button.addEventListener('click', (event) =>  { //adds an event on clicking the button
        if(displayed === false) {
          displayStudents()
          displayed = true;
        }
        else if(displayed === true)
        {
          const element = document.getElementById("placeholder")
          element.remove();
          displayed = false
        }
      });
  });
}

function setTimeListener(displayed, timeData) {
  const classButton = document.querySelectorAll('.times-button') // gets all html elements with ".Class-Button" as the class
  classButton.forEach((button) => { // for loop to cycle through all the buttons
      button.addEventListener('click', (event) =>  { //adds an event on clicking the button
        const root = document.getElementById("times-id");
        if(displayed === false) {
          for(let i = 0; i<2; i++)
          {
            const timeInput = document.createElement("input");
            const time = `${timeData[0].hour[i]}:${timeData[0].minute[i]}`;
            //const time = `${timeData[0].hour[i].padStart(2, "0")}:${timeData[0].minute[i].padStart(2, "0")}`;
            timeInput.type = "time";
            timeInput.id = `meeting-time-${i}`;
            timeInput.dataset.id = `${i}`;
            timeInput.value = time;
            root.appendChild(timeInput);
          }
          const apply = document.createElement("button");
          apply.id="apply";
          apply.textContent = "Save";
          root.appendChild(apply);
          displayed = true;
          const applyButton = document.getElementById("apply");
          applyButton.addEventListener('click', () => {
          // Update the timeData array with the input values
            for (let i = 0; i < 2; i++) {
              const timeInput = document.getElementById(`meeting-time-${i}`);
              const [hours, minutes] = timeInput.value.split(":");
              timeData[0].hour[i] = hours; // Update hours in timeData
              timeData[0].minute[i] = minutes; // Update minutes in timeData
            }
            console.log("Updated timeData:", timeData);
          });
        }
        else if(displayed === true)
        {
          const one = document.querySelectorAll("input[type='time']")
          one.forEach((element) => element.remove());
          const two = document.querySelectorAll("#apply")
          two.forEach((element) => element.remove());
          displayed = false
        }
      });
  });
  if(displayed === true) {
    const Button = document.querySelectorAll('#apply') // gets all html elements with ".Class-Button" as the class
    Button.forEach((button) => { // for loop to cycle through all the buttons
        button.addEventListener('click', (event) =>  { //adds an event on clicking the button
          const time = document.querySelectorAll("#meeting-time")
          time.forEach((time, index) => {
            if (index === 0) {
              const timeValue = time.value;
              const [hours, minutes] = timeValue.split(":");
              timeData[0].hour[index] = hours;
              timeData[0].minute[index] = minutes
            }
          })
        });
    });
  }
}

studentsButtonListener();
setTimeListener(false, [{ hour: ["00","00"], minute: ["00","00"]}])