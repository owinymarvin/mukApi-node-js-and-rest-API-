// console.log('Hello from my app here');
const express = require('express');
const { connectToDb, getDb } = require('./db');

// initialise the app
const app = express();

//setup the middleware 
app.use(express.json());

//Parse incoming Json


// connect to DB
let db;
connectToDb((err) => {
    if (!err) {
        app.listen(3001, () => {
            console.log('server is running on port 3001');
        })
        db = getDb();
    } else {
        console.log('failed to start server');
    }
});


// creating RESTFUL API endpoints

// define API routes here
app.get('/api/students', (req, res) => {
    // use pagination to limit number of responses, only return small data
    // request ://localhost:3001/api/students = page 0 = ://localhost:3001/api/students?page=0
    // const page = req.query.p || 0;
    // page = p
    const page = req.query.page || 0;
    let students = [];
    const studentsPerPage = 10;
    db.collection('students')
        .find()
        .sort({ id: 1 })
        .skip(page * studentsPerPage)
        .limit(studentsPerPage)
        .forEach(element =>
            students.push(element))
        .then(() => {
            res.status(200).json(students)
        })
        .catch(() => {
            res.status(500).json({ msg: 'Error getting students' });
        })

})

app.get('/api/students/:id', (req, res) => {
    const StudentId = parseInt(req.params.id);
    if (!isNaN(StudentId)) {
        // number hence show student info
        db.collection('students')
            .findOne({ id: StudentId })
            .then((element) => {
                if (element) {
                    res.status(200).json(element);
                } else {
                    res.status(404).json({ msg: 'Student not found' });
                }
            })
            .catch(() => {
                res.status(500).json({ msg: 'Error getting students info' });
            })
    }

    else {
        // error. produce error message 
        res.status(400).json({ Error: 'Error: Student ID must be a number' });
    }
}
)

// adding 
app.post('/api/students', (req, res) => {
    const student = req.body;
    db.collection('students')
        .insertOne(student)
        .then((result) => {
            res.status(201).json(result);
        })
        .catch(() => {
            res.status(500).json({ msg: "Error creating a student" });
        })
})

// updating
app.patch('/api/students/:id', (req, res) => {
    let updates = req.body;
    const StudentId = parseInt(req.params.id);
    if (!isNaN(StudentId)) {
        db.collection('students')
            .updateOne(
                { id: StudentId },
                { $set: updates }
            )
            .then((result) => {
                res.status(200).json({ result });
            })
            .catch(() => {
                res.status(500).json({ msg: 'Error updating student' })
            })
    } else {
        res.status(400).json({ Error: 'Error: STudent ID must have a number' });
    }

})


// delete api route
app.delete('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    if (!isNaN(studentId)) {
        // delete
        db.collection('students')
            .deleteOne({ id: studentId })
            .then((result) => {
                res.status(200).json({ result })
            })
            .catch(() => {
            res.status(500).json({msg:'Error: Failed to delete student'})
        })
    } else {
        res.status(400).json({ Error: 'Error: Student Id must be a number ' });
    }
})