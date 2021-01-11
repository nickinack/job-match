import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";

import Navbar from "./components/navbar.component";
import Intro from "./components/intro.component"
import Register from "./components/register.component";
import viewApplicants from "./components/view-applicant.component";
import viewJobs from "./components/view-job.component";

function App() {
  return (
    <Router>
    <div className="container">
      <Navbar />
      <br />
      <Route path="/" exact component={Intro} />
      <Route path="/register" component={Register} />
      <Route path="/applicant" component={viewApplicants} />
      <Route path="/jobs" component={viewJobs} />
    </div>
    </Router>
  );
}

export default App;
