const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();
const PORT = process.env.PORT || 5000;

// =========================
// CORS
// =========================
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://laughing-doodle-wr9gpgpx6px5h99xj-5173.app.github.dev",
            "https://mern-frontend-235991.onrender.com"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"]
    })
);

// =========================
// Middleware
// =========================

// Cho phép Backend đọc dữ liệu JSON
app.use(express.json());

// Ghi log tất cả request gửi đến Backend
app.use((req, res, next) => {
    const time = new Date().toISOString();

    console.log(
        `[${time}] ${req.method} ${req.originalUrl}`
    );

    // Ghi log trạng thái phản hồi sau khi hoàn tất
    res.on("finish", () => {
        console.log(
            `[${time}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`
        );
    });

    next();
});

// =========================
// Kết nối MongoDB Atlas
// =========================
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });

// =========================
// API kiểm tra Server
// =========================
app.get("/", (req, res) => {
    res.send("Express Server is running!");
});

// =========================
// API Hello
// =========================
app.get("/api/hello", (req, res) => {
    res.send("Backend dang hoat dong!");
});

// =========================
// GET - Lấy danh sách sinh viên
// =========================
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);
    } catch (error) {
        console.error("Lỗi lấy danh sách sinh viên:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});

// =========================
// POST - Thêm sinh viên
// =========================
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);

        console.log("Đã thêm sinh viên:", student._id);

        res.status(201).json(student);
    } catch (error) {
        console.error("Lỗi thêm sinh viên:", error.message);

        res.status(400).json({
            message: error.message
        });
    }
});

// =========================
// PUT - Cập nhật sinh viên
// =========================
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        console.log("Đã cập nhật sinh viên:", student._id);

        res.json(student);
    } catch (error) {
        console.error("Lỗi cập nhật sinh viên:", error.message);

        res.status(400).json({
            message: error.message
        });
    }
});

// =========================
// DELETE - Xóa sinh viên
// =========================
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        console.log("Đã xóa sinh viên:", student._id);

        res.json({
            message: "Student deleted successfully",
            student: student
        });
    } catch (error) {
        console.error("Lỗi xóa sinh viên:", error.message);

        res.status(400).json({
            message: error.message
        });
    }
});

// =========================
// Khởi động Server
// =========================
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
