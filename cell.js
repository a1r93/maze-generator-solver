function Cell(i, j, width, height) {
    this.x = i * width
    this.y = j * height
    this.i = i
    this.j = j
    this.width = width
    this.height = height
    // Top Left Bottom Right
    this.walls = generateWalls(this.x, this.y, this.width, this.height)
    this.visited = false
    this.currentCell = false
    this.isDestination = false
    this.isPath = false

    this.displayCell = function() {
        if (this.isDestination) fill(244, 66, 86)
        else if (this.isPath) fill(66, 244, 167)
        else if (this.currentCell) fill(239, 112, 214)
        else if (this.visited) fill(122, 169, 244)
        else fill(200)
        noStroke()
        rect(this.x, this.y, this.width, this.height)

        stroke(80)
        strokeWeight(2)
        this.displayWalls()
    }

    this.displayWalls = function(){
        if (this.walls[0]) {
            line(this.x, this.y, this.x + height, this.y)
        }
        if (this.walls[1]) {
            line(this.x, this.y, this.x, this.y + this.height)    
        }
        if (this.walls[2]) {
            line(this.x, this.y + width, this.x + this.height, this.y + this.width)
        }
        if (this.walls[3]) {
            line(this.x + width, this.y, this.x + width, this.y + height)
        }
    }
}

const generateWalls = (x, y, cellWidth, cellHeight) => {
    const walls = []
    if (y === 0) walls.push(false)
    else walls.push(true)
    if (x === 0) walls.push(false)
    else walls.push(true)
    if (y + cellHeight >= height) walls.push(false)
    else walls.push(true)
    if (x + cellWidth >= width) walls.push(false)
    else walls.push(true)
    
    return walls
}
