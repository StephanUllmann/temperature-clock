export const getTemperatureColor = (temp) => {
  if (temp > 30) return 'hsl(0 80 50)';
  let hue = (30 - temp) * 6;
  return `hsl(${Math.round(hue)} 80 50% / 0.75)`;
};
