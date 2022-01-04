const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(fieldArray){
    this.field = fieldArray;
  }
  
  randomStart(){
    const flat = Math.floor(this.field[0].length * this.field.length)
    const randomS = {
      x: Math.floor(Math.random() * this.field[0].length),
      y: Math.floor(Math.random() * this.field.length) 
    }

    while(this.field[randomS.y][randomS.x] !== fieldCharacter){
      randomS.x = Math.floor(Math.random() * this.field[0].length);
      randomS.y = Math.floor(Math.random() * this.field.length);
    }

    this.position = new Position(randomS.x, randomS.y);

    console.log(randomS.x)
    console.log(randomS.y)
    console.log(flat)

    this.field[this.position.y][this.position.x] = pathCharacter;
  }
  
  
  runGame(){
    this.randomStart();
    let playing = true;
    let time = 0
    while(playing){
      for(let i = 0; i < this.field[0].length * this.field.length; i++){
        time++;
        this.print();
        // this.addHat();
        this.askQuestion();
        if(!this.isInBounds()){
          console.log('Out of bounds');
          playing = false;
          break;
        } else if(this.isHat()){
          console.log('You win!');
          playing = false;
          break;
        } else if(this.isHole()){
          console.log('You lose');
          playing = false;
          break;
        } else if(this.isFull()){
          console.log('full');
          playing = false;
          break;
        }
        if(time % 3 === 0 && time !== 0){
          this.addHole();
        }
        this.field[this.position.y][this.position.x] = pathCharacter;
      }
    }
  }

  askQuestion() {
    const answer = prompt('where you want to go: ').toLowerCase();
    switch (answer) {   
      case 'w':
        this.position.move('up');
        // this.position.y -= 1;
        break;
      case 's':
        this.position.move('down');
        // this.position.y += 1;
        break;
      case 'a':
        this.position.move('left');
        // this.position.x -= 1;
        break;
      case 'd':
        this.position.move('right');
        // this.position.x += 1;
        break;
      default:
        console.log('enter w, s, a or d');
        this.askQuestion();
        break;
    }
  }

  isHat(){
    return this.field[this.position.y][this.position.x] === hat;
  }

  isHole(){
    return this.field[this.position.y][this.position.x] === hole;
  }

  isInBounds(){
    return(
      this.position.y >= 0 &&
      this.position.x >= 0 &&
      this.position.y < this.field.length &&
      this.position.x < this.field[0].length
    );
  }

  print(){
    for(let i = 0; i < this.field.length; i++){
      console.log(this.field[i].join(''));
    }
  }

  addHole(){
    const positionHole = {
      x: Math.floor(Math.random() * this.field[0].length),
      y: Math.floor(Math.random() * this.field.length) 
    }
    while(this.field[positionHole.y][positionHole.x] !== fieldCharacter){
      positionHole.x = Math.floor(Math.random() * this.field[0].length);
      positionHole.y = Math.floor(Math.random() * this.field.length);
    }

    this.field[positionHole.y][positionHole.x] = hole;
  }

  isFull(){
    const www = element => element === fieldCharacter;
    let count = 0;
    for(let y = 0; y < this.field.length; y++){
      if(this.field[y].some(www)){
        count++;
      }
    }
    if(count === 0){
      return true
    }
  }

  static generateField(height, width, percentage = 0.1){
    const field = new Array(height).fill(1).map(num => new Array(width));
    for(let y = 0; y < field.length; y++){
      for(let x = 0; x < field[y].length; x++){
        const prob = Math.random();
        field[y][x] = prob > percentage ? fieldCharacter : hole;
      }
    }

    const positionHat = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height) 
    }

    field[positionHat.x][positionHat.y] = hat;
    return field;
  }
};

class Position {
  constructor(x, y){
    this._x = x;
    this._y = y;
  }

  set x(input){
    if (input < 0){
      console.log('x cannot be negative');
    }
    this._x = input;
  }

  get x(){
    return this._x;
  }

  set y(input){
    if (input < 0){
      console.log('y cannot be negative');
    }
    this._y = input;
  }

  get y(){
    return this._y;
  }

  move(command){
    switch(command){
      case 'up':
        this.y--;
        break;
      case 'down':
        this.y++;
        break;
      case 'left':
        this.x--;
        break;
      case 'right':
        this.x++;
        break;
      default:
        console.log('error')
        break;
    }
  }
};

// const myField = new Field(field_1);
const myField = new Field(Field.generateField(10,10,0.1));

myField.runGame();