import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';

const MainLayout = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (success) => {
        setCoordinates({ lat: success.coords.latitude, lon: success.coords.longitude });
      },
      (error) => {
        console.log(error);
        setErr(error.message);
      }
    );
  }, []);

  useEffect(() => {
    if (!coordinates?.lat) return;
    const fetchWeatherInfo = async () => {
      try {
        // check if variables are defined!
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/weather-now?lat=${coordinates.lat}&lon=${coordinates.lon}`
        );
        const {
          data: { location, current, forecast },
        } = await res.json();
        setLocation(location);
        setWeatherData({ current, forecast });
      } catch (error) {
        setErr(error.message);
      }
    };

    fetchWeatherInfo();
  }, [coordinates]);

  return (
    <div className='bg-slate-900 min-h-screen text-slate-50 grid grid-cols-[1fr_auto_1fr] grid-rows-[3px_1fr_3rem]'>
      <header className='flex flex-col col-start-2 col-end-3 max-w-7xl'>
        <h1>ErrorWeather</h1>
        {location && (
          <p>
            You are in {location.name}, {location.region}.
          </p>
        )}
      </header>
      {err && (
        <p className='text-red-400 flex flex-col col-start-2 col-end-3 max-w-7xl'>
          To use this service, you need to allow location access.
        </p>
      )}
      <main className='flex flex-col col-start-2 col-end-3 max-w-7xl'>
        {<Outlet context={{ weatherData, location }} />}
      </main>
      <footer className='flex flex-col col-start-2 col-end-3 max-w-7xl'>
        &copy; '{new Date().getFullYear().toString().substring(2)}
      </footer>
    </div>
  );
};

export default MainLayout;
