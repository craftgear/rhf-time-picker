import "./App.css";
import { TimePicker } from "../lib/main";
import { useForm } from "react-hook-form";

function App() {
  const { setValue, handleSubmit } = useForm();

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit((data: unknown) => {
      console.log(data);
    })();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <form>
        <label htmlFor="hoge">hoge</label>
        <input name="hoge" type="text" id="hoge" />
        <label htmlFor="time">時刻</label>
        <TimePicker
          id="timepicker"
          defaultValue="10:11"
          name="time"
          setValue={setValue}
        />
        <input type="submit" onClick={onSubmit} style={{ padding: 20 }} />
      </form>
    </div>
  );
}

export default App;
