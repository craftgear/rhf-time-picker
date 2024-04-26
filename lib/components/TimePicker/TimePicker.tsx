import {
  useState,
  useEffect,
  useRef,
  PropsWithChildren,
  forwardRef,
} from "react";
import { FaRegClock } from "react-icons/fa6";

type Props = {
  defaultValue: string;
  onChange: (time: string) => void;
  hourRange?: number[];
  minuteRange?: number[];
};

const HOURS = [...Array(24).keys()].filter((x: number) => x >= 6 && x <= 22);
const MINUTES = [...Array(60).keys()].filter((x: number) => x % 5 === 0);

export const TimePicker = forwardRef(
  (
    { defaultValue, onChange, hourRange = HOURS, minuteRange = MINUTES }: Props,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const [hour, minute] = defaultValue.split(":").map((x) => parseInt(x, 10));

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState(hour);
    const [selectedMinute, setSelectedMinute] = useState(minute);

    const setSelectedTime = (hour: number, minute: number) => {
      const paddedHour = `0${hour}`.slice(-2);
      const paddedMinute = `0${minute}`.slice(-2);
      onChange(`${paddedHour}:${paddedMinute}`);
    };

    return (
      <div
        className="relative flex items-center space-x-1 border border-d-gray-80  rounded p-2 select-none text-right"
        onClick={() => !isPopupOpen && setIsPopupOpen(true)}
      >
        <input
          type="hidden"
          ref={ref}
          value={`${selectedHour}:${selectedMinute}`}
        />
        <div className="flex space-x-2 items-center px-1">
          <span>
            {selectedHour}:{`0${selectedMinute}`.slice(-2)}
          </span>
          <FaRegClock />
        </div>
        {isPopupOpen && (
          <Popup setIsPopupOpen={setIsPopupOpen}>
            <Selector
              name="hour"
              optionValues={hourRange}
              selectedValue={selectedHour}
              setSelectedValue={(hour) => {
                setSelectedHour(hour);
                setSelectedTime(hour, selectedMinute);
              }}
            />
            <Selector
              name="minute"
              optionValues={minuteRange}
              selectedValue={selectedMinute}
              setSelectedValue={(minute) => {
                setSelectedMinute(minute);
                setSelectedTime(selectedHour, minute);
                setIsPopupOpen(false);
              }}
            />
          </Popup>
        )}
      </div>
    );
  },
);

const Popup = ({
  setIsPopupOpen,
  children,
}: PropsWithChildren<{
  setIsPopupOpen: (x: boolean) => void;
}>) => {
  useEffect(() => {
    const handleClick = (e: Event) => {
      if (e.target instanceof HTMLElement) {
        if (e.target.closest(".relative")) {
          return;
        }
        setIsPopupOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      className={`absolute z-10 top-10 left-0 max-h-[200px] bg-white border border-d-gray-80 shadow-md flex `}
    >
      {children}
    </div>
  );
};

type SelectorProps = {
  name: string;
  optionValues: number[];
  selectedValue: number;
  setSelectedValue: (value: number) => void;
};

const Selector = ({
  name,
  optionValues,
  selectedValue,
  setSelectedValue,
}: SelectorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLOptionElement>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: "center" });
    }
  }, [selectedRef]);

  return (
    <div
      ref={ref}
      className="overflow-y-auto snap-always snap-y snap-mandatory"
      style={{ scrollbarWidth: "thin" }}
      onMouseEnter={() => {
        if (ref.current) {
          ref.current.focus();
        }
      }}
    >
      {optionValues.map((x) => (
        <option
          key={`${name}-${x}`}
          className={`py-1 px-2 snap-center ${selectedValue === x ? "bg-d-blue-50 text-white" : ""} `}
          value={x}
          onClick={(e) => {
            e.preventDefault();
            setSelectedValue(x);
          }}
          ref={selectedValue === x ? selectedRef : null}
        >
          {x}
        </option>
      ))}
    </div>
  );
};
