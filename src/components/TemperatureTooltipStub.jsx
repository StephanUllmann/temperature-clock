import { useEffect, useRef, useState } from 'react';
import { getTemperatureColor } from '../utils/utils.js';

const options = {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
  timeZone: 'Europe/Berlin',
};

const dateFormat = new Intl.DateTimeFormat('de-DE', options);

const TemperatureTooltip = ({ startHour, forecast }) => {
  const overlayRef = useRef(null);
  const [display, setDisplay] = useState(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    const rotationOffset = 35 + startHour * 30;
    const overlay = overlayRef.current;

    const handleMouseMove = (e) => {
      const { offsetX, offsetY, target } = e;
      const center = target.clientWidth >> 1;
      const mouseRadius = ((offsetX - center) ** 2 + (offsetY - center) ** 2) ** 0.5;
      const innerBound = center * 0.9;
      const outerBound = center * 0.99;
      if (mouseRadius > innerBound && mouseRadius < outerBound) {
        const deg = ((Math.atan2(center - offsetY, center - offsetX) * 180) / Math.PI + rotationOffset + 360) % 360;
        const ind = Math.floor(deg / 30);
        setDisplay({ x: offsetX, y: offsetY, ind });
      } else {
        setDisplay(false);
      }
    };
    overlay.addEventListener('mousemove', handleMouseMove);

    return () => overlay?.removeEventListener('mousemove', handleMouseMove);
  }, [overlayRef, startHour]);

  return (
    <div ref={overlayRef} className='absolute inset-0 z-20 isolate'>
      {display && (
        <>
          <div
            className='absolute tooltip-anchor  '
            style={{
              left: display.x + 'px',
              top: display.y + 20 + 'px',
            }}
          ></div>
          <div
            className='text-sm font-black border-2 rounded bg-slate-900 w-fit px-1 py-0.5 text-nowrap z-40 tooltip'
            style={{
              filter: `drop-shadow(0px 0px 5px ${getTemperatureColor(forecast[display.ind].temp_c)})`,
            }}
          >
            <p>{dateFormat.format(new Date(forecast[display.ind].time))}</p>
            <p>{forecast[display.ind].temp_c}°C</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TemperatureTooltip;
