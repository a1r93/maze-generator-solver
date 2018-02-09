const grid = [];
const gridWidth = 400
const gridHeight = 400
const rows = 60
const cols = 60
let visitedCells = []
let nbIterations = 1
let creating = true

const path = []
const failedCells = []
const cellsToVisit = []

let currentCell

function getIndex(i, j) {
  return i + j * cols
}

function setup() {
  createCanvas(gridWidth, gridHeight)
  background(0)

  button = createButton('Solve');
  button.position(width + 30, 65);
  button.mousePressed(() => {
    grid[grid.length - 1].isDestination = true
    grid[grid.length - 1].displayCell()
    currentCell = grid[0]
    currentCell.isCurrent = true
    path.push(currentCell)
    visitedCells = []
    loop()
  });

  greeting = createElement('p');
  greeting.position(width + 30, 85);

  const cellW = gridWidth/cols
  const cellH = gridHeight/rows

  for(let j = 0; j < cols; j++) {
    for(let i = 0; i < rows; i++) {
      grid[getIndex(i, j)] = new Cell(i, j, cellW, cellH)
    }
  }

  currentCell = grid[0]
  visitedCells.push(currentCell)  
  currentCell.visited = true
  currentCell.currentCell = true
}

function draw() {
  greeting.html(nbIterations)

  /**
   * Maze creator part
   */
  if (creating) {
    // Display each cell with their remaining walls
    for(let i = 0; i < rows; i++) {
      for(let j = 0; j < cols; j++) {
        grid[getIndex(i, j)].displayCell()
      }
    }
  
    // fetch the non visited neighbours
    const neighbours = getNeighbours(currentCell.i, currentCell.j)
    if (neighbours.length !== 0) {
      // Fetch a random neighbour, push it to the visited cells stack and set it as current cell
      nextCell = neighbours[Math.floor(random(neighbours.length))]
      visitedCells.push(nextCell)
      nextCell.visited = true
      nextCell.currentCell = true
      currentCell.currentCell = false
  
      // Remove the walls and set the next cell as the current one
      removeWalls(nextCell, currentCell)
      currentCell = nextCell
    // If there are no neighbours, go back to the previous cell if there is one
    } else if (visitedCells.length !== 0) {
      currentCell.currentCell = false
      currentCell = visitedCells.pop()
      currentCell.currentCell = true
    // If there are no previous cells it means we are done
    } else {
      creating = false
      noLoop()
    }
  }

  /**
   * Solving the maze
   */
  if (!creating && nbIterations > rows * rows + cols * cols) {
    const accessibleNeighb = 
      getAccessibleNeighbours(currentCell.i, currentCell.j)
        .filter(val => !hasCell(visitedCells, val) && !hasCell(failedCells, val))


    if (accessibleNeighb.length === 0) {
      const previousCell = currentCell
      previousCell.currentCell = false
      previousCell.isPath = false
      failedCells.push(previousCell)
      previousCell.displayCell()
      currentCell = visitedCells.pop()
      currentCell.currentCell = true
    } else {
      accessibleNeighb.forEach(val => {
        cellsToVisit.push(val)
      })
      currentCell.currentCell = false
      currentCell.isPath = true
      currentCell.displayCell()
      visitedCells.push(currentCell)
      const nextCell = accessibleNeighb.pop()
      nextCell.currentCell = true
      currentCell = nextCell
    }
    if (currentCell.isDestination) noLoop()
    else currentCell.displayCell()
  }

  nbIterations++
}

function getNeighbours(i, j){
  const neighbours = []
  if (i > 0) {
    if (!grid[getIndex(i - 1, j)].visited)
      neighbours.push(grid[getIndex(i - 1, j)])
  }
  if (j > 0) {
    if (!grid[getIndex(i, j - 1)].visited)
      neighbours.push(grid[getIndex(i, j - 1)])
  }
  if (i < rows-1) {
    if (!grid[getIndex(i + 1, j)].visited)
      neighbours.push(grid[getIndex(i + 1, j)])
  }
  if (j < cols-1) {
    if (!grid[getIndex(i, j + 1)].visited)
      neighbours.push(grid[getIndex(i, j + 1)])
  }
  return neighbours
}

getAccessibleNeighbours = (i, j) => {
  const neighbours = []
  if (j > 0 && !currentCell.walls[0])
    neighbours.push(grid[getIndex(i, j - 1)])
  if (i > 0 && !currentCell.walls[1])
    neighbours.push(grid[getIndex(i - 1, j)])
  if (j < cols - 1 && !currentCell.walls[2])
    neighbours.push(grid[getIndex(i, j + 1)])
  if (i < rows - 1 && !currentCell.walls[3])
    neighbours.push(grid[getIndex(i + 1, j)])
  return neighbours
}

function getWall(currI, prevI, currJ, prevJ) {
  if (currI === prevI) {
    if (currJ < prevJ) return 2
    return 0
  }
  if (currJ === prevJ) {
    if (currI < prevI) return 3
    return 1
  }
}

function removeWalls(currentCell, previousCell) {
  const currWall = getWall(currentCell.i, previousCell.i, currentCell.j, previousCell.j)
  const prevWall = getWall(previousCell.i, currentCell.i, previousCell.j, currentCell.j)
  currentCell.walls[currWall] = false
  previousCell.walls[prevWall] = false
}

hasCell = (array, cell) =>
  array.filter(val => val.x === cell.x && val.y === cell.y).length !== 0
