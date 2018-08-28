# AI-for-Transport-Infrastructure
A complete project that focuses on implementing Artificial Intelligence for Transport Infrastructure



## Deep Learning using keras
* We have used IBM Cloud for training our model.
* Keras as the Deep Learning library with Tensorflow backend and LSTM (Long Short Term Memory) for our neural networks for Anamoly detection
 
### Installation
```
run with Jupyter Notebook
```



## Server with Node js and MQTT
* We have used Mosca as the mqtt broker on Node for the real-time transfer of Sensor Data and GPS coordinates. 
* Node server conatins the mqtt subscriber

### Installation
* node should be installed
```
npm install
node broker.js
node subscriber.js
```



## Mobile App using React Native
* We have used a react native mobile application which acts as the publisher for mqtt service which publishes the sensor data and GPS coordinates .

### Installation
* node and react native dependencies must be installed
```
npm install
react-native run-android
```
