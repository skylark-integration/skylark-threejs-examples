var useWebGL, renderer, scene, camera, controls, boxGeometry, textures;
var grid, score, best, win, neverWon, isAnimated, animStartTime;
var storage;

function isWebGLAvailable() {
    try {
        var canvas = document.createElement("canvas");
        return (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
            && window.WebGLRenderingContext;
    } catch(err) {
        return false;
    }
}

function setObjectPosition(obj, cell) {
    var x = 2 * (cell.i - (grid.size - 1) / 2);
    var y = 2 * (cell.j - (grid.size - 1) / 2);
    var z = 2 * (cell.k - (grid.size - 1) / 2);

    obj.position.set(x, y, z);
}

function tryAgain() {
    grid.new();
    score = 0;
    win = false;
    neverWon = true;
    isAnimated = false;
    animStartTime = 0;

    grid.addRandomTile();
    grid.addRandomTile();

    storage.save();

    updateHUD();
}

function onKeydown(evt) {
    if (isAnimated)
        return;

    if (evt.which == 37) // Left
        var dir = {x: -1, y: 0, z: 0};
    else if (evt.which == 38) // Up
        var dir = {x: 0, y: 0, z: -1};
    else if (evt.which == 39) // Right
        var dir = {x: 1, y: 0, z: 0};
    else if (evt.which == 40) // Down
        var dir = {x: 0, y: 0, z: 1};
    else if (evt.which == 81) // Q
        var dir = {x: 0, y: 1, z: 0};
    else if (evt.which == 87) // W
        var dir = {x: 0, y: -1, z: 0};
    else
        return;

    var n = Math.floor((controls.getAzimuthalAngle() + Math.PI / 4) / (Math.PI / 2));
    for (var i = 0; i < (n + 4) % 4; i++) {
        var tmp = dir.x;
        dir.x = dir.z;
        dir.z = -tmp;
    }

    isAnimated = grid.move(dir);
}

function onResize() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
}

function init() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    useWebGL = isWebGLAvailable();

    if (useWebGL)
        renderer = new THREE.WebGLRenderer({antialias: true});
    else
        renderer = new THREE.CanvasRenderer();

    renderer.setClearColor(0xbbada0);
    renderer.setSize(w, h);
    document.getElementById("container").appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, w / h, 1, 100);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableKeys = false;

    boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    textures = new Textures();

    grid = new Grid(3);
    score = 0;
    best = 0;
    win = false;
    neverWon = true;
    isAnimated = false;
    animStartTime = 0;

    storage = new Storage();

    var mesh = new THREE.Mesh(boxGeometry);
    for(var i = 0; i < grid.size; i++) {
        for(var j = 0; j < grid.size; j++) {
            for(var k = 0; k < grid.size; k++) {
                var cell = new Cell(i, j, k);
                var box =  new THREE.BoxHelper(mesh, 0x776e65);
                setObjectPosition(box, cell);
                scene.add(box);
            }
        }
    }

    var cell = new Cell((grid.size - 3) / 2, grid.size, grid.size + 1);
    setObjectPosition(camera, cell);
    camera.lookAt(scene.position);

    if (!storage.load()) {
        grid.addRandomTile();
        grid.addRandomTile();
    } else {
        updateHUD();
    }

    document.addEventListener("keydown", onKeydown);
    window.addEventListener("resize", onResize);
}

function updateHUD() {
    if (win && neverWon) {
        togglePopup("win");
        neverWon = false;
    }

    if (!grid.canMove())
        togglePopup("gameOver");

    document.getElementById("current-score").innerHTML = score;
    document.getElementById("best-score").innerHTML = best;
}

function update() {
    if (!isAnimated)
        return;

    var currentTime = Date.now();
    if (animStartTime == 0)
        animStartTime = currentTime;

    var t = Math.min((currentTime - animStartTime) / 125, 1);
    grid.update(t);

    if (t == 1) {
        animStartTime = 0;
        isAnimated = false;
        grid.addRandomTile();

        if(score > best)
            best = score;

        updateHUD();

        storage.save();
    }
}

function render() {
    renderer.render(scene, camera);
}

function mainLoop() {
    update();
    render();
    requestAnimationFrame(mainLoop);
}
