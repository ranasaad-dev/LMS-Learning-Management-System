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
import Faqs from "./pages/public/Faqs";
import TeachOnLms from "./pages/public/teach_on_lms/TeachOnLms";
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
          <Route path="/faq" element={<Faqs />} />
          <Route path="/become-instructor" element={<TeachOnLms />} />
          {/* Protected Routes */}
          <Route path="/NoticeBoard" element={<Notification />} />
          <Route path="/*" element={
            <ProtectedRoute>
              {/* Student Paths */}
              <Route path="/dashboard/:id" element={<Dashboard />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/edit-profile" element={<EditStudentProfile />} />
              <Route path="/learn/:courseId" element={<Learn />} />
              {/* Instructor Paths */}
              <Route path="/create-course" element={<CreateCourse />} />
              <Route path="/manage-course/:id" element={<CourseManage />} />
              <Route path="/course/:id/add-lesson" element={<AddLesson />} />
              <Route path="/course/:id/edit" element={<UpdateCourse />} />
              <Route path="/course/:courseId/reviews" element={<ReviewList />} />
              <Route path="/course/:id/students" element={<ViewStudents />} />
              {/* Admin Paths */}
              <Route path="/dashboard/:id/users" element={<ManageUsers />} />
              <Route path="/dashboard/:id/courses" element={<ManageCourses />} /> 
            </ProtectedRoute>
          } />

        </Routes>

      </MainLayout>

    </Router>
  );
}

export default App;