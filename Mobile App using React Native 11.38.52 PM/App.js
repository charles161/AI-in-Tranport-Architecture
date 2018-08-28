import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Accelerometer } from "react-native-sensors";
import axios from 'axios'
import { Client, Message } from 'react-native-paho-mqtt';

let clientId = Math.floor(Math.random()*9000) + 1000;
const Value = ({ name, value }) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueName}>{name}:</Text>
    <Text style={styles.valueValue}>{new String(value).substr(0, 8)}</Text>
  </View>
)
const myStorage = {
  setItem: (key, item) => {
    myStorage[key] = item;
  },
  getItem: (key) => myStorage[key],
  removeItem: (key) => {
    delete myStorage[key];
  },
};
const client = new Client({ uri: 'ws://10.1.75.71:3000/ws', clientId: '', storage: myStorage });

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0, z: 0,lat: null,long: null };
    new Accelerometer({
      updateInterval: 400 // defaults to 100ms
    })
      .then(observable => {
        observable.subscribe(({ x, y, z }) => this.setState({ x, y, z }));
      })
      .catch(error => {
        console.log("The sensor is not available");
      });

      setInterval(() => {
        axios.get(' https://api.thingspeak.com/update?api_key=CJW4SOBL9DBWFYWU&field1='+this.state.x+'&field2='+this.state.y+'&field3='+this.state.z+'&entry_id=44&latitude='+this.state.lat+'&longitude='+this.state.long)
        .then()
        .catch((error) => alert(JSON.stringify(error)))
      }, 100);
   
  }
  
  componentWillMount(){
    navigator.geolocation.getCurrentPosition(
      position => {
        let latitude, longitude;
        latitude = parseFloat(position.coords.latitude);
        longitude = parseFloat(position.coords.longitude);
        
        this.setState({ lat:latitude,long:longitude });
      },
      (error) => alert(JSON.stringify(error)),
      { enableHighAccuracy: true,timeout:2000000,  maximumAge:0 }
    )

    this.watchID = navigator.geolocation.watchPosition(position => {
      let latitude, longitude;
        latitude = parseFloat(position.coords.latitude);
        longitude = parseFloat(position.coords.longitude);
        
        this.setState({ lat:latitude,long:longitude });
      //this.socket.emit('message', message);
    })
  }
  componentDidMount(){
    client.on('connectionLost', (responseObject) => {
      if (responseObject.errorCode !== 0) {
        alert(responseObject.errorMessage);
      }
    });
    client.on('messageReceived', (message) => {
      alert(message.payloadString);
    });
    
    client.connect()
      .then(() => {
        alert('onConnect');
       
      })
      .then(() => {
       
        setInterval(()=> {
          const {x,y,z,lat,long} = this.state;
          const message = new Message(JSON.stringify({x,y,z,lat,long,clientId}));
          message.destinationName = 'sense';
          client.send(message);
        },1000);
    
      })
      .catch((responseObject) => {
        if (responseObject.errorCode !== 0) {
          alert('onConnectionLost:' + responseObject.errorMessage);
        }
      })
    ;
  }

  componentWillUnmount(){
    navigator.geolocation.clearWatch(this.watchID);
  }
 

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headline}>
          Sense
        </Text>
        <Value name="x" value={this.state.x} />
        <Value name="y" value={this.state.y} />
        <Value name="z" value={this.state.z} />
        <Value name="lat" value={this.state.lat}/>
        <Value name="long" value={this.state.long}/>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headline: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  valueContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  valueValue: {
    width: 200,
    fontSize: 20
  },
  valueName: {
    width: 50,
    fontSize: 20,
    fontWeight: 'bold'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});