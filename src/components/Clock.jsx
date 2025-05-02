import { useEffect, useState, useRef } from 'react';

const Clock = ({ baseColor }) => {
  // const [time, setTime] = useState(getTimeString());
  const [, setTrigger] = useState(false);
  const hourHand = useRef(null);
  const minuteHand = useRef(null);
  const secondHand = useRef(null);

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

  hour % 12 === 0
    ? hourHand.current?.classList.remove('transition-transform')
    : hourHand.current?.classList.add('transition-transform');
  minute === 0
    ? minuteHand.current?.classList.remove('transition-transform')
    : minuteHand.current?.classList.add('transition-transform');
  second === 0
    ? secondHand.current?.classList.remove('transition-transform')
    : secondHand.current?.classList.add('transition-transform');

  return (
    <div className='text-transparent text-shadow-lg text-shadow-slate-700 text-3xl h-1 w-1 relative col-end-1 row-end-1 place-self-center'>
      <div
        ref={hourHand}
        className='absolute -left-1 bottom-0 w-[2cqw] h-[30cqw] bg-amber-500 rounded-2xl transform-gpu origin-bottom transition-transform will-change-transform'
        style={{
          rotate: rotateHourHand,
          backgroundColor: `color-mix(in oklch, ${baseColor}, orangered 30%)`,
          filter: `drop-shadow(0px 0px 3px color-mix(in oklch, ${baseColor}, orangered 30%))`,
        }}
      ></div>
      <div
        ref={minuteHand}
        className='absolute -left-1 bottom-0 w-[2cqw] h-[45cqw] bg-sky-500 rounded-2xl transform-gpu origin-bottom transition-transform will-change-transform'
        style={{
          rotate: rotateMinuteHand,
          backgroundColor: `color-mix(in oklch, ${baseColor}, cyan 30%)`,
          filter: `drop-shadow(0px 0px 3px color-mix(in oklch, ${baseColor}, cyan 30%))`,
        }}
      ></div>
      <div
        ref={secondHand}
        className='absolute -left-0 bottom-0 w-[1cqw] h-[40cqw] bg-red-500 rounded-2xl transform-gpu origin-bottom transition-transform will-change-transform'
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
