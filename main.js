export class Waypoint {
  constructor(latitude, longitude, value) {
    this.id = Waypoint.incrementID();
    this.latitude = latitude;
    this.longitude = longitude;
    this.value = value;
  }

  static incrementID() {
    if (!this.latestID) {
      this.latestID = 1;
    } else {
      this.latestID++;
    }

    return this.latestID;
  }
}

export class Edge {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.distance = this.calculateHaversine();
  }

  calculateHaversine() {
    const radius = 6371;
    const toRadians = function(degrees) {
      return degrees * Math.PI / 180;
    };
    const dLatitude = toRadians(this.to.latitude - this.from.latitude);
    const dLongitude = toRadians(this.to.longitude - this.from.longitude);
    const latitude1 = toRadians(this.from.latitude);
    const latitude2 = toRadians(this.to.latitude);
    const a = Math.sin(dLatitude / 2) *
        Math.sin(dLatitude / 2) +
        Math.sin(dLongitude / 2) *
        Math.sin(dLongitude / 2) *
        Math.cos(latitude1) *
        Math.cos(latitude2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return radius * c;
  }

  filter(filters) {
    return Object.keys(filters).every(key => {
      return filters[key](this[key]);
    });
  }
}

export class Path {
  constructor(value, distance, waypoints) {
    this.value = value;
    this.distance = distance;
    this.waypoints = waypoints;
  }

  filter(filters) {
    return Object.keys(filters).every(key => {
      return filters[key](this[key]);
    });
  }
}

export function calculate(waypoints, filters) {
  let paths = [];

  const getWaypointCombinations = function(input) {
    let mask, results = [], total = Math.pow(2, input.length);

    for (mask = 1; mask < total; mask++) {
      let result = [];
      let i = input.length - 1;

      do {
        if ((mask & (1 << i)) !== 0) {
          result.push(input[i]);
        }
      } while (i--);

      if (result.length >= 2 && result.some(waypoint => waypoint.id === 1)) {
        results.push(result);
      }
    }

    return results;
  };

  let filteredWaypoints = waypoints.filter(waypoint => {
    return new Edge(waypoints[0], waypoint).filter(filters);
  });

  console.time('getWaypointCombinations');
  let combinations = getWaypointCombinations(filteredWaypoints);
  console.timeEnd('getWaypointCombinations');

  combinations.forEach(waypoints => {
    let path;
    let accumulatedValue = 0;
    let accumulatedDistance = 0;

    waypoints.sort((a, b) => a.id - b.id);

    for (let i = 1; i < waypoints.length; i++) {
      let edge = new Edge(waypoints[i - 1], waypoints[i]);
      accumulatedValue += waypoints[i].value;
      accumulatedDistance += edge.distance;
    }

    path = new Path(accumulatedValue, accumulatedDistance, waypoints);

    if (path.filter(filters)) {
      paths.push(path);
    }
  });

  paths.sort((a, b) => b.value - a.value);

  return paths;
}

export default {
  Waypoint,
  Edge,
  Path,
  calculate,
};