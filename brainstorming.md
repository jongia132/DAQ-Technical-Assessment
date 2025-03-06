# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

## Spyder

1.

2. The only correct type of value that should be displayed is of type number, or a floating point value. From the logs, the data emulator sometimes sends strings of binary data which may not be relevant to the display. Before the streaming server sends any value, I parsed the data recieved from the websocket connection into a JavaScript object assigning the type VehicleData. Then, I used parseFloat to check if the value is an actual number or floating point and used isNaN to check for the side effect of the parseFloat function. If it is a number, I allow the data to be sent otherwise it will get ignored. This allows valid binary streams to be parsed and sent while discarding those with invalid values.

3. I used a local let variable to track the number of times the temp goes beyond the safe limits. Additionally, I filter out events where temperature is invalid so that outside temperatures that come subsequently still go towards the warning count. Then, whenever this limit is reached more than 3 times, it will use a console warn to log to the terminal. This warning message only prints whenever it recieves valid data, so that if the connection was lost then it will only continue warning if the temperature is still too high or low.

4. The button is not changing because the useEffect hook has been created with an empty array, meaning it will only run once on client load. To fix this, we can add the readyState variable inside the array of the useEffect hook so that it reruns whenever that value changes.

## Cloud
