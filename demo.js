import {calculate, Waypoint} from './main.js';

const maxDistance = 30;

const paths = calculate([
  new Waypoint(56, 10, 0),
  new Waypoint(56.1, 10, 2),
  new Waypoint(56, 10.1, 3),
  new Waypoint(56.1, 10.1, 4),
], {
  distance: val => val < maxDistance / 2,
});

//console.log(paths);
