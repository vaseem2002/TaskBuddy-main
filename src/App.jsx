import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import TaskListView from "./component/TaskListView";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Home page */}
        <Route path="/" element={<Home />} />

        {/* Route for the Task List View page */}
        <Route path="/tasks" element={<TaskListView />} />
      </Routes>
    </Router>
  );
}

export default App;