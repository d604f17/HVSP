'use strict';

var _main = require('./main.js');

var maxDistance = 30;

var paths = (0, _main.calculate)([new _main.Waypoint(56, 10, 0), new _main.Waypoint(56.1, 10, 2), new _main.Waypoint(56, 10.1, 3), new _main.Waypoint(56.1, 10.1, 4)], {
  distance: function distance(val) {
    return val < maxDistance / 2;
  }
});

//console.log(paths);
//# sourceMappingURL=demo.js.map