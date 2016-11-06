gameplayMenuSelected = 0;
function gameplayMenuControls(i){
  var menuMove = false;
  if (player[i].inputs.b[0] && !player[i].inputs.b[1]){
    sounds.menuBack.play();
    player[i].inputs.b[1] = true;
    changeGamemode(1);
  }
  else if (player[i].inputs.a[0] && !player[i].inputs.a[1]){
    sounds.menuSelect.play();
    switch (gameplayMenuSelected){
      case 0:
        gameSettings.turbo ^= true;
        break;
      case 1:
        gameSettings.lCancelType++;
        if (gameSettings.lCancelType > 2){
          gameSettings.lCancelType = 0;
        }
        break;
      default:
        break;
    }
  }
  else if (player[i].inputs.lStickAxis[0].y > 0.7){
    stickHoldEach[i] = true;
    if (stickHold == 0){
      gameplayMenuSelected--;
      menuMove = true;
      stickHold++;
    }
    else {
      stickHold++;
      if (stickHold % 10 == 0){
        gameplayMenuSelected--;
        menuMove = true;
      }
    }
  }
  else if (player[i].inputs.lStickAxis[0].y < -0.7){
    stickHoldEach[i] = true;
    if (stickHold == 0){
      gameplayMenuSelected++;
      menuMove = true;
      stickHold++;
    }
    else {
      stickHold++;
      if (stickHold % 10 == 0){
        gameplayMenuSelected++;
        menuMove = true;
      }
    }
  }
  else {
    stickHoldEach[i] = false;
    if (i == ports-1){
      var stickHoldAll = false;
      for (var j=0;j<ports;j++){
        if (stickHoldEach[j]){
          stickHoldAll = true;
          break;
        }
      }
      if (!stickHoldAll){
        stickHold = 0;
      }
    }
  }
  if (menuMove){
    sounds.menuSelect.play();
    if (gameplayMenuSelected == -1){
      gameplayMenuSelected = 1;
    }
    else if (gameplayMenuSelected == 2){
      gameplayMenuSelected = 0;
    }
  }
}

function drawGameplayMenuInit(){
  var bgGrad =bg1.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgb(11, 65, 39)");
  bgGrad.addColorStop(1,"rgb(8, 20, 61)");
  bg1.fillStyle=bgGrad;
  bg1.fillRect(0,0,layers.BG1.width,layers.BG1.height);
  fg1.textAlign = "center";
  fg1.fillStyle = "rgba(255, 255, 255, 0.65)";
  fg1.font = "italic 900 80px Arial";
  fg1.fillText("Gameplay",600,100);
  fg1.font = "italic 900 50px Arial";
  fg1.fillText("Turbo Mode",225,275);
  fg1.fillText("L-Cancel",225,335);
}

function drawGameplayMenu(){
  clearScreen();
  bg2.lineWidth = 3;
  shine += 0.01;
  if (shine > 1.8){
    shine = -0.8;
  }
  var opacity = (shine < 0)?(0.05+(0.25/0.8)*(0.8+shine)):((shine > 1)?(0.3-(0.25/0.8)*(shine-1)):0.3);
  var bgGrad =bg2.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgba(255, 255, 255,0.05)");
  bgGrad.addColorStop(Math.min(Math.max(0,shine),1),"rgba(255,255,255,"+opacity+")");
  bgGrad.addColorStop(1,"rgba(255, 255, 255,0.05)");
  //ui.strokeStyle = "rgba(255,255,255,0.13)";
  bg2.strokeStyle = bgGrad;
  bg2.beginPath();
  for (var i=0;i<60;i++){
    bg2.moveTo(0+(i*30),0);
    bg2.lineTo(0+(i*30),750);
    bg2.moveTo(0,0+(i*30));
    bg2.lineTo(1200,0+(i*30));
  }
  bg2.stroke();
  for (var i=0;i<2;i++){
    ui.strokeStyle = "rgba(255, 255, 255, 0.72)";
    if (i == gameplayMenuSelected){
      ui.fillStyle = "rgba(255, 255, 255, 0.6)";
    }
    else {
      ui.fillStyle = "rgba(255, 255, 255, 0.2)";
    }
    ui.fillRect(400,235+i*60,300,50);
    ui.strokeRect(400,235+i*60,300,50);
    ui.font = "900 30px Arial";
    ui.textAlign = "center";
    ui.fillStyle = "white";
    ui.strokeStyle = "black";
    var text = "";
    switch (i){
      case 0:
        text = gameSettings.turbo?"On":"Off";
        break;
      case 1:
        text = gameSettings.lCancelType?(gameSettings.lCancelType==1?"Auto":"Smash 64"):"Normal";
        break;
      default:
        break;
    }
    ui.strokeText(text,550,270+i*60);
    ui.fillText(text,550,270+i*60);
  }

}