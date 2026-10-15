import { useEffect, useState } from "react";
import "./App.css";

// API thông qua Nginx Reverse Proxy
const API_URL = "/api/students";

// Phiên bản ứng dụng
const APP_VERSION = "v2.0";

function App() {
  const [students, setStudents] = useState([]);

  const [mssv, setMssv] = useState("");
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");

  // Lưu ID sinh viên đang sửa
  const [editId, setEditId] = useState(null);

  // =========================
  // GET - Lấy danh sách sinh viên
  // =========================
  const loadStudents = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    }
  };

  // Tải danh sách khi mở trang
  useEffect(() => {
    loadStudents();
  }, []);

  // =========================
  // Xóa dữ liệu trên form
  // =========================
  const clearForm = () => {
    setMssv("");
    setHoTen("");
    setEmail("");
  };

  // =========================
  // POST - Thêm sinh viên
  // =========================
  const addStudent = async () => {
    const student = {
      studentId: mssv,
      name: hoTen,
      email: email,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Thêm sinh viên thành công!");
        clearForm();
        await loadStudents();
      } else {
        alert("Lỗi: " + (data.message || "Không thể thêm sinh viên"));
      }
    } catch (error) {
      console.error("Lỗi thêm sinh viên:", error);
      alert("Không thể kết nối đến Server!");
    }
  };

  // =========================
  // PUT - Cập nhật sinh viên
  // =========================
  const updateStudent = async () => {
    const student = {
      studentId: mssv,
      name: hoTen,
      email: email,
    };

    try {
      const response = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cập nhật sinh viên thành công!");
        clearForm();
        setEditId(null);
        await loadStudents();
      } else {
        alert("Lỗi: " + (data.message || "Không thể cập nhật sinh viên"));
      }
    } catch (error) {
      console.error("Lỗi cập nhật sinh viên:", error);
      alert("Không thể kết nối đến Server!");
    }
  };

  // =========================
  // DELETE - Xóa sinh viên
  // =========================
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sinh viên này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Xóa sinh viên thành công!");
        await loadStudents();
      } else {
        alert("Lỗi: " + (data.message || "Không thể xóa sinh viên"));
      }
    } catch (error) {
      console.error("Lỗi xóa sinh viên:", error);
      alert("Không thể kết nối đến Server!");
    }
  };

  // =========================
  // Chọn sinh viên để sửa
  // =========================
  const editStudent = (student) => {
    setMssv(student.studentId);
    setHoTen(student.name);
    setEmail(student.email);
    setEditId(student._id);
  };

  // =========================
  // Submit form
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      updateStudent();
    } else {
      addStudent();
    }
  };

  // =========================
  // Giao diện phiên bản v2.0
  // =========================
  return (
    <div>
      <div className="version-banner">
        <span>QUẢN LÝ SINH VIÊN</span>
        <span className="version-badge">
          Phiên bản {APP_VERSION}
        </span>
      </div>

      <h1>{editId ? "Cập nhật sinh viên" : "Thêm sinh viên"}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>MSSV: </label>
          <input
            type="text"
            value={mssv}
            onChange={(e) => setMssv(e.target.value)}
            placeholder="Nhập MSSV"
            required
          />
        </div>

        <br />

        <div>
          <label>Họ tên: </label>
          <input
            type="text"
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
            placeholder="Nhập họ tên"
            required
          />
        </div>

        <br />

        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            required
          />
        </div>

        <br />

        <button type="submit">
          {editId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              clearForm();
              setEditId(null);
            }}
          >
            Hủy
          </button>
        )}
      </form>

      <hr />

      <h1>Hiển thị danh sách sinh viên</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>
                <button
                  type="button"
                  onClick={() => editStudent(student)}
                >
                  Sửa
                </button>{" "}

                <button
                  type="button"
                  onClick={() => deleteStudent(student._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;