import { useOutletContext } from 'react-router';
import Clock from '../components/Clock.jsx';
import { useRef, useState, useEffect } from 'react';
import TemperatureTooltip from '../components/TemperatureTooltip.jsx';
import { getTemperatureColor } from '../utils/utils.js';

// const windCompassRose = {
//   N: '0deg',
//   NNE: '22.5deg',
//   NE: '45deg',
//   ENE: '67.5deg',
//   E: '90deg',
//   ESE: '112.5deg',
//   SE: '135deg',
//   SSE: '157.5deg',
//   S: '180deg',
//   SSW: '202.5deg',
//   SW: '225deg',
//   WSE: '247.5deg',
//   W: '270deg',
//   WNW: '292.5deg',
//   NW: '315deg',
//   NNW: '337.5deg',
// };
// bg-radial from-slate-900 from-65% to-67% to-transparent

const Home = () => {
  const intervalRef = useRef(null);
  const [, setTrigger] = useState(false);
  const { weatherData } = useOutletContext();

  useEffect(() => {
    intervalRef.current = setInterval(() => setTrigger((p) => !p), 1000 * 60 * 60);

    return () => clearInterval(intervalRef.current);
  }, []);

  if (!weatherData) return null;
  const { temp_c, wind_degree, wind_kph, condition } = weatherData.current;
  console.log(weatherData.current);
  const hour = new Date().getHours();
  const startHour = hour < 2 ? 0 : hour - 2;
  const gradientStart = (startHour % 12) * 30;
  const forecast = [...weatherData.forecast.forecastday[0].hour, ...weatherData.forecast.forecastday[0].hour];
  return (
    <div className='h-full min-w-lg grid place-content-center block-container '>
      <div
        className='border-0 aspect-square  w-[100cqmin] rounded-full mx-auto col-end-1 row-end-1 relative'
        style={{
          backgroundImage: `conic-gradient(from ${gradientStart}deg in oklch, ${forecast
            .slice(startHour, startHour + 12)
            .map((h) => getTemperatureColor(h.temp_c))
            .join(',')})`,
          filter: `drop-shadow(0px 0px 10px ${getTemperatureColor(temp_c)})`,
        }}
      >
        <TemperatureTooltip startHour={startHour} forecast={forecast.slice(startHour, startHour + 12)} />
        <div className='border-0 aspect-square my-auto bg-center rounded-full overflow-clip grid place-content-center backdrop-blur-2xl  clock-container '>
          <img src={condition.icon} alt='' className='col-end-1 row-end-1' />
          <Clock baseColor={getTemperatureColor(temp_c)} />
        </div>
      </div>
      {/* Wind */}
      <div className='col-end-1 row-end-1 place-self-center w-1 h-1 relative'>
        <div
          className='absolute right-0 w-1 h-[55cqmin] origin-bottom bottom-0'
          style={{
            // rotate: windCompassRose[wind_dir],
            rotate: wind_degree + 'deg',
            filter: `drop-shadow(0px 0px 10px ${getTemperatureColor(wind_kph)}) blur(0.5px)`,
          }}
        >
          <svg
            fill={getTemperatureColor(wind_kph)}
            height='5cqmin'
            width='5cqmin'
            viewBox='0 0 512.00 512.00'
            style={{
              transform: `translateX(-50%)`,
            }}
          >
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
              <g>
                <g>
                  <path d='M418.136,358.4h-44.621L264.152,6.007C263.043,2.432,259.74,0,256.003,0s-7.04,2.432-8.149,6.007L138.49,358.4H93.869 c-4.719,0-8.533,3.823-8.533,8.533s3.814,8.533,8.533,8.533h39.322L94.253,500.941c-0.896,2.901-0.188,6.067,1.877,8.311 c2.057,2.236,5.137,3.209,8.124,2.551l143.215-31.829v23.492c0,4.71,3.814,8.533,8.533,8.533s8.533-3.823,8.533-8.533v-23.492 l143.215,31.821c0.614,0.137,1.237,0.205,1.852,0.205c2.355,0,4.642-0.981,6.272-2.756c2.065-2.236,2.773-5.402,1.877-8.311 l-38.938-125.466h39.322c4.719,0,8.533-3.823,8.533-8.533S422.855,358.4,418.136,358.4z M247.469,462.49l-132.557,29.457 l36.147-116.48h28.646c3.951,35.533,32.222,63.812,67.763,67.763V462.49z M247.469,290.637 c-35.541,3.951-63.812,32.23-67.763,67.763h-23.347l91.11-293.581V290.637z M264.536,64.819l91.11,293.581h-23.347 c-3.951-35.533-32.222-63.812-67.763-67.763V64.819z M397.093,491.947L264.536,462.49v-19.26 c35.541-3.951,63.812-32.23,67.763-67.763h28.646L397.093,491.947z'></path>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Home;
