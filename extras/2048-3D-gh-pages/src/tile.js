function Tile(cell, value) {
    this.cell = cell;
    this.value = value;

    var texture = textures.getTexture(this.value);
    var material = new THREE.MeshBasicMaterial({map: texture});
    if (!useWebGL)
        material.overdraw = 0.5;

    this.mesh = new THREE.Mesh(boxGeometry, material);

    setObjectPosition(this.mesh, this.cell);
    scene.add(this.mesh);

    this.nextCell = null;
    this.mergedTile = null;

    this.remove = function() {
        scene.remove(this.mesh);
    }

    this.updatePosition = function(t) {
        if (this.nextCell == null)
            return;

        var midCell = this.cell.lerp(this.nextCell, t);
        setObjectPosition(this.mesh, midCell);

        if (t >= 1) {
            this.cell = this.nextCell;
            this.nextCell = null;
        }
    }

    this.update = function(t) {
        this.updatePosition(t);

        if (this.mergedTile != null) {
            this.mergedTile.updatePosition(t);
            if (t == 1) {
                this.mergedTile.remove();
                this.mergedTile = null;
                this.value *= 2;
                this.mesh.material.map = textures.getTexture(this.value);
                this.mesh.material.needsUpdate = true;

                score += this.value;
                if (this.value == 2048)
                    win = true;
            }
        }
    }
}
