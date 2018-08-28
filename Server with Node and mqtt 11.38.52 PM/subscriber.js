var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://10.1.75.71');
client.on('connect', function () {
  client.subscribe('sense')
console.log("subscribed to sense");
// setInterval(function() {
// client.publish('myTopic', JSON.stringify({cool:'asfsadf'}));
// }, 5000);
});
client.on('message', function (topic, message) {
context = message.toString();
console.log(topic+" "+context)
});
