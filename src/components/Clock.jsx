import { useEffect, useState, useRef } from 'react';

const Clock = ({ baseColor }) => {
  const [, setTrigger] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setTrigger((p) => !p), 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  const rotateHourHand = ((hour % 12) * 30 + minute * 0.5).toString() + 'deg';
  const rotateMinuteHand = (minute * 6 + second * 0.1).toString() + 'deg';
  const rotateSecondHand = (second * 6).toString() + 'deg';

  return (
    <div className='text-transparent text-shadow-lg text-shadow-slate-700 text-3xl h-0 w-0 relative col-end-1 row-end-1 place-self-center'>
      <div
        className={`absolute -left-1 bottom-0 w-[2cqw] h-[45cqw] bg-sky-500 rounded-2xl transform-gpu origin-bottom  will-change-transform ${
          minute !== 0 ? 'transition-transform' : ''
        }`}
        style={{
          rotate: rotateMinuteHand,
          backgroundColor: `color-mix(in oklch, ${baseColor}, cyan 30%)`,
          filter: `drop-shadow(0px 0px 3px color-mix(in oklch, ${baseColor}, cyan 30%))`,
        }}
      ></div>
      <div
        className={`absolute -left-1 bottom-0 w-[2.25cqw] h-[30cqw] bg-amber-500 rounded-2xl transform-gpu origin-bottom will-change-transform ${
          hour % 12 !== 0 ? 'transition-transform' : ''
        }`}
        style={{
          rotate: rotateHourHand,
          backgroundColor: `color-mix(in oklch, ${baseColor}, orangered 30%)`,
          filter: `drop-shadow(0px 0px 3px color-mix(in oklch, ${baseColor}, orangered 30%))`,
        }}
      ></div>
      <div
        className={`absolute -left-0 bottom-0 w-[1cqw] h-[40cqw] bg-red-500 rounded-2xl transform-gpu origin-bottom will-change-transform ${
          second !== 0 ? 'transition-transform' : ''
        }`}
        style={{
          rotate: rotateSecondHand,
          backgroundColor: `color-mix(in oklch, ${baseColor}, red 20%)`,
          filter: `drop-shadow(0px 0px 3px color-mix(in oklch, ${baseColor},  red 20%)`,
        }}
      ></div>
    </div>
  );
};

export default Clock;
