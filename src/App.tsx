import "./App.css";
import { TimePicker } from "../lib/main";
import { useForm } from "react-hook-form";

function App() {
  const { setValue, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TimePicker name="time" setValue={setValue} />
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default App;
