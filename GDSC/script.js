document.addEventListener("DOMContentLoaded", loadHabits);

function addHabit() {
    let habitInput = document.getElementById("habit-input");
    let habitName = habitInput.value.trim();

    if (habitName === "") {
        alert("Please enter a habit!");
        return;
    }

    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    habits.push({ name: habitName, completed: false });
    localStorage.setItem("habits", JSON.stringify(habits));

    habitInput.value = "";
    loadHabits();
}

function loadHabits() {
    let habitList = document.getElementById("habit-list");
    habitList.innerHTML = "";

    let habits = JSON.parse(localStorage.getItem("habits")) || [];

    habits.forEach((habit, index) => {
        let li = document.createElement("li");
        li.classList.add("habit-item");
        if (habit.completed) li.classList.add("completed");

        li.innerHTML = `
            <span>${habit.name}</span>
            <button onclick="toggleHabit(${index})">${habit.completed ? "Undo" : "Done"}</button>
            <button onclick="deleteHabit(${index})">❌</button>
        `;

        habitList.appendChild(li);
    });

    updateProgress();
}

function toggleHabit(index) {
    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    habits[index].completed = !habits[index].completed;
    localStorage.setItem("habits", JSON.stringify(habits));
    loadHabits();
}

function deleteHabit(index) {
    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    habits.splice(index, 1);
    localStorage.setItem("habits", JSON.stringify(habits));
    loadHabits();
}

function updateProgress() {
    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    let completedCount = habits.filter(habit => habit.completed).length;
    let totalHabits = habits.length;

    let progress = document.getElementById("progress");
    let progressPercentage = totalHabits === 0 ? 0 : (completedCount / totalHabits) * 100;
    progress.style.width = progressPercentage + "%";
}

document.addEventListener("DOMContentLoaded", () => {
    loadHabits();
    loadStreakCalendar();
});

// Function to load the streak calendar
function loadStreakCalendar() {
    let calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = ""; // Clear previous entries

    let today = new Date();
    let daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    let completedDays = JSON.parse(localStorage.getItem("streakDays")) || [];

    for (let day = 1; day <= daysInMonth; day++) {
        let dayDiv = document.createElement("div");
        dayDiv.classList.add("calendar-day");
        dayDiv.textContent = day;

        let dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${day}`;
        if (completedDays.includes(dateKey)) {
            dayDiv.classList.add("completed");
        }

        calendarGrid.appendChild(dayDiv);
    }
}

// Function to mark today as completed in the streak calendar
function markStreak() {
    let today = new Date();
    let dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    let completedDays = JSON.parse(localStorage.getItem("streakDays")) || [];
    if (!completedDays.includes(dateKey)) {
        completedDays.push(dateKey);
        localStorage.setItem("streakDays", JSON.stringify(completedDays));
        loadStreakCalendar();
    }
}

// Modify toggleHabit() to update the streak calendar when a habit is completed
function toggleHabit(index) {
    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    habits[index].completed = !habits[index].completed;
    localStorage.setItem("habits", JSON.stringify(habits));
    
    if (habits[index].completed) {
        markStreak();
    }

    loadHabits();
}

