import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [tooltip, setTooltip] = useState(null);

  const handleMouseMove = useCallback(
    (e) => {
      if (!overlayRef.current) return;

      const overlay = overlayRef.current;
      const rect = overlay.getBoundingClientRect();
      const center = {
        x: rect.width / 2,
        y: rect.height / 2,
      };

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const dx = mouseX - center.x;
      const dy = mouseY - center.y;
      const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

      const innerBound = Math.min(center.x, center.y) * 0.9;
      const outerBound = Math.min(center.x, center.y);

      // Check if mouse is within the ring
      if (distanceFromCenter > innerBound && distanceFromCenter < outerBound) {
        // Calculate angle in degrees
        // atan2 returns angle in radians, convert to degrees
        // Adjust the formula to correctly map to clock positions
        const rotationOffset = -90 - (startHour % 12) * 30;
        const angle = ((Math.atan2(center.y - mouseY, center.x - mouseX) * 180) / Math.PI + rotationOffset + 360) % 360;

        const index = Math.floor(angle / 30);
        if (index >= -6 && index < forecast.length) {
          setTooltip({
            x: mouseX,
            y: mouseY,
            index,
            data: forecast.at(index),
          });
        }
      } else {
        // setTooltip(null);
      }
    },
    [startHour, forecast]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    overlay.addEventListener('mousemove', handleMouseMove);
    // overlay.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      overlay.removeEventListener('mousemove', handleMouseMove);
      // overlay.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div ref={overlayRef} className='absolute inset-0 z-50 isolate' role='tooltip' aria-live='polite'>
      {tooltip && (
        <>
          <div
            className='absolute tooltip-anchor  '
            style={{
              left: tooltip.x + 'px',
              top: tooltip.y + 20 + 'px',
            }}
          ></div>
          <div
            className='text-sm font-black border-2 rounded bg-slate-900 backdrop-blur-3xl  w-fit px-1 py-0.5 text-nowrap tooltip'
            style={{
              filter: `drop-shadow(0px 0px 5px ${getTemperatureColor(tooltip.data.temp_c)})`,
            }}
          >
            <p>{dateFormat.format(new Date(tooltip.data.time))}</p>
            <p>{tooltip.data.temp_c}°C</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TemperatureTooltip;
