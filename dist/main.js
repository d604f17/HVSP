'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.calculate = calculate;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Waypoint = exports.Waypoint = function () {
  function Waypoint(latitude, longitude, value) {
    _classCallCheck(this, Waypoint);

    this.id = Waypoint.incrementID();
    this.latitude = latitude;
    this.longitude = longitude;
    this.value = value;
  }

  _createClass(Waypoint, null, [{
    key: 'incrementID',
    value: function incrementID() {
      if (!this.latestID) {
        this.latestID = 1;
      } else {
        this.latestID++;
      }

      return this.latestID;
    }
  }]);

  return Waypoint;
}();

var Edge = exports.Edge = function () {
  function Edge(from, to) {
    _classCallCheck(this, Edge);

    this.from = from;
    this.to = to;
    this.distance = this.calculateHaversine();
  }

  _createClass(Edge, [{
    key: 'calculateHaversine',
    value: function calculateHaversine() {
      var radius = 6371;
      var toRadians = function toRadians(degrees) {
        return degrees * Math.PI / 180;
      };
      var dLatitude = toRadians(this.to.latitude - this.from.latitude);
      var dLongitude = toRadians(this.to.longitude - this.from.longitude);
      var latitude1 = toRadians(this.from.latitude);
      var latitude2 = toRadians(this.to.latitude);
      var a = Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) + Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2) * Math.cos(latitude1) * Math.cos(latitude2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return radius * c;
    }
  }, {
    key: 'filter',
    value: function filter(filters) {
      var _this = this;

      return Object.keys(filters).every(function (key) {
        return filters[key](_this[key]);
      });
    }
  }]);

  return Edge;
}();

var Path = exports.Path = function () {
  function Path(value, distance, waypoints) {
    _classCallCheck(this, Path);

    this.value = value;
    this.distance = distance;
    this.waypoints = waypoints;
  }

  _createClass(Path, [{
    key: 'filter',
    value: function filter(filters) {
      var _this2 = this;

      return Object.keys(filters).every(function (key) {
        return filters[key](_this2[key]);
      });
    }
  }]);

  return Path;
}();

function calculate(waypoints, filters) {
  var paths = [];

  var getWaypointCombinations = function getWaypointCombinations(input) {
    var mask = void 0,
        results = [],
        total = Math.pow(2, input.length);

    for (mask = 1; mask < total; mask++) {
      var result = [];
      var i = input.length - 1;

      do {
        if ((mask & 1 << i) !== 0) {
          result.push(input[i]);
        }
      } while (i--);

      if (result.length >= 2 && result.some(function (waypoint) {
        return waypoint.id === 1;
      })) {
        results.push(result);
      }
    }

    return results;
  };

  var filteredWaypoints = waypoints.filter(function (waypoint) {
    return new Edge(waypoints[0], waypoint).filter(filters);
  });

  console.time('getWaypointCombinations');
  var combinations = getWaypointCombinations(filteredWaypoints);
  console.timeEnd('getWaypointCombinations');

  combinations.forEach(function (waypoints) {
    var path = void 0;
    var accumulatedValue = 0;
    var accumulatedDistance = 0;

    waypoints.sort(function (a, b) {
      return a.id - b.id;
    });

    for (var i = 1; i < waypoints.length; i++) {
      var edge = new Edge(waypoints[i - 1], waypoints[i]);
      accumulatedValue += waypoints[i].value;
      accumulatedDistance += edge.distance;
    }

    path = new Path(accumulatedValue, accumulatedDistance, waypoints);

    if (path.filter(filters)) {
      paths.push(path);
    }
  });

  paths.sort(function (a, b) {
    return b.value - a.value;
  });

  return paths;
}

exports.default = {
  Waypoint: Waypoint,
  Edge: Edge,
  Path: Path,
  calculate: calculate
};
//# sourceMappingURL=main.js.map