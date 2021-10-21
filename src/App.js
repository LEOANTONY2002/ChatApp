import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Components/Login";
import Chat from "./Components/Chat";
import { useStateValue } from "./StateProvider";
import CreateProfile from "./Components/CreateProfile";
import Profile from "./Components/Profile";

function App() {
  const [{ user }] = useStateValue();

  navigator.serviceWorker.addEventListener("message", (mes) =>
    console.log(mes)
  );

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/chat">
            <Chat />
          </Route>
          <Route path="/createProfile">
            <CreateProfile />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            {user ? (
              <>
                {" "}
                <Chat />
              </>
            ) : (
              <Login />
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
