const express = require("express");
const path = require("path");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Anushkagupta13",
    database: "healthcare_db"
});

db.connect((err) => {
    if (err) {
        console.log("MySQL connection failed:", err.message);
    } else {
        console.log("MySQL connected successfully!");
    }
});

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get all patients
app.get("/patients", (req, res) => {
    db.query("SELECT * FROM patients", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});
// Add a new patient
app.post("/api/patients", (req, res) => {
    const { name, age, gender, phone, problem } = req.body;

    const sql = `
        INSERT INTO patients (name, age, gender, phone, problem)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, age, gender, phone, problem], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Failed to add patient" });
        }

        res.json({
            message: "Patient added successfully",
            patient_id: result.insertId
        });
    });
});

// Get all patients
app.get("/api/patients", (req, res) => {
    db.query("SELECT * FROM patients ORDER BY patient_id DESC", (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Failed to get patients" });
        }

        res.json(results);
    });
});
// Add a doctor
app.post("/api/doctors", (req, res) => {
    const { name, specialization, phone, availability } = req.body;

    const sql = `
        INSERT INTO doctors (name, specialization, phone, availability)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, specialization, phone, availability],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: "Failed to add doctor"
                });
            }

            res.json({
                message: "Doctor added successfully",
                doctor_id: result.insertId
            });
        }
    );
});

// Get all doctors
app.get("/api/doctors", (req, res) => {
    db.query(
        "SELECT * FROM doctors ORDER BY doctor_id DESC",
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: "Failed to get doctors"
                });
            }

            res.json(results);
        }
    );
});
// Add an appointment
app.post("/api/appointments", (req, res) => {
    const {
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time
    } = req.body;

    const sql = `
        INSERT INTO appointments
        (patient_id, doctor_id, appointment_date, appointment_time)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [patient_id, doctor_id, appointment_date, appointment_time],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: "Failed to add appointment"
                });
            }

            res.json({
                message: "Appointment added successfully",
                appointment_id: result.insertId
            });
        }
    );
});

// Get all appointments
app.get("/api/appointments", (req, res) => {
    const sql = `
        SELECT
            appointments.appointment_id,
            patients.name AS patient_name,
            doctors.name AS doctor_name,
            doctors.specialization,
            appointments.appointment_date,
            appointments.appointment_time,
            appointments.status
        FROM appointments
        JOIN patients
            ON appointments.patient_id = patients.patient_id
        JOIN doctors
            ON appointments.doctor_id = doctors.doctor_id
        ORDER BY appointments.appointment_id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Failed to get appointments"
            });
        }

        res.json(results);
    });
});
// Add a medical record
app.post("/api/medical-records", (req, res) => {
    const {
        patient_id,
        diagnosis,
        symptoms,
        medicines,
        notes,
        record_date
    } = req.body;

    const sql = `
        INSERT INTO medical_records
        (patient_id, diagnosis, symptoms, medicines, notes, record_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [patient_id, diagnosis, symptoms, medicines, notes, record_date],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: "Failed to add medical record"
                });
            }

            res.json({
                message: "Medical record added successfully",
                record_id: result.insertId
            });
        }
    );
});

// Get all medical records
app.get("/api/medical-records", (req, res) => {
    const sql = `
        SELECT
            medical_records.record_id,
            patients.name AS patient_name,
            medical_records.diagnosis,
            medical_records.symptoms,
            medical_records.medicines,
            medical_records.notes,
            medical_records.record_date
        FROM medical_records
        JOIN patients
            ON medical_records.patient_id = patients.patient_id
        ORDER BY medical_records.record_id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Failed to get medical records"
            });
        }

        res.json(results);
    });
});
app.listen(PORT, () => {
    console.log("Healthcare Access System is running!");
    console.log(`Open http://localhost:${PORT} in your browser`);
});