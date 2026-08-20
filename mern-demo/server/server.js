const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();

const PORT = process.env.PORT || 5000;

// Cho phép React Frontend từ Codespaces kết nối đến Backend
app.use(
    cors({
        origin: "https://laughing-doodle-wr9gpgpx6px5h99xj-5173.app.github.dev",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"]
    })
);

// Cho phép Backend đọc dữ liệu JSON
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.log("MongoDB connection error:", err));

// API kiểm tra Server
app.get("/", (req, res) => {
    res.send("Express Server is running!");
});

// API Hello
app.get("/api/hello", (req, res) => {
    res.send("Backend dang hoat dong!");
});

// Câu 36: API GET danh sách sinh viên
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Câu 37: API POST thêm sinh viên
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Câu 38: API PUT cập nhật sinh viên
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Câu 39: API DELETE xóa sinh viên
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully",
            student: student
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Khởi động Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});