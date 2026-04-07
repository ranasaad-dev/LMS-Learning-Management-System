import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/public/home/Home";
import Login from "./pages/public/login/Login";
import Register from "./pages/public/register/Register";
import CourseList from "./pages/public/listing/CourseList";
import CourseDetail from "./pages/public/detail/CourseDetail";
import About from "./pages/public/about/About";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import MyCourses from "./pages/roles/student/my-courses/MyCourses";
import StudentProfile from "./pages/roles/student/profile/StudentProfile";
import EditStudentProfile from "./pages/roles/student/edit-profile/EditStudentProfile";
import Learn from "./pages/roles/student/learn/Learn";
import CreateCourse from "./pages/roles/instructor/create-course/CreateCourse";
import CourseManage from "./pages/roles/instructor/manage-course/ManageCourse";
import AddLesson from "./pages/roles/instructor/add-lesson/AddLesson"
import UpdateCourse from "./pages/roles/instructor/edit-course/UpdateCourse";
import ManageUsers from "./pages/roles/admin/manage-user/ManageUsers";
import ManageCourses from "./pages/roles/admin/manage-course/ManageCourse";
import Notification from "./pages/public/notification/Notification";
import ReviewList from "./components/review/ReviewList";
import ViewStudents from "./pages/roles/instructor/view-students/ViewStudents";
import Otp from "./pages/public/otp/Otp";

function App() {
  return (
    <Router>

      <MainLayout>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/otp-verification/:tkn" element={<Otp />} />
          {/* Protected Routes */}
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="/NoticeBoard" element={<Notification />} />
          {/* Student Paths */}
          <Route path="/my-courses" element={<ProtectedRoute> <MyCourses /> </ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute> <StudentProfile /> </ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute> <EditStudentProfile /> </ProtectedRoute>} />
          <Route path="/learn/:courseId" element={<ProtectedRoute> <Learn /> </ProtectedRoute>} />
          {/* Instructor Paths */}
          <Route path="/create-course" element={<ProtectedRoute> <CreateCourse /> </ProtectedRoute>} />
          <Route path="/manage-course/:id" element={<ProtectedRoute> <CourseManage /> </ProtectedRoute>} />
          <Route path="/course/:id/add-lesson" element={<ProtectedRoute> <AddLesson /> </ProtectedRoute>} />
          <Route path="/course/:id/edit" element={<ProtectedRoute> <UpdateCourse /> </ProtectedRoute>} />
          <Route path="/course/:courseId/reviews" element={<ProtectedRoute> <ReviewList /> </ProtectedRoute>} />
        <Route path="/course/:id/students" element={<ProtectedRoute> <ViewStudents /> </ProtectedRoute>} />
          {/* Admin Paths */}
          <Route path="/dashboard/:id/users" element={<ProtectedRoute> <ManageUsers /> </ProtectedRoute>} />
          <Route path="/dashboard/:id/courses" element={<ProtectedRoute> <ManageCourses /> </ProtectedRoute>} />
        </Routes>

      </MainLayout>

    </Router>
  );
}

export default App;