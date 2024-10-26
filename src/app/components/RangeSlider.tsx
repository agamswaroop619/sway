import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef
} from "react";
import classnames from "classnames";
import "./style.css";

interface MultiRangeSliderProps {
  min: number;
  setMin: React.Dispatch<React.SetStateAction<number>>;
  max: number;
  setMax: React.Dispatch<React.SetStateAction<number>>;
  onChange: ({ min, max }: { min: number; max: number }) => void; 
}

const RangeSlider: FC<MultiRangeSliderProps> = ({
  min,
  setMin,
  max,
  setMax,
  onChange
}) => {

  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(min);
      const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [min, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(max);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [max, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min, max });
  }, [min, max, onChange]);

  return (
    <div className="container ">
      <input
        type="range"
        min={100}
        max={1000}
        value={min}
        ref={minValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(+event.target.value, max - 1);
          setMin(value);
          event.target.value = value.toString();
        }}
        className={classnames("thumb thumb--zindex-3", {
          "thumb--zindex-5": min > max - 100
        })}
      />
      <input
        type="range"
        min={100}
        max={1000}
        value={max}
        ref={maxValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(+event.target.value, min+ 1);
          setMax(value);
          event.target.value = value.toString();
        }}
        className="thumb thumb--zindex-4"
      />

      <div className="slider">
        <div className="slider__track"></div>
        <div ref={range} className="slider__range"></div>
        <div className="slider__left-value">{min}</div>
        <div className="slider__right-value">{max}</div>
      </div>
    </div>
  );
};

export default RangeSlider;
