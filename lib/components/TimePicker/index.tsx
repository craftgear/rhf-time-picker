import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  PropsWithChildren,
  InputHTMLAttributes,
} from "react";

import { FaRegClock } from "react-icons/fa6";
import styles from "./styles.module.css";

export type TimePickerProps = {
  defaultValue: string;
  okButtonText?: string;
  hourRange?: number[];
  showClockIcon?: boolean;
  minStep?: number;
  style?: React.CSSProperties;
  className?: string;
  popupClassName?: string;
  selectClassName?: string;
  okButtonClassName?: string;
  selectedOptionClassName?: string;
  /* rhf props */
  name: string;
  setValue: (name: string, value: string) => void;
} & InputHTMLAttributes<HTMLInputElement>;

const HOURS = [...Array(24).keys()];
const MINUTES = [...Array(60).keys()];
const TIME_PICKER_CLASS = "time-picker";

export const TimePicker = ({
  // rhf props
  name,
  setValue,
  // rhf props end
  defaultValue,
  okButtonText = "OK",
  hourRange = HOURS,
  minStep = 5,
  showClockIcon = true,
  className,
  popupClassName,
  selectClassName,
  okButtonClassName,
  selectedOptionClassName,
  ...restProps
}: TimePickerProps) => {
  const [hour, minute] = (defaultValue ?? new Date().toTimeString().slice(0, 5))
    .split(":")
    .map((x) => parseInt(x, 10));

  const minRange = minStep ? MINUTES.filter((x) => x % minStep === 0) : MINUTES;

  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const [selectedHour, setSelectedHour] = useState(hour);
  const [selectedMinute, setSelectedMinute] = useState(minute);

  const setTime = (hour = selectedHour, min = selectedMinute) => {
    setSelectedHour(hour);
    setSelectedMinute(min);
    setValue(name, `${`0${hour}`.slice(-2)}:${`0${min}`.slice(-2)}`);
  };

  return (
    <div
      role="combobox"
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
        value={`${`0${selectedHour}`.slice(-2)}:${`0${selectedMinute}`.slice(-2)}`}
      />
      <div
        role="time"
        className={`${styles.display} ${className}`}
        onClick={() => {
          setIsPopupOpen(true);
        }}
      >
        <span aria-label="selected hour and minute">
          {` ${selectedHour}`.slice(-2)}:{`0${selectedMinute}`.slice(-2)}
        </span>
        {showClockIcon && <FaRegClock className={`${styles.icon}`} />}
      </div>
      {isPopupOpen && (
        <Popup
          setIsPopupOpen={setIsPopupOpen}
          className={`${styles.popup} ${popupClassName}`}
        >
          <div className={`${styles.selectorWrapper}`}>
            <Select
              className={selectClassName}
              selectedOptionClassName={selectedOptionClassName}
              name="hour"
              optionValues={hourRange}
              selectedValue={selectedHour}
              setSelectedValue={(hour) => {
                setTime(hour, undefined);
              }}
              getFocus={true}
            />
            <Select
              className={selectClassName}
              selectedOptionClassName={selectedOptionClassName}
              name="minute"
              optionValues={minRange}
              selectedValue={selectedMinute}
              setSelectedValue={(minute) => {
                setTime(undefined, minute);
              }}
              getFocus={false}
            />
          </div>
          <button
            type="button"
            aria-label="confirm selected hour and minute"
            className={okButtonClassName ? okButtonClassName : styles.okButton}
            tabIndex={0}
            onClick={() => {
              setIsPopupOpen(false);
            }}
            onBlur={() => {
              setIsPopupOpen(false);
            }}
          >
            {okButtonText}
          </button>
        </Popup>
      )}
    </div>
  );
};
type PopupProps = PropsWithChildren<{
  setIsPopupOpen: (x: boolean) => void;
  className?: string;
}>;

const Popup = ({ setIsPopupOpen, className, children }: PopupProps) => {
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
    <div className={`${styles.popup} ${className ? className : ""}`}>
      {children}
    </div>
  );
};

type SelectorProps = {
  name: string;
  optionValues: number[];
  selectedValue: number;
  setSelectedValue: (value: number) => void;
  getFocus: boolean;
  className?: string;
  selectedOptionClassName?: string;
};

const Select = ({
  name,
  className,
  selectedOptionClassName,
  optionValues,
  selectedValue,
  setSelectedValue,
  getFocus,
}: SelectorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLOptionElement>(null);

  useLayoutEffect(() => {
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
      role="spinbutton"
      aria-label={name}
      className={`${styles.selector} ${className ? className : ""}`}
      onMouseEnter={() => {
        if (ref.current) {
          ref.current.focus();
        }
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Up" || e.key === "ArrowUp") {
          const prevValue =
            optionValues[optionValues.indexOf(selectedValue) - 1];
          if (prevValue === undefined) {
            return;
          }
          setSelectedValue(prevValue);
          return;
        }
        if (e.key === "Down" || e.key === "ArrowDown") {
          const nextValue =
            optionValues[optionValues.indexOf(selectedValue) + 1];
          if (nextValue === undefined) {
            return;
          }
          setSelectedValue(nextValue);
          return;
        }
      }}
    >
      {optionValues.map((x) => (
        <option
          key={`${name}-${x}`}
          role="option"
          aria-label={`${x} ${name}`}
          aria-selected={`${selectedValue === x}`}
          className={`${styles.option} ${selectedValue === x ? (selectedOptionClassName ? selectedOptionClassName : styles["selected-option"]) : ""}`}
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
