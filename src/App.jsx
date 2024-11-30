import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import PrivateRoute from './components/PrivateRoute';
import ProjectDetails from './pages/ProjectDetails';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
             <Projects />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
