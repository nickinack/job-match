import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";

import Navbar from "./components/navbar.component";
import Intro from "./components/intro.component"
import Register from "./components/register.component";
import login from "./components/login.component";
import Dashboard from "./components/dashboard.component";
import JobView from "./components/jobview.component";
import JobAdd from "./components/jobadd.component";

function App() {
  return (
    <Router>
    <div className="container">
      <Navbar />
      <br />
      <Route path="/" exact component={Intro} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/jobs" component={JobView} />
      <Route path="/jobadd" component={JobAdd} />
    </div>
    </Router>
  );
}

export default App;
