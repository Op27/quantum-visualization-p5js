let particles = [];
let target;
let isGathering = false;
let shapeType = '';

class Particle {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.size = 5 * 1.3 * 0.9; 
    this.speed = 2;
    this.isArranged = false;
    this.color = color(255); 
  }

  move() {
    if (isGathering && target) {
      let direction = p5.Vector.sub(target, this.position);
      direction.setMag(this.speed);
      this.velocity.lerp(direction, 0.05);
    }
    this.position.add(this.velocity);
    this.wrapAround();
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.position.x, this.position.y, this.size, this.size);
  }

  wrapAround() {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  }

  vibrate() {
    if (this.isArranged) {
      this.position.x += random(-1, 1);
      this.position.y += random(-1, 1);
    }
  }
}

function setup() {
  createCanvas(800, 600);
  background(0);
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0);
  particles.forEach(particle => {
    particle.move();
    particle.display();
    particle.vibrate();
  });
}

function mousePressed() {
  target = createVector(mouseX, mouseY);
  isGathering = true;
  shapeType = random(['circle', 'square', 'human']);

  setTimeout(() => {
    arrangeParticles(shapeType);
    isGathering = false;
  }, 3000); // 3 seconds delay
}

function arrangeParticles(shape) {
  switch (shape) {
    case 'circle':
      arrangeInCircle(target, 100); 
      break;
    case 'square':
      arrangeInSquare(target, 100); 
      break;
    case 'human':
      arrangeInHumanShape(target, 50); 
      break;
  }
}

function arrangeInCircle(center, radius) {
  let angleStep = TWO_PI / particles.length;
  particles.forEach((particle, index) => {
    let angle = angleStep * index;
    particle.position.x = center.x + cos(angle) * radius;
    particle.position.y = center.y + sin(angle) * radius;
    particle.isArranged = true;
    particle.color = (index % 5 === 0) ? commonColor() : earthColor(); // Common color every fifth particle
  });
}

function earthColor() {
  let colors = [color(0, 128, 0), color(0, 0, 255), color(139, 69, 19)]; // Green, Blue, Brown
  return random(colors);
}

function arrangeInSquare(center, halfWidth) {
  let numPerSide = sqrt(particles.length);
  particles.forEach((particle, index) => {
    let row = floor(index / numPerSide);
    let col = index % numPerSide;
    particle.position.x = center.x + col * (halfWidth * 2 / numPerSide) - halfWidth;
    particle.position.y = center.y + row * (halfWidth * 2 / numPerSide) - halfWidth;
    particle.isArranged = true;
    particle.color = (index % 5 === 0) ? commonColor() : moonColor(); // Common color every fifth particle
  });
}

function moonColor() {
  let colors = [color(192, 192, 192), color(128, 128, 128), color(255)]; // Silver, Gray, White
  return random(colors);
}

function arrangeInHumanShape(center, size) {
  let numParticles = particles.length;
  let bodyHeight = size * 4;
  let bodyWidth = size * 2;
  let headRadius = size;

  // Arrange particles for the head
  for (let i = 0; i < numParticles / 5; i++) {
    let angle = random(TWO_PI);
    let r = random(headRadius);
    particles[i].position.x = center.x + cos(angle) * r;
    particles[i].position.y = center.y - bodyHeight / 2 + sin(angle) * r;
    particles[i].isArranged = true;
    particles[i].color = (i % 5 === 0) ? commonColor() : universeColor(); // Common color every fifth particle
  }

  // Arrange particles for the body
  for (let i = floor(numParticles / 5); i < numParticles; i++) {
    particles[i].position.x = center.x + random(-bodyWidth / 2, bodyWidth / 2);
    particles[i].position.y = center.y - bodyHeight / 2 + random(headRadius * 2, bodyHeight);
    particles[i].isArranged = true;
    particles[i].color = (i % 5 === 0) ? commonColor() : universeColor(); // Common color every fifth particle
  }
}

function universeColor() {
  return color(random(255), random(255), random(255)); // Random bright color
}

function commonColor() {
  // Returns a light blue color that is common across all shapes
  return color(173, 216, 230); // Light Blue
}