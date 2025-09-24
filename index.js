import express from "express";
const app = express();
app.use(express.json());//json data parser

let students = [
    {
        id: 1,
        name: "Ali",
        email: "ali@gmail.com",
        age: 20
    },
    {
        id: 2,
        name: "Sania",
        email: "sania@gmail.com",
        age: 19
    }
];

// Validation helper
function validateStudent(student) {
    if (!student.name || student.name.trim() === "") {
        return "Name cannot be empty";
    }
    if (!student.email.includes("@")) {
        return "Email must include @";
    }
    if (student.age <= 0) {
        return "Age must be greater than 0";
    }
    return null;
}

// Show all students
app.get("/students", (req, res) => {
    res.json(students);
});

// Show single student by ID
app.get("/students/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send("Student not found");
    res.json(student);
});

// Add new student
app.post("/students", (req, res) => {
    const error = validateStudent(req.body);
    if (error) return res.status(400).send(error);

    const newStudent = {
        id: students.length + 1,
        ...req.body
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// Update student
app.put("/students/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send("Student not found");

    const error = validateStudent(req.body);
    if (error) return res.status(400).send(error);

    student.name = req.body.name;
    student.email = req.body.email;
    student.age = req.body.age;

    res.json(student);
});

// Delete student
app.delete("/students/:id", (req, res) => {
    students = students.filter(s => s.id !== parseInt(req.params.id));
    res.send("Student deleted");
});

app.get("/students/search", (req, res) => {
  console.log("search route hit with:", req.query);  // <-- add this
  const nameQuery = req.query.name?.toLowerCase();
  if (!nameQuery) return res.status(400).send("Provide a name to search");

  const result = students.filter(s =>
    s.name.toLowerCase().includes(nameQuery)
  );

  if (result.length === 0) return res.status(404).send("Student not found");
  res.json(result);
});





app.listen(4000, () => console.log("Server running on port 4000"));

