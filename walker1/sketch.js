let cols, rows;
let spinner = 40
let w = spinner;
let h = spinner;


let grid;
let current;

let openSet = [];
let path = [];

let closedSet = [];
let startPosition, endPosition;

function removeFromArray(arr, element) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == element) {
            arr.splice(i, 1);
        }
    }
}

function setup() {

    let debug = true;
    createCanvas(400, 400);

    let cols = floor(width / w);
    let rows = floor(height / h);

    if (debug) console.log(new Date() + ' ' + 'cols: ' + cols);
    if (debug) console.log(new Date() + ' ' + 'rows: ' + rows);




    grid = new Array(cols);

    if (debug) console.log(new Date() + ' ' + 'Show grid (nulls):' + JSON.stringify(grid, null, 4));
    frameRate(5);


    for (let i = 0; i < cols; i++) {

        grid[i] = new Array(rows);


    }
    if (debug) console.log(new Date() + ' ' + 'Show grid(2D):' + JSON.stringify(grid, null, 4));

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {

            grid[i][j] = new TNode(i, j, determineBlocked());
        }
    }

    if (debug) console.log(new Date() + ' ' + 'Show grid (Populated sans neighbors):' + JSON.stringify(grid, null, 4));
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {

            // grid[i][j].addNeighbors(grid, cols, rows);
            grid[i][j].addNeighbors(cols, rows);


        }
    }
    if (debug) console.log(new Date() + ' ' + 'Show grid (Populated with neighbors):' + JSON.stringify(grid, null, 4));



    startPosition = grid[0][0];
    endPosition = grid[cols - 1][rows - 1];

    startPosition.blocked = false;
    endPosition.blocked = false;

    openSet.push(startPosition);

    console.log(grid);
}

function heuristic(a, b) {

    console.log(new Date() + ' ' + 'Value of A' + JSON.stringify(a, null, 4));
    console.log(new Date() + ' ' + 'Value of B' + JSON.stringify(b, null, 4));

    let d = dist(a.i, a.j, b.i, b.j);
    d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
}

function draw() {
    let debug = false;
    background(51);



    console.log(new Date() + ' ' + 'openSet:' + JSON.stringify(openSet, null, 4));
    if (openSet.length > 0) {

        let winner = 0;

        for (let i = 0; i < openSet.length; i++) {

            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }

        current = openSet[winner];

        if (current === endPosition) {


            noLoop();
            console.log(new Date() + ' ' + 'Done:' + '');
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        //Check element a long a not already evaluated

        let elements = current.neighbors;

        console.log(new Date() + ' ' + 'Iterating over neighbors: ' + current.neighbors);
        elements.forEach(telement => {

            element = grid[telement.i][telement.j];

            console.log(new Date() + ' ' + 'element:' + JSON.stringify(element, null, 4));
            if (!closedSet.includes(element)) {

                let tempGValues = current.g + 1;

                if (openSet.includes(element)) {
                    if (tempGValues < element.g) {
                        element.g = tempGValues;
                    }
                } else {
                    element.g = tempGValues;
                    openSet.push(element);
                }
                console.log(new Date() + ' ' + 'Calling heuristicwith element: ' + JSON.stringify(element, null, 4));
                element.h = heuristic(element, endPosition);
                element.f = element.g + element.h;
                element.previous = current;
            }
        });
    } else {

        //No Solution
        console.log(new Date() + ' ' + 'Solution Found');

    }


    background(125);

    grid.forEach(col => {
        col.forEach(row => {
            row.show(color(255));

        });
    });

    openSet.forEach(element => {
        element.show(color(0, 255, 0));
    });


    closedSet.forEach(element => {
        element.show(color(255, 0, 0));

    });


    path = [];
    let temp = current;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;

    }

    path.forEach(element => {
        element.show(color(0, 0, 255));

    });

}

function determineBlocked() {
    let retVal = false;
    let randomNumber = random();
    if (randomNumber < .15) {
        retVal = true;
    }
    return retVal;
}

function TCordinate(i, j) {
    this.i = i;
    this.j = j;
}

function TNode(i, j, blocked) {

    this.i = i;
    this.j = j;
    this.blocked = blocked;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.correctWidth = w - 1;
    this.correctHeigth = h - 1;
    this.neighbors = [];
    this.previous = undefined;


    this.show = function(col) {

        fill(col);
        // noStroke();
        stroke(0);
        rect(this.i * w, this.j * w, this.correctWidth, this.correctHeigth);

    }

    this.addObstacles = function(col) {

        stroke(125);
        fill(col);
        rect(this.i * w, this.j * w, this.correctWidth, this.correctWidth);

        if (this.blocked) {
            // console.log('Blocking... .. .  ')
            stroke(255);
            fill(125, 0, 0);
            rect(this.i * w, this.j * w, this.correctWidth, this.correctWidth);

        }
        // if (!this.blocked) {
        //     // console.log('Clearing... .. . ')
        //     stroke(col);
        //     // noFill();
        //     fill(0, 0, 0);
        //     rect(this.i * w, this.j * w, width, width);

        // }


    }

    this.addNeighbors = function(cols, rows) {

        console.log(new Date() + ' ' + '+addNeighbors');
        let debug = true;

        let i = this.i;
        let j = this.j;

        if (debug) console.log(new Date() + ' ' + '===================================');
        if (debug) console.log(new Date() + ' ' + 'Cols:' + cols);
        if (debug) console.log(new Date() + ' ' + 'Rows:' + rows);
        // if (debug) console.log(new Date() + ' ' + 'Incoming Grid: ' + JSON.stringify(grid, null, 4));
        if (debug) console.log(new Date() + ' ' + 'Processing [' + i + ',' + j + ']');

        //left
        if (i > 0) {
            if (debug) console.log(new Date() + ' ' + 'Found Left' + '=> [' + (i - 1) + ',' + j + ']');

            pt = new TCordinate(i - 1, j);
            this.neighbors.push(pt);
            // this.neighbors.push(grid[i - 1][j]);
        }

        //right
        if (i < cols - 1) {
            if (debug) console.log(new Date() + ' ' + 'Found Right' + '=> [' + (i + 1) + ',' + j + ']');

            pt = new TCordinate(i + 1, j);
            this.neighbors.push(pt);

            // this.neighbors.push(grid[i + 1][j]);
        }

        //top
        if (j > 0) {
            if (debug) console.log(new Date() + ' ' + 'Found Top' + '=> [' + i + ',' + (j - 1) + ']');

            pt = new TCordinate(i, j - 1);
            this.neighbors.push(pt);
            // this.neighbors.push(grid[i][j - 1]);
        }
        //bottom
        if (j < rows - 1) {
            if (debug) console.log(new Date() + ' ' + 'Found Bottom' + '=> [' + i + ',' + (j + 1) + ']');

            pt = new TCordinate(i, j + 1);
            this.neighbors.push(pt);
            // this.neighbors.push(grid[i][j + 1]);
        }

        if (debug) console.log(new Date() + ' ' + 'derived elements: ' + this.neighbors.length);
        if (debug) console.log(new Date() + ' ' + 'derived neighbors' + JSON.stringify(this.neighbors, null, 2));

        console.log(new Date() + ' ' + '-addNeighbors');

    }
}