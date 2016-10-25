function Agent(x, y) {
    var agent = this;
    x = x || random(0, windowWidth);
    y = y || random(0, windowHeight);

    this.pos = createVector(x, y);
    this.dir = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.size = createVector(20, 20);
    this.radius = 10;
    this.speed = 0;
    this.name = "";
    this.playerId = "";

    this.update = function () {
        agent.vel = p5.Vector.mult(agent.dir, agent.speed);
        agent.pos.add(agent.vel);
    }

    this.draw = function () {
        agent.update();
        ellipse(agent.pos.x, agent.pos.y, agent.radius);
        if (agent.name) {
            push();
            stroke(0)
            fill(255);
            strokeWeight(3);
            textAlign(CENTER);
            text(agent.name, agent.pos.x, agent.pos.y - 10)
            pop();
        }
    }

    this.randomPosition = function () {
        agent.pos = createVector(random(windowWidth, windowHeight))
    }

    this.move = function (x, y) {
        agent.pos.add(createVector(x, y));
    }
}