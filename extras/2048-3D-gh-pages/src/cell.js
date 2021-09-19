function Cell(i, j, k) {
    this.i = i;
    this.j = j;
    this.k = k;

    this.isSameAs = function(cell) {
        return this.i == cell.i && this.j == cell.j && this.k == cell.k;
    }

    this.lerp = function(cell, t) {
        var i = (1 - t) * this.i + t * cell.i;
        var j = (1 - t) * this.j + t * cell.j;
        var k = (1 - t) * this.k + t * cell.k;

        return new Cell(i, j, k);
    }
}
