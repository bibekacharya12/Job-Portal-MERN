import { Routes, Route } from "react-router-dom";
import RecruiterLogin from "./Components/RecruiterLogin";
import Applications from "./Pages/Applications";
import ApplyJob from "./Pages/ApplyJob";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import AddJob from "./Pages/AddJob";
import ManageJobs from "./Pages/ManageJobs";
import ViewApplications from "./Pages/ViewApplications";
import { useContext } from "react";
import { AppContext } from "./Context/AppContext";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { showRecruiterLogin, companyToken } = useContext(AppContext);
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />

        {companyToken ? (
          <>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="add-job" element={<AddJob />} />
              <Route path="manage-jobs" element={<ManageJobs />} />
              <Route path="view-applications" element={<ViewApplications />} />
            </Route>
          </>
        ) : null}
      </Routes>
    </div>
  );
};
export default App;
