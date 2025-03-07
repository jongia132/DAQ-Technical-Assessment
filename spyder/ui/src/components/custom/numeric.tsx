import { cn } from "@/lib/utils";

interface TemperatureProps {
  temp: any;
}

/**
 * Numeric component that displays the temperature value.
 * 
 * @param {number} props.temp - The temperature value to be displayed.
 * @returns {JSX.Element} The rendered Numeric component.
 */
function Numeric({ temp }: TemperatureProps) {
  // TODO: Change the color of the text based on the temperature
  // HINT:
  //  - Consider using cn() from the utils folder for conditional tailwind styling
  //  - (or) Use the div's style prop to change the colour
  //  - (or) other solution

  // Justify your choice of implementation in brainstorming.md
  enum range {
    unsafe,
    warn,
    safe
  }
  
  let status: number;
  switch (true) {
    case (temp < 20 || temp > 80):
      status = range.unsafe;
      break;
    case (temp <= 25 || temp >= 75):
      status = range.warn;
      break;
    default:
      status = range.safe;
  }

  return (
    <div className={`${cn({'text-red-500': status === range.unsafe, 'text-yellow-500': status === range.warn, 'text-green-500': status === range.safe})} "text-foreground text-4xl font-bold"`}>
      {`${temp}°C`}
    </div>
  );
}

export default Numeric;
