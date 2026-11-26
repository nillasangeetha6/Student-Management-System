"use strict";

// Get HTML Elements

const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");

const search = document.getElementById("search");

const totalStudents = document.getElementById("totalStudents");
const activeStudents = document.getElementById("activeStudents");

const editIndex = document.getElementById("editIndex");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

let students = [];

// Load Saved Data

try {
    const savedData = localStorage.getItem("students");

    students = savedData ? JSON.parse(savedData) : [];

    if (!Array.isArray(students)) {
        students = [];
    }

} catch (error) {
    students = [];
}

// Save Student Data

function saveData() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}

// Update Dashboard

function updateDashboard() {

    totalStudents.textContent = students.length;

    activeStudents.textContent = students.length;

}

// Display Student Records

function displayStudents(data = students) {

    studentList.replaceChildren();

    if (data.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 7;
        cell.textContent = "No students found.";

        row.appendChild(cell);
        studentList.appendChild(row);

        return;
    }

    data.forEach(function(student) {

        const row = document.createElement("tr");

        const values = [
            student.name,
            student.roll,
            student.email,
            student.course,
            student.marks,
            student.year
        ];

        values.forEach(function(value) {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });

        const actionCell = document.createElement("td");

        // Edit Button

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function() {

            editStudent(student.id);

        });

        // Delete Button

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {

            deleteStudent(student.id);

        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        studentList.appendChild(row);

    });

}

// Add or Update Student

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const student = {

        id: editIndex.value || String(Date.now()),

        name: document.getElementById("name").value.trim(),

        roll: document.getElementById("roll").value.trim(),

        email: document.getElementById("email").value.trim(),

        course: document.getElementById("course").value.trim(),

        marks: Number(document.getElementById("marks").value),

        year: document.getElementById("year").value

    };

    // Validate Fields

    if (
        !student.name ||
        !student.roll ||
        !student.email ||
        !student.course ||
        !student.year
    ) {

        alert("Please fill all fields.");

        return;

    }

    if (
        !Number.isFinite(student.marks) ||
        student.marks < 0 ||
        student.marks > 100
    ) {

        alert("Please enter marks between 0 and 100.");

        return;

    }

    // Check Duplicate Roll Number

    const duplicate = students.some(function(s) {

        return (
            s.roll.toLowerCase() === student.roll.toLowerCase() &&
            String(s.id) !== String(student.id)
        );

    });

    if (duplicate) {

        alert("This Roll Number already exists!");

        return;

    }

    // Update Existing Student

    if (editIndex.value) {

        const index = students.findIndex(function(s) {

            return String(s.id) === String(student.id);

        });

        if (index !== -1) {

            students[index] = student;

        }

        alert("Student updated successfully!");

    }

    // Add New Student

    else {

        students.push(student);

        alert("Student added successfully!");

    }

    // Update Application

    saveData();

    updateDashboard();

    displayStudents();

    form.reset();

    resetEdit();

});

// Edit Student

function editStudent(id) {

    const student = students.find(function(s) {

        return String(s.id) === String(id);

    });

    if (!student) return;

    document.getElementById("name").value = student.name;

    document.getElementById("roll").value = student.roll;

    document.getElementById("email").value = student.email;

    document.getElementById("course").value = student.course;

    document.getElementById("marks").value = student.marks;

    document.getElementById("year").value = student.year;

    editIndex.value = student.id;

    submitBtn.textContent = "Update Student";

    document.getElementById("formTitle").textContent =
        "Edit Student";

    cancelBtn.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// Delete Student

function deleteStudent(id) {

    const confirmation = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmation) return;

    students = students.filter(function(s) {

        return String(s.id) !== String(id);

    });

    saveData();

    updateDashboard();

    displayStudents();

    if (String(editIndex.value) === String(id)) {

        form.reset();

        resetEdit();

    }

}

// Reset Edit Form

function resetEdit() {

    editIndex.value = "";

    submitBtn.textContent = "Add Student";

    document.getElementById("formTitle").textContent =
        "Add New Student";

    cancelBtn.hidden = true;

}

// Cancel Edit

cancelBtn.addEventListener("click", function() {

    form.reset();

    resetEdit();

});

// Search Students

search.addEventListener("input", function() {

    const keyword = search.value.toLowerCase();

    const filteredStudents = students.filter(function(student) {

        return (

            student.name.toLowerCase().includes(keyword) ||

            student.roll.toLowerCase().includes(keyword) ||

            student.email.toLowerCase().includes(keyword) ||

            student.course.toLowerCase().includes(keyword)

        );

    });

    displayStudents(filteredStudents);

});

// Initial Display

updateDashboard();

displayStudents();

console.log("Student Management System Loaded Successfully!");