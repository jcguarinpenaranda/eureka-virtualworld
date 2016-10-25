var me;
var others = [];
var sock;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  me = new Agent();
  me.name = prompt('Whats your name?');

  //configure the real time game
  configureSocketIO();
}

function draw() {
  background(0);
  me.draw();

  others.forEach(function (other) {
    other.draw();
  })

  detectCollisions();

  if (keyIsPressed) {
    onKeyPressed();
  }

}

function detectCollisions() {
  others.forEach(function (other) {
    var dx = other.pos.x - me.pos.x;
    var dy = other.pos.y - me.pos.y;
    var d = Math.sqrt(dx * dx + dy * dy);

    if (d < me.radius + other.radius) {
      console.log('collided with ' + other.name)
    }
  })
}


/**
 * Cada vez que se presiona la tecla
 */
function keyPressed() {
  return false;
}

function onKeyPressed() {

  var vel = 2;
  var canMove = false;

  if (keyCode === LEFT_ARROW) {
    canMove = true;
    me.move(-vel, 0);
  } else if (keyCode === RIGHT_ARROW) {
    canMove = true;
    me.move(vel, 0);
  } else if (keyCode === UP_ARROW) {
    canMove = true;
    me.move(0, -vel)
  } else if (keyCode === DOWN_ARROW) {
    canMove = true;
    me.move(0, vel)
  }

  if (canMove) {
    sock.emit('userEvent', {
      eventName: 'walking',
      x: me.pos.x,
      y: me.pos.y,
      name: me.name
    })
  }


  return false;
}

function configureSocketIO() {
  sock = io.connect('http://localhost:5000');

  sock.on('me', function (playerId) {
    me.playerId = playerId;
    console.log('i am ' + me.playerId)
  })

  sock.on('presence', function (playerId) {
    addPlayer(playerId);
    emitPosition();
  })

  sock.on('position', function (positionData) {
    if (getPlayer(positionData.playerId)) {
      getPlayer(positionData.playerId).pos.x = positionData.x;
      getPlayer(positionData.playerId).pos.y = positionData.y;
      if (positionData.name !== getPlayer(positionData.playerId).name) {
        getPlayer(positionData.playerId).name = positionData.name
      }
    }
  })

  sock.on('connected_clients', function (clients) {
    clients.forEach(function (playerId) {
      console.log('logging playerId ', playerId)
      addPlayer(playerId);
    })
  })

  sock.on('walking', function (walkingData) {
    if (getPlayer(walkingData.playerId)) {
      getPlayer(walkingData.playerId).pos.x = walkingData.x;
      getPlayer(walkingData.playerId).pos.y = walkingData.y;
      if (walkingData.name !== getPlayer(walkingData.playerId).name) {
        getPlayer(walkingData.playerId).name = walkingData.name
      }
    }
  })

  sock.on('disconnected', function (playerId) {
    removePlayer(playerId);
  })

  emitPosition();
}

function emitPosition() {
  sock.emit('userEvent', {
    eventName: 'position',
    x: me.pos.x,
    y: me.pos.y,
    name: me.name
  })
}

function getPlayer(id) {
  for (var i = 0; i < others.length; i++) {
    if (others[i].playerId === id) {
      return others[i];
    }
  }

  return false;
}

function addPlayer(id) {
  // prevent duplicates
  if (!getPlayer(id)) {
    var newPlayer = new Agent(-20, -20);
    newPlayer.playerId = id;
    others.push(newPlayer);
  }
}

function removePlayer(playerId) {
  var index = -1;

  for (var i = 0; i < others.length; i++) {
    if (others[i].playerId === playerId) {
      index = i;
    }
  }

  if (index !== -1) {
    others.splice(index, 1);
  }

}