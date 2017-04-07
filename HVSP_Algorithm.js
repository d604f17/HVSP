var POI = require("./POI");

// skal hentes med API:
var s = new POI.poi(56, 10, 0);
var p1 = new POI.poi(56.1, 10, 2);
var p2 = new POI.poi(56, 10.1, 3);
var p3 = new POI.poi(56.1, 10.1, 4);

//liste over points of interrests
var poi_list = [s, p1, p2, p3];

//2d array over udregnede edges
var edge_list = [];

//liste over de paths der føre hen til en poi:
var best_paths = []; // alle paths der ender i s ("0")

//path object
function Path(pathRoute, distance, value) {
    this.pathRoute = pathRoute;
    this.distance = distance;
    this.value = value;
}

function HVSP (poi_list, distance){
    var working_path_list = [];
    var tempPath;
    //ikke tilbage til s
    for(var i = 1; i < poi_list.length; i++){
        tempPath = getPath(undefined, i);
        if(tempPath.distance <= distance/2){
            addPathIfBetter(tempPath, working_path_list);
        }
    }

    while(working_path_list.length != 0) {
        var nextPathInLine = working_path_list.shift();
        for(var j = 0; j < poi_list.length; j++){
            if(j==0){
                tempPath = getPath(nextPathInLine, j);
                if(tempPath.distance <= distance) {
                    addPathIfBetter(tempPath, best_paths);
                }
            } else if (!nextPathInLine.pathRoute.includes(j.toString())) {
                tempPath = getPath(nextPathInLine, j);
                if(tempPath.distance <= distance) {
                    addPathIfBetter(tempPath, working_path_list);
                }
            }
        }
    }
    //test
    // console.log("edge_list");
    // console.log(edge_list);
    // console.log("working_path_list");
    // console.log(working_path_list);
    console.log("best_paths");
    console.log(best_paths);
}

function getEgdeLength(firstInt, secondInt) {
    var smallInt, bigInt;
    if(firstInt-secondInt < 0){
        smallInt = firstInt;
        bigInt = secondInt;
    } else {
        smallInt = secondInt;
        bigInt = firstInt;
    }

    if(!edge_list[smallInt]){
        edge_list[smallInt] = [];
        edge_list[smallInt][bigInt] = POI.getDistanceFromLatLonInKm(poi_list[smallInt].latitude, poi_list[smallInt].longitude, poi_list[bigInt].latitude, poi_list[bigInt].longitude);
    } else if(!edge_list[smallInt][bigInt]) {
        edge_list[smallInt][bigInt] = POI.getDistanceFromLatLonInKm(poi_list[smallInt].latitude, poi_list[smallInt].longitude, poi_list[bigInt].latitude, poi_list[bigInt].longitude);
    }
    return edge_list[smallInt][bigInt];
}

function getPath(onPath, toPOIInt) {
    var currentPOINumber, pathDistance, pathString, pathValue;
    if(onPath === undefined){
        pathDistance = getEgdeLength(0, toPOIInt);
        pathString = "0" + toPOIInt.toString();
        pathValue = poi_list[toPOIInt].value;
    } else {
        currentPOINumber = onPath.pathRoute.substr(onPath.pathRoute.length - 1);
        pathDistance = onPath.distance + getEgdeLength(currentPOINumber, toPOIInt);
        pathString = onPath.pathRoute.toString() + toPOIInt.toString();
        pathValue = onPath.value + poi_list[toPOIInt].value;
    }
    return new Path(pathString, pathDistance, pathValue);
}

function addPathIfBetter(path, pathList) {
    var regexpString = "";
    var regexp;
    var pathDecided = false;
    for(var i = 0; i < path.pathRoute.length - 1; i++){
        regexpString += "[" + path.pathRoute + "]";
    }
    regexpString += "[" + path.pathRoute.substr(path.pathRoute.length - 1) + "]"; // skal slutte i den samme poi
    regexp = new RegExp(regexpString);

    for(var j = 0; j < pathList.length; j++){
        if(regexp.test(pathList[j].pathRoute)){
            if(pathList[j].distance > path.distance){
                // console.log(path.pathRoute + " = " + path.distance + " has replaced " + pathList[j].pathRoute + " = " + pathList[j].distance);
                pathList[j] = path;
                pathDecided = true;
            } else {
                // console.log(pathList[j].pathRoute + " = " + pathList[j].distance + " is better than the new " + path.pathRoute + " = " + path.distance);
                pathDecided = true;
            }
        }
    }

    if(!pathDecided){
        pathList.push(path);
    }
}

//test
HVSP(poi_list,31);
