/* eslint-disable */

import {
  inverseMatrix,
  multMatVect
} from "main/linAlg";

export const button = {
  a: 0,
  b: 1,
  x: 2,
  y: 3,
  z: 4,
  r: 5,
  l: 6,
  s: 7, // start
  du: 8, // d-pad up
  dr: 9, // d-pad right
  dd: 10, // d-pad down
  dl: 11, // d-pad left
  lsX: 12, // left analog stick left/right
  lsY: 13, // left analog stick up/down
  csX: 14, // c-stick left/right
  csY: 15, // c-stick up/down
  lA: 16, // L button analog sensor
  rA: 17 // R button analog sensor
};

export const keyboardMap = [
  [102, 186],
  [101, 76],
  [100, 75],
  [104, 79],
  [103, 73],
  [105, 80],
  [107, 192, 222],
  [109, 219], 71, 78, 66, 86
];

const mayflashMap  = [1, 2, 0, 3, 7, 5, 4, 9, 12, 13, 14, 15, 0, 1, 5, 2, 3, 4]; // ID 0, Mayflash Wii U 4-way adapter
const vJoyMap      = [0, 1, 2, 3, 4, 5, 6, 7, 8 , 11, 9 , 10, 0, 1, 3, 4, 2, 5]; // ID 1, vJoy
const raphnetMap   = [4, 3, 2, 1, 7, 6, 5, 0, 8 , 10, 9 , 11, 0, 1, 3, 4, 5, 6]; // ID 2, raphnet N64 adapter
const xbox360Map   = [0, 2, 1, 3, 5, 7, 6, 9, 12, 15, 13, 14, 0, 1, 2, 3, 6, 7]; // ID 3, XBOX 360 (XInput Standard Gamepad)
const tigergameMap = [0, 1, 2, 3, 6, 5, 4, 7, 11, 9 , 10, 8 , 0, 1, 2, 3, 5, 4]; // ID 4, TigerGame 3-in-1 adapter
const retrolinkMap = [2, 3, 1, 0, 6, 5, 4, 9, 10, 11, 8 , 7 , 0, 1, 2, 5, 3, 4]; // ID 5, Retrolink controller

export const controllerMaps = [mayflashMap, vJoyMap, raphnetMap, xbox360Map, tigergameMap, retrolinkMap];

const customDeadzone = function() {
  this.ls = new Vec2D(0, 0);
  this.cs = new Vec2D(0, 0);
  this.l = 0;
  this.r = 0;
};

export const cd = [new customDeadzone, new customDeadzone, new customDeadzone, new customDeadzone];

export function controllerNameFromIDnumber(number) {
  if (number == 0) {
    return "Mayflash Wii-U adapter";
  } else if (number == 1) {
    return "vJoy";
  } else if (number == 2) {
    return "raphnet N64 adapter";
  } else if (number == 3) {
    return "XBOX 360 compatible controller";
  } else if (number == 4) {
    return "TigerGame 3-in-1";
  } else if (number == 5) {
    return "Retrolink controller";
  } else {
    return "error: controller detected but not supported";
  }
};

export function controllerIDNumberFromGamepadID(gamepadID) {
  if (gamepadID[0] == "M" || 
      gamepadID.substring(0,7) == "NEXILUX" || 
      gamepadID.substring(0,2) == "1a" || 
      gamepadID.substring(0,9) == "0079-1845") {
    return 0;
  } // Mayflash Wii-U 4-way adapter
    // OR
    // Nexilux adapter
    // text ID: NEXILUX GAMECUBE Controller Adapter (Vendor: 0079, Product: 1845)
  else if (gamepadID[0] == "v" || gamepadID[0] == "1") {
    return 1;
  } // vJoy
  else if (gamepadID.substring(0, 2) == "GC" || gamepadID[0] == "2") {
    return 2;
  } // raphnet N64 adapter
  else if (gamepadID[0] == "X" || gamepadID[0] == "x" || gamepadID[0] == "W") {
    return 3;
  } // XBOX 360 controller, or general XInput standard gamepad
  else if (gamepadID.substring(0,9) == "TigerGame" || gamepadID.substring(0, 9) == "0926-2526") {
    return 4; // TigerGame 3-in-1 adapter
  }           // text ID: TigerGame XBOX+PS2+GC Game Controller Adapter (Vendor: 0926 Product:2526)  
  else if (gamepadID.substring(0,7) == "Generic" || gamepadID.substring(0,9) == "0079-0006") {
    return 5; // Retrolink adapter
  }           // text ID: Generic USB Joystick (Vendor: 0079 Product: 0006)
    
  else {
    return -1;
  }
};


