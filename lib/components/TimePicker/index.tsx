import {
  useState,
  useEffect,
  useRef,
  PropsWithChildren,
  forwardRef,
  InputHTMLAttributes,
} from "react";
import { FaRegClock } from "react-icons/fa6";
import styles from "./styles.module.css";

type Props = {
  defaultValue: string;
  onChange: (time: string) => void;
  hourRange?: number[];
  showClockIcon?: boolean;
  minStep?: number;
} & InputHTMLAttributes<HTMLInputElement>;

const HOURS = [...Array(24).keys()].filter((x: number) => x >= 6 && x <= 22);
const MINUTES = [...Array(60).keys()].filter((x: number) => x % 5 === 0);
const TIME_PICKER_CLASS = "time-picker";

export const TimePicker = forwardRef(
  (props: Props, ref: React.Ref<HTMLInputElement>) => {
    const {
      defaultValue,
      onChange,
      hourRange = HOURS,
      minuteRange = MINUTES,
      ...restProps
    } = props;
    const popupRef = useRef<HTMLDivElement>(null);
    const [hour, minute] = defaultValue.split(":").map((x) => parseInt(x, 10));

    const [isPopupOpen, setIsPopupOpen] = useState(true);
    const [selectedHour, setSelectedHour] = useState(hour);
    const [selectedMinute, setSelectedMinute] = useState(minute);

    const setSelectedTime = (hour: number, minute: number) => {
      const paddedHour = `0${hour}`.slice(-2);
      const paddedMinute = `0${minute}`.slice(-2);
      onChange(`${paddedHour}:${paddedMinute}`);
    };

    return (
      <div
        className={`${styles["time-picker"]} ${TIME_PICKER_CLASS}`}
        tabIndex={0}
        onFocus={() => setIsPopupOpen(true)}
        {...restProps}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsPopupOpen(false);
          }
        }}
      >
        <input
          type="hidden"
          style={{ display: "none" }}
          ref={ref}
          value={`${selectedHour}:${selectedMinute}`}
          onChange={onChange}
        />
        <div
          className={`${styles.display} ${isPopupOpen ? styles.hide : ""} `}
          onClick={() => {
            setIsPopupOpen(true);
          }}
        >
          <span>
            {` ${selectedHour}`.slice(-2)}:{`0${selectedMinute}`.slice(-2)}
          </span>
          <FaRegClock />
        </div>
        {isPopupOpen && (
          <Popup
            setIsPopupOpen={setIsPopupOpen}
            ref={popupRef}
            onBlur={() => {
              setIsPopupOpen(false);
            }}
          >
            <Selector
              name="hour"
              optionValues={hourRange}
              selectedValue={selectedHour}
              setSelectedValue={(hour) => {
                setSelectedHour(hour);
                setSelectedTime(hour, selectedMinute);
              }}
              getFocus={true}
            />
            <Selector
              name="minute"
              optionValues={minuteRange}
              selectedValue={selectedMinute}
              setSelectedValue={(minute) => {
                setSelectedMinute(minute);
                setSelectedTime(selectedHour, minute);
              }}
              getFocus={false}
            />
          </Popup>
        )}
      </div>
    );
  },
);

type PopupProps = PropsWithChildren<{
  setIsPopupOpen: (x: boolean) => void;
  onBlur?: () => void;
}>;

const Popup = forwardRef<HTMLDivElement, PopupProps>(
  ({ setIsPopupOpen, onBlur, children }: PopupProps, ref) => {
    useEffect(() => {
      const handleClick = (e: Event) => {
        if (e.target instanceof HTMLElement) {
          if (e.target.className.includes(TIME_PICKER_CLASS)) {
            return;
          }
          if (e.target.tagName === "OPTION") {
            return;
          }
          setIsPopupOpen(false);
        }
      };
      document.addEventListener("click", handleClick);
      return () => {
        document.removeEventListener("click", handleClick);
      };
    }, [setIsPopupOpen]);

    return (
      <div ref={ref} className={`${styles.popup}`}>
        <div className={`${styles.selectorWrapper}`}>{children}</div>
        <button
          type="button"
          className={`${styles.okButton}`}
          tabIndex={0}
          onClick={onBlur}
          onBlur={onBlur}
        >
          OK
        </button>
      </div>
    );
  },
);

type SelectorProps = {
  name: string;
  optionValues: number[];
  selectedValue: number;
  setSelectedValue: (value: number) => void;
  getFocus: boolean;
};

const Selector = ({
  name,
  optionValues,
  selectedValue,
  setSelectedValue,
  getFocus,
}: SelectorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLOptionElement>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: "center" });
    }
    if (getFocus) {
      ref.current?.focus();
    }
  }, [selectedRef, getFocus]);

  return (
    <div
      ref={ref}
      className={`${styles.selector}`}
      onMouseEnter={() => {
        if (ref.current) {
          ref.current.focus();
        }
      }}
      tabIndex={0}
    >
      {optionValues.map((x) => (
        <option
          key={`${name}-${x}`}
          className={`${styles.option} ${selectedValue === x ? styles["selected-option"] : ""}`}
          value={x}
          onClick={(e) => {
            e.preventDefault();
            setSelectedValue(x);
          }}
          ref={selectedValue === x ? selectedRef : null}
        >
          {`0${x}`.slice(-2)}
        </option>
      ))}
    </div>
  );
};
