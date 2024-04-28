import {
  useState,
  useEffect,
  useRef,
  PropsWithChildren,
  KeyboardEvent,
  MouseEvent,
} from "react";

import { FaRegClock } from "react-icons/fa6";
import styles from "./styles.module.css";

const HOURS = [...Array(24).keys()];
const MINUTES = [...Array(60).keys()];
const TIME_PICKER_CLASS = "time-picker";

export type TimePickerProps = {
  /* rhf props */
  name: string;
  setValue: (name: string, value: string) => void;
  /* rhf props end */
  defaultValue?: string;
  hourRange?: number[];
  minStep?: number;
  okButtonText?: string;
  showClockIcon?: boolean;
  style?: React.CSSProperties;
  className?: string;
  popupClassName?: string;
  selectClassName?: string;
  okButtonClassName?: string;
  selectedOptionClassName?: string;
};

export const TimePicker = ({
  // rhf props
  name,
  setValue,
  // rhf props end
  defaultValue,
  hourRange = HOURS,
  minStep = 5,
  okButtonText = "OK",
  showClockIcon = true,
  style = {},
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
  const defaultHour = calcDefaultHour(hour, hourRange);
  const defaultMinute = calcDefaultMinute(minute, minStep);
  const minRange = minStep ? MINUTES.filter((x) => x % minStep === 0) : MINUTES;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(defaultHour);
  const [selectedMinute, setSelectedMinute] = useState(defaultMinute);

  useEffect(() => {
    setValue(name, `${zeroPadding(defaultHour)}:${zeroPadding(defaultMinute)}`);
  }, [setValue, name, defaultHour, defaultMinute]);

  const setTime = (hour = selectedHour, min = selectedMinute) => {
    setSelectedHour(hour);
    setSelectedMinute(min);
    setValue(name, `${zeroPadding(hour)}:${zeroPadding(min)}`);
  };

  const handleOnFocus = () => setIsPopupOpen(true);
  const handleOnKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      setIsPopupOpen(false);
    }
  };
  const handleOnClickButton = () => {
    setIsPopupOpen(false);
    setValue(
      name,
      `${zeroPadding(selectedHour)}:${zeroPadding(selectedMinute)}`,
    );
  };

  return (
    <div
      role="combobox"
      className={`${styles["time-picker"]} ${TIME_PICKER_CLASS}`}
      tabIndex={0}
      onFocus={handleOnFocus}
      onKeyDown={handleOnKeyDown}
      style={style}
      {...restProps}
    >
      <div
        role="time"
        className={`${styles.display} ${className}`}
        onClick={() => {
          setIsPopupOpen(true);
        }}
      >
        <span aria-label="selected hour and minute">
          {`${zeroPadding(selectedHour)}:${zeroPadding(selectedMinute)}`}
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
            onClick={handleOnClickButton}
            onBlur={handleOnClickButton}
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

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: "center" });
    }
    if (getFocus) {
      ref.current?.focus();
    }
  }, [selectedRef, getFocus]);

  const handleMouseEnter = () => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Up" || e.key === "ArrowUp") {
      const prevValue = optionValues[optionValues.indexOf(selectedValue) - 1];
      if (prevValue === undefined) {
        return;
      }
      setSelectedValue(prevValue);
      return;
    }
    if (e.key === "Down" || e.key === "ArrowDown") {
      const nextValue = optionValues[optionValues.indexOf(selectedValue) + 1];
      if (nextValue === undefined) {
        return;
      }
      setSelectedValue(nextValue);
      return;
    }
  };

  const handleOnClick = (x: number) => (e: MouseEvent<HTMLOptionElement>) => {
    e.preventDefault();
    setSelectedValue(x);
  };

  return (
    <div
      ref={ref}
      role="spinbutton"
      aria-label={name}
      className={`${styles.selector} ${className ? className : ""}`}
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onKeyDown={handleOnKeyDown}
    >
      {optionValues.map((x) => (
        <option
          key={`${name}-${x}`}
          role="option"
          aria-label={`${x} ${name}`}
          aria-selected={`${selectedValue === x}`}
          className={`${styles.option} ${selectedValue === x ? (selectedOptionClassName ? selectedOptionClassName : styles["selected-option"]) : ""}`}
          value={x}
          onClick={handleOnClick(x)}
          ref={selectedValue === x ? selectedRef : null}
        >
          {zeroPadding(x)}
        </option>
      ))}
    </div>
  );
};

function zeroPadding(num: number) {
  return `0${num}`.slice(-2);
}

function calcDefaultHour(hour: number, hourRange: number[]) {
  if (hourRange.includes(hour)) {
    return hour;
  }
  // minmax
  if (hour < hourRange[0]) {
    return hourRange[0];
  }
  return hourRange[hourRange.length - 1];
}

function calcDefaultMinute(minute: number, minStep: number) {
  if (minStep === 1) {
    return minute;
  }
  return Math.floor(minute / minStep) * minStep;
}