// The following function renormalises axis input,
// so that corners (l = left, r = right, d=down, u=up) are mapped to the respective corners of the unit square.
// This function assumes that ALL coordinates have already been centered.
// Return type: [xnew,ynew]
export function renormaliseAxisInput([lx, ly], [rx, ry], [dx, dy], [ux, uy], [x, y]) {
  if ((x * ry - y * rx <= 0) && (x * uy - y * ux >= 0)) // quadrant 1
  {
    let invMat = inverseMatrix([
      [rx, ux],
      [ry, uy]
    ]);
    return multMatVect(invMat, [x, y]);
  } else if ((x * uy - y * ux <= 0) && (x * ly - y * lx >= 0)) // quadrant 2
  {
    let invMat = inverseMatrix([
      [-lx, ux],
      [-ly, uy]
    ]);
    return multMatVect(invMat, [x, y]);
  } else if ((x * ly - y * lx <= 0) && (x * dy - y * dx >= 0)) // quadrant 3
  {
    let invMat = inverseMatrix([
      [-lx, -dx],
      [-ly, -dy]
    ]);
    return multMatVect(invMat, [x, y]);
  } else // quadrant 4
  {
    let invMat = inverseMatrix([
      [dx, -rx],
      [dy, -ry]
    ]);
    return multMatVect(invMat, [x, y]);
  }
};

// The following functions renormalise input to mimic GC controllers.

// clamps a value between -1 and 1
function toInterval (x) {
  if (x < -1) {
    return -1;
  }
  else if (x > 1) {
    return 1;
  }
  else {
    return x;
  }
};



// Melee GC controller simulation
// data courtesy of ARTIFICE

const steps = 80;
const deadzoneConst = 0.28;

// horizontal: 19 -- 122 -- 232
const meleeXMin  = 19 ;
const meleeXOrig = 122;
const meleeXMax  = 232;
// vertical  : 32 -- 134 -- 246
const meleeYMin  = 32 ;
const meleeYOrig = 134;
const meleeYMax  = 232;

// rescales -1 -- 0 -- 1 to min -- orig -- max, and rounds to nearest integer
function discretise (x, min, orig, max) {
  if (x < 0) {
    return Math.round((x*(orig-min)+orig));
  }
  else if (x > 0) {
    return Math.round((x*(max-orig)+orig));
  }
  else {
    return orig;
  }
};

// Analog sticks.
function scaleToGCAxis ( x, offset, scale ) {
    return toInterval((x+offset) * scale);
};

function scaleToGCXAxis (x, offsetX, scaleX) {
  return discretise(scaleToGCAxis(x, offsetX, scaleX), meleeXMin, meleeXOrig, meleeXMax);
};

function scaleToGCYAxis (y, offsetY, scaleY) {
  return discretise(scaleToGCAxis(y, offsetY, scaleY), meleeYMin, meleeYOrig, meleeYMax);
};

// Analog triggers.
// t = trigger input
export function scaleToGCTrigger ( t, offset, scale ) {
    let tnew = (t+offset) * scale;
    if (tnew > 1){
      return 1;
    }
    else if (tnew < 0.3){
      return 0;
    }
    else {
      return tnew;
    }    
};

// basic mapping from 0 -- 255 back to -1 -- 1 done by Melee
function axisRescale ( x, orig, bool) {
  // the following line is equivalent to checking that the result of this function lies in the deadzone
  // no need to check for deadzones later
    if ( bool && Math.abs (x+1-orig) < deadzoneConst * steps) {
      return 0;
    }
    else {
      return (x-orig+1) / steps; // +1 apparently needed
    }
};


function meleeXAxisRescale (x, bool) {
  return axisRescale ( x, meleeXOrig, bool );
};

function meleeYAxisRescale (y, bool) {
  return axisRescale ( y, meleeYOrig, bool );
};

function nonLinearRescale ( [x,y] ) {
  let norm = Math.sqrt(x*x + y*y);
  if (norm < 1) {
    return ([x,y]);
  }
  else if (Math.abs(y) <= Math.abs(x)/6){ // constants (norm < 1 above, 1/6 here) may not be proper
    return ([toInterval(x),y]);
  }
  else {
    return ( [x/norm, y/norm]);
  }
};

function meleeRound (x) {
  return Math.round(steps*x)/steps;
};

export function scaleToMeleeAxes ( x, y, offsetX, offsetY, scaleX, scaleY, bool ) {
    let xnew = meleeXAxisRescale (scaleToGCXAxis ( x, offsetX, scaleX ), bool);
    let ynew = meleeYAxisRescale (scaleToGCYAxis ( y, offsetY, scaleY ), bool);
    return  (nonLinearRescale ( [xnew, ynew] )).map(meleeRound);
};
