const arrowBtn = document.getElementById('arrow-btn');
const inputDay = document.getElementById('day');
const inputMonth = document.getElementById('month');
const inputYear = document.getElementById('year');
const outputDay = document.getElementById('cal-days');
const outputMonth = document.getElementById('cal-months');
const outputYear = document.getElementById('cal-years');
const inputBoxes = document.getElementsByClassName('input-box');
const prompts = document.querySelectorAll('.prompt'); // Select all prompt labels
const invalidMsg = document.getElementById('invalid-area');

function calculateAge() {
    const currDate = new Date();
    const currDay = currDate.getDate();
    const currMonth = currDate.getMonth() + 1; // getMonth() is zero-based
    const currYear = currDate.getFullYear();

    const birthDay = parseInt(inputDay.value);
    const birthMonth = parseInt(inputMonth.value);
    const birthYear = parseInt(inputYear.value);

    // Clear previous error state
    Array.from(inputBoxes).forEach(box => {
        box.classList.remove('input-box-empty');
    });

    prompts.forEach(prompt => {
        prompt.classList.remove('prompt-empty'); // Clear previous error state
    });

    // Check if any input is empty
    let hasEmptyFields = false;
    if (isNaN(birthDay) || isNaN(birthMonth) || isNaN(birthYear) || inputDay.value === '' || inputMonth.value === '' || inputYear.value === '') {
        hasEmptyFields = true;
        Array.from(inputBoxes).forEach(box => {
            if (box.value === '') {
                box.classList.add('input-box-empty');
                const prompt = document.querySelector(`label[for=${box.id}]`);
                if (prompt) {
                    prompt.classList.add('prompt-empty');
                    invalidMsg.innerText = 'This field is required';
                }
            }
        });
        return;
    }

    // Validate day, month, and year ranges
    let validDate = true;
    if (birthDay < 1 || birthDay > 31) {
        validDate = false;
        invalidMsg.innerText = 'Must be a valid day';
    }
    if (birthMonth < 1 || birthMonth > 12) {
        validDate = false;
        invalidMsg.innerText = 'Must be a valid month';
    }
    if (birthYear > currYear) {
        validDate = false;
        invalidMsg.innerText = 'Must be in the past';
    }

    if (!validDate) {
        Array.from(inputBoxes).forEach(box => {
            if (box.id === 'day' || box.id === 'month' || box.id === 'year') {
                box.classList.add('input-box-empty');
                const prompt = document.querySelector(`label[for=${box.id}]`);
                if (prompt) {
                    prompt.classList.add('prompt-empty');
                }
            }
        });
        return;
    }

    let years = currYear - birthYear;
    let months = currMonth - birthMonth;
    let days = currDay - birthDay;

    if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
        if (days < 0) {
            months--;
            const prevMonth = new Date(currYear, currMonth - 2, 0); // Last day of the previous month
            days += prevMonth.getDate();
        }
    }

    if (days < 0) {
        days += new Date(currYear, currMonth - 1, 0).getDate(); // Last day of the previous month
        months--;
    }

    // Append to screen
    invalidMsg.innerText='';
    outputDay.innerText = days;
    outputMonth.innerText = months;
    outputYear.innerText = years;
}

arrowBtn.addEventListener('click', calculateAge);
function handleKeyPress(event) {
    if (event.keyCode === 13) { // Enter key
        calculateAge();
    }
}
[inputDay, inputMonth, inputYear].forEach(input => {
    input.addEventListener('keypress', handleKeyPress);
});