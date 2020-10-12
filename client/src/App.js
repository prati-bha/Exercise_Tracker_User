import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar.component";
import ExercisesList from "./components/exercises-list.component";
import EditExercise from "./components/edit-exercise.component";
import CreateExercise from "./components/create-exercise.component";
import CreateUser from "./components/create-user.component";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NotFound from "./components/404/NotFound";
import Profile from "./components/User/Profile";

//Lazy load components
// const EditExercise = React.lazy(() =>
//   import("./components/edit-exercise.component")
// );

// const CreateExercise = React.lazy(() =>
//   import("./components/create-exercise.component")
// );

// const CreateUser = React.lazy(() =>
//   import("./components/create-user.component")
// );

function App() {
  return (
    <div className="container">
      <Router>
        <Navbar />
        <br />
        <Switch>
          <Route
            path="/list"
            exact
            render={() =>
              localStorage.getItem("token") === null ? (
                <Redirect to="/" />
              ) : (
                <ExercisesList />
              )
            }
            // component={ExercisesList}
          />
          <Route
            path="/edit/:id"
            render={() =>
              localStorage.getItem("token") === null ? (
                <Redirect to="/" />
              ) : (
                <EditExercise />
              )
            }

            // component={EditExercise}
            // render={() => (
            //   <Suspense fallback={() => <div>Loading...</div>}>
            //     <EditExercise />
            //   </Suspense>
            // )}
          />
          <Route
            path="/create"
            render={() =>
              localStorage.getItem("token") === null ? (
                <Redirect to="/" />
              ) : (
                <CreateExercise />
              )
            }

            // component={CreateExercise}
            // render={() => (
            //   <Suspense fallback={() => <div>Loading...</div>}>
            //     <CreateExercise />
            //   </Suspense>
            // )}
          />
          <Route
            path="/user"
            render={() =>
              localStorage.getItem("token") === null ? (
                <Redirect to="/" />
              ) : (
                <CreateUser />
              )
            }

            // component={CreateUser}
            // render={() => (
            //   <Suspense fallback={() => <div>Loading...</div>}>
            //     <CreateUser />
            //   </Suspense>
            // )}
          />
          <Route
            path="/profile"
            render={() =>
              localStorage.getItem("token") === null ? (
                <Redirect to="/" />
              ) : (
                <Profile />
              )
            }

            // component={CreateUser}
            // render={() => (
            //   <Suspense fallback={() => <div>Loading...</div>}>
            //     <CreateUser />
            //   </Suspense>
            // )}
          />

          <Route path="/" component={Login} exact />
          <Route path="/signUp" component={Signup} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
