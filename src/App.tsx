import "./App.css";
import { TicTacToe } from "./components/TicTacToe";
import ReactGA from "react-ga4";

if (import.meta.env.MODE !== "development") {
  ReactGA.initialize("G-0MP0S0WEGZ");
}

function App() {
  return <TicTacToe />;
}

export default App;
