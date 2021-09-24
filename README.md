# LYWSD03MMCSensor

LYWSD03MMCSensor is a Javascript class to connect and get measurements from LYWSD03MMC (Xiaomi Mijia Bluetooth Thermometer 2) sensors using Bluetooth Web API.

This code has been tested in a computer with Windows 11 beta 21H2 and Edge 93.

Take in count: 
  - At the time of writing (24th September 2021) Bluetooth Web API is in development stage. API may change and the code may stop working in any moment.
  - To enable Bluetooth Web API on Microsoft Edge you have to go to [edge://flags/](edge://flags/) and set the flag `experimental-web-platform-features` to `true`

## Code samples

See file [index.html](src/index.html) 

## How to use

1. Include a reference to the script file [LYWSD03MMCSensor.js](src\js\LYWSD03MMCSensor.js) in your HTML page.
2. Use Bluetooth Web API to select the device you want to connect to.
3. Create a new instance of `LYWSD03MMCSensor` and pass the device in the constructor.
4. Add event listener for `onMeasurement` to get temperature and humidity measurements.
5. Optional: Add event listener for `onLogMessage` to get debug messages.
6. Call method `startMonitor()` to start the periodic measurements.

## Advanced
- Measurement interval is set to 60000 milliseconds. To change the interval open the file [LYWSD03MMCSensor.js](src\js\LYWSD03MMCSensor.js) and change the value of the variable `measurementInterval`