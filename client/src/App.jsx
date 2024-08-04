import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login'; // Import your component
import Signup from './Components/Singup';
import Dashboard from './Components/Dashboard';
// import Dashboard from './Dashboard'; // Import other components

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
