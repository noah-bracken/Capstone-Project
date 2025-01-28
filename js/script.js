/* This is the function that uniquely identifies each button and the associated class
as well as what it will do when the button is clicked */
function classButtonListeners() {
    const classButton = document.querySelectorAll('.Class-Button') // gets all html elements with ".Class-Button" as the class
    classButton.forEach((button) => { // for loop to cycle through all the buttons
        button.addEventListener('click', (event) =>  { //adds an event on clicking the button
            const classID = event.target.getAttribute('data-id'); //gets the unique information associated with the button. Later will be read from the DB
            displayClassInfo(classID);
        });
    });
}
classButtonListeners();
function displayClassInfo(classID) {
    console.log(`Displaying info for class with ID: ${classID}`); //Make sure it works by logging it
}