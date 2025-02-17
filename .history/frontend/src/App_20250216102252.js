import "./App.css";
import ButtonSuccessWave from "./components/ButtonSuccessWave/ButtonSuccessWave.jsx";
import AppRouter from "./router/AppRouter";
import { BrowserRouter as Router } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <ButtonSuccessWave />
      <h1>Bebas Neue</h1>
    </div>
  );
}

export default App;
