# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

## Spyder

1. Knowing that the application needs to reload in a production environment, nodemon needs to trigger on any change within the src directory as even static files such as icons or images need to be bundled by the Next.js compiler. To do this, I created a new package script called `watch` which uses nodemon to run both the build and start commands together, watching the src directory for any changes.

To complete, the dockerfile was modified to not run the built in build command but instead just use the new watch script.
Nodemon by default watches only basic extensions so I had to add the global operator. Originally this was really simple but then docker runs using shell, not bash which causes the asterisk symbol to instead provide the directory listing to the build command. I used escape characters so that the command would work across all systems as a workaround. It also seems to have trouble detecting for file changes normally, so using the legacy file watcher argument it correctly works.

I was going to originally have the build and start commands watch the src folder and .next folder respectively to minimise downtime, but the next build process is slightly dynamic and it was difficult to get nodemon to track a specific file for modification that would represent the final build completion.

2. The only correct type of value that should be displayed is of type number, or a floating point value. From the logs, the data emulator sometimes sends strings of binary data which may not be relevant to the display. Before the streaming server sends any value, I parsed the data recieved from the websocket connection into a JavaScript object assigning the type VehicleData. Then, I used typeof to check if the value is of type `Number`. If it is a number, I allow the data to be sent otherwise it will get ignored.

3. I used a global let variable to track the number of times the temp goes beyond the safe limits. Additionally, I filter out events where temperature is invalid so that outside temperatures that come subsequently still go towards the warning count. Then, whenever this limit is reached more than 3 times, it will use a console warn to log to the terminal. This warning message only prints whenever it recieves valid data, so that if the connection was lost then it will only continue warning if the temperature is still too high or low.

4. The button is not changing because the useEffect hook has been created with an empty array, meaning it will only run once on client load. To fix this, we can add the readyState variable inside the array of the useEffect hook so that it reruns whenever that value changes.

5. Using tailwind text colour classes, I used the provided cn function to conditionally apply the correct class based on the temp range. I used switch statements as they are more easy to extend if additional ranges are requested which use Typescript enums for the different ranges.

## Cloud
