const classData = [ // dummy data
    { id: 1, name: 'Math 101', students: ['Alice', 'Bob', 'Sara', 'Noah', 'Michael', 'Owen'] },
  ];

const root = document.getElementById("students") // Get where I want the list of students to be added to
const studentslist = document.createElement('ul');

classData.forEach((classItem) => {
    const studentList = document.createElement('ul'); //creates a list of students and the html
    classItem.students.forEach((student) => { // loops through each student in classdata
      const listItem = document.createElement('li'); // creates the html list for each student
      listItem.textContent = student;
      studentList.appendChild(listItem);
    });
    root.appendChild(studentList); // adds the new html where specified
  });