import { useState } from "react";
import { useForm } from "react-hook-form";

import "./App.css";
import { TimePicker } from "../lib/main";

function App() {
  const { setValue, handleSubmit } = useForm();
  const [selectedTime, setSelectedTime] = useState<string>("");

  const onSubmit = (data: any) => {
    setSelectedTime(data.time);
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
        <div>Selected Time: {selectedTime}</div>
        <TimePicker name="time" setValue={setValue} />
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default App;
