/*
 * Entry point for the watch app
 */
import document from "document";
import clock from "clock";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { me } from "appbit";

clock.granularity = "seconds"; // seconds, minutes, hours

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");
let hourText = document.getElementById("hourText");
let minuteText = document.getElementById("minuteText");

// draw clock
let angle = num * Math.PI / 6;
let radius = 130;
let center = 150;
let textsize = 12;

for (let i = 1; i < 13; i++) {
  let angle = i * Math.PI/6;
  // let num = document.createElementNS("http://www.w3.org/2000/svg", 'text');
  let num = document.getElementById(`num${i}`);

  let x = center + radius * Math.sin(angle);
  let y = center - radius * Math.cos(angle) + textsize / 2;

  num.groupTransform.translate.x = x - 150;
  num.groupTransform.translate.y = y - 150;
  
  num.style.fill = '#64b5f6';
}

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

// Rotate the hands every tick
function updateClock(e) {
  let today = new Date();
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
  let secs = today.getSeconds();

  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
  
  let time = e.date;
  let digitalMinutes = time.getMinutes();
  let digitalHours = time.getHours();

  // format minutes
  if (digitalMinutes < 10) {
    digitalMinutes = "0" + digitalMinutes;
  }
  // format hours
  if (digitalHours % 12 < 10) {
    digitalHours = "0" + digitalHours % 12;
  }
  
  hourText.text = digitalHours;
  minuteText.text = digitalMinutes;
}

// Update the clock every tick event
clock.ontick = (e) => updateClock(e);


/************************************
          Heart Rate
************************************/
let hrm = new HeartRateSensor();
hrm.onreading = function() {
  console.log("Current heart rate: " + hrm.heartRate);
}

let body = new BodyPresenceSensor();
body.onreading = () => {
  if (!body.present || !me.permissions.granted("access_heart_rate")) {
    hrm.stop();
  } else {
    console.log('start hr readings');
    hrm.start();
  }
};
body.start();



