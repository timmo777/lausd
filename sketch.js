let cols, rows;
let w = 100;
let grid = [];


function setup() {
    createCanvas(800, 800);

    cols = floor(width / w);
    rows = floor(height / w);


    for (let j = 0; j < rows; j++) {

        for (let i = 0; i < cols; i++) {
            var cell = new Cell(i, j);
            grid.push(cell);
        }
        console.log(grid);

    }
}


function draw() {
    background(51);

    for (let index = 0; index < grid.length; index++) {
        grid[index].show();
        console.log(index);

    }
}


function Cell(i, j) {

    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];


    //top, right, bottom, left  

    this.show = function() {
        let x = this.i * w;
        let y = this.j * w;

        stroke(255);

        if (this.walls[0]) {
            line(x, y, x + w, y);
        }
        if (this.walls[1]) {
            line(x + w, y, x + w, y + w);
        }
        if (this.walls[2]) {
            line(x + w, y + w, x, y + w);
        }
        if (this.walls[3]) {
            line(x, y + w, x, y);
        }

        // noFill();
        // rect(x, y, w, w);
    }

}