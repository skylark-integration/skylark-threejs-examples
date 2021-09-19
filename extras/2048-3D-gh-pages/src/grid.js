function Grid(size) {
    this.size = size;
    this.cells = [];

    for (var i = 0; i < this.size; i++) {
        this.cells[i] = [];
        for (var j = 0; j < this.size; j++) {
            this.cells[i][j] = [];
            for (var k = 0; k < this.size; k++)
                this.cells[i][j][k] = null;
        }
    }

    this.isCellInside = function(cell) {
        return cell.i >= 0 && cell.i < this.size
            && cell.j >= 0 && cell.j < this.size
            && cell.k >= 0 && cell.k < this.size;
    }

    this.getTile = function(cell) {
        return this.isCellInside(cell) ? this.cells[cell.i][cell.j][cell.k] : null;
    }

    this.setTile = function(cell, tile) {
        if (this.isCellInside(cell))
            this.cells[cell.i][cell.j][cell.k] = tile;
    }

    this.isEmptyCell = function(cell) {
        return this.getTile(cell) == null;
    }

    this.cellsCanMerge = function(cell1, cell2) {
        if (this.isEmptyCell(cell1) || this.isEmptyCell(cell2))
            return false;

        var tile1 = this.getTile(cell1);
        var tile2 = this.getTile(cell2);

        return tile1.value == tile2.value
            && tile1.mergedTile == null
            && tile2.mergedTile == null;
    }

    this.getEmptyCells = function() {
        var emptyCells = [];

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                for (var k = 0; k < this.size; k++) {
                    var cell = new Cell(i, j, k);
                    if (this.isEmptyCell(cell))
                        emptyCells.push(cell);
                }
            }
        }

        return emptyCells;
    }

    this.canMove = function() {
        if (this.getEmptyCells().length != 0)
            return true;

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                for(var k = 0; k < this.size; k++) {
                    var cell = new Cell(i, j, k);
                    if (this.cellsCanMerge(cell, new Cell(i + 1, j, k))
                        || this.cellsCanMerge(cell, new Cell(i, j + 1, k))
                        || this.cellsCanMerge(cell, new Cell(i, j, k + 1)))
                        return true;
                }
            }
        }

        return false;
    }

    this.addRandomTile = function() {
        var emptyCells = this.getEmptyCells();
        var len = emptyCells.length;

        if (len != 0) {
            var cell = emptyCells[Math.floor(Math.random() * len)];
            var value = (Math.random() > 0.9) ? 4 : 2;
            this.setTile(cell, new Tile(cell, value));
        }
    }

    this.moveGetCell = function(i, j, k, dir) {
        var ci = (dir.x == 1) ? (this.size - 1 - i) : i;
        var cj = (dir.y == 1) ? (this.size - 1 - j) : j;
        var ck = (dir.z == 1) ? (this.size - 1 - k) : k;

        return new Cell(ci, cj, ck);
    }

    this.moveFindNextCell = function(cell, dir) {
        var prev;
        var next = cell;

        do {
            prev = next;
            next = new Cell(prev.i + dir.x, prev.j + dir.y, prev.k + dir.z);
        } while(this.isCellInside(next) && (this.isEmptyCell(next) || this.cellsCanMerge(cell, next)));

        return prev;
    }

    this.moveTile = function(cell, next) {
        var tile = this.getTile(cell);

        if (!this.isEmptyCell(next)) {
            var tile2 = this.getTile(next);
            tile.mergedTile = tile2;
            tile2.mergedTile = tile;
        }

        tile.nextCell = next;

        this.setTile(cell, null);
        this.setTile(next, tile);
    }

    this.move = function(dir) {
        var moved = false;

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                for (var k = 0; k < this.size; k++) {
                    var cell = this.moveGetCell(i, j, k, dir);

                    if (!this.isEmptyCell(cell)) {
                        var tile = this.getTile(cell);
                        var next = this.moveFindNextCell(cell, dir);

                        if (!cell.isSameAs(next)) {
                            this.moveTile(cell, next);
                            moved = true;
                        }
                    }
                }
            }
        }

        return moved;
    }

    this.update = function(t) {
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                for (var k = 0; k < this.size; k++) {
                    var cell = new Cell(i, j, k);
                    if (!this.isEmptyCell(cell))
                        this.getTile(cell).update(t);
                }
            }
        }
    }

    this.new = function() {
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                for (var k = 0; k < this.size; k++) {
                    var cell = new Cell(i, j, k);
                    if (!this.isEmptyCell(cell)) {
                        this.getTile(cell).remove();
                        this.setTile(cell, null);
                    }
                }
            }
        }
    }
}
