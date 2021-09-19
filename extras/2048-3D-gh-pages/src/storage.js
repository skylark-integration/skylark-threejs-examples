function Storage() {
    this.isAvailable = function() {
        try {
            window.localStorage.setItem("test", "0");
            window.localStorage.removeItem("test");
        } catch (err) {
            return false;
        }

        return true;
    }

    this.load = function() {
        if (!this.isAvailable())
            return false;

        var newScore = window.localStorage.getItem("2048-3D_" + grid.size + "score");
        var newBest = window.localStorage.getItem("2048-3D_" + grid.size + "best");
        var newValues = window.localStorage.getItem("2048-3D_" + grid.size + "values");

        if (newScore == undefined || newBest == undefined || newValues == undefined)
            return false;

        score = parseInt(newScore);
        best = parseInt(newBest);

        newValues = JSON.parse(newValues);
        for (var i = 0; i < grid.size; i++) {
            for (var j = 0; j < grid.size; j++) {
                for (var k = 0; k < grid.size; k++) {
                    var cell = new Cell(i, j, k);
                    if (newValues[i][j][k] != "0") {
                        var value = parseInt(newValues[i][j][k]);
                        if (value >= 2048) {
                            win = true;
                            neverWon = false;
                        }

                        grid.setTile(cell, new Tile(cell, value));
                    }
                }
            }
        }

        return true;
    }

    this.save = function() {
        if (!this.isAvailable())
            return;

        window.localStorage.setItem("2048-3D_" + grid.size + "score", score);
        window.localStorage.setItem("2048-3D_" + grid.size + "best", best);

        var values = [];
        for(var i = 0; i < grid.size; i++) {
            values[i] = [];
            for(var j = 0; j < grid.size; j++) {
                values[i][j] = [];
                for(var k = 0; k < grid.size; k++) {
                    var cell = new Cell(i, j, k);
                    values[i][j][k] = grid.isEmptyCell(cell) ? 0 : grid.getTile(cell).value;
                }
            }
        }

        window.localStorage.setItem("2048-3D_" + grid.size + "values", JSON.stringify(values));
    }
}
