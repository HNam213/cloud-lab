import { useEffect, useState } from "react";
import "./App.css";

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
      const response = await fetch(
        "http://localhost:5000/api/students"
      );

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    }
  };

  // Khi mở trang
  useEffect(() => {
    loadStudents();
  }, []);

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
      const response = await fetch(
        "http://localhost:5000/api/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(student),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Thêm sinh viên thành công!");

        clearForm();

        // Tải lại danh sách
        loadStudents();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
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
      const response = await fetch(
        `http://localhost:5000/api/students/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(student),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Cập nhật sinh viên thành công!");

        clearForm();

        setEditId(null);

        // Tải lại danh sách
        loadStudents();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
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
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Xóa sinh viên thành công!");

        // Tải lại danh sách
        loadStudents();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
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
  // Xóa dữ liệu trên form
  // =========================
  const clearForm = () => {
    setMssv("");
    setHoTen("");
    setEmail("");
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

  return (
    <div>
      <h1>
        {editId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
      </h1>

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

      <h1>Danh sách sinh viên</h1>

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
                  onClick={() => editStudent(student)}
                >
                  Sửa
                </button>

                {" "}

                <button
                  onClick={() =>
                    deleteStudent(student._id)
                  }
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