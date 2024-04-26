import "./App.css";
import { TimePicker } from "../lib/main";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor="hoge">hoge</label>
      <input name="hoge" type="text" id="hoge" />
      <label htmlFor="time" type="text">
        時刻
      </label>
      <TimePicker
        id="time"
        name="timePicker"
        defaultValue="10:11"
        onChange={(x) => console.log(x)}
      />
    </div>
  );
}

export default App;
