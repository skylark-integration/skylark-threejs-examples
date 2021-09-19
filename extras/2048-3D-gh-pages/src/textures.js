function Textures() {
    this.textures = [];
    this.extraSize = [];

    this.create = function(str, background, color) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");

        canvas.width = 128;
        canvas.height = 128;

        var size = 48;
        if (str.length >= 5 && str.length <= 9)
            size = this.extraSize[str.length - 5];

        context.font = "bold " + size + "px sans-serif";

        context.fillStyle = background;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(str, canvas.width / 2, canvas.height / 2);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        return texture;
    }

    this.getTexture = function(v) {
        var str = v.toString();

        if (this.textures[str] == undefined)
            this.textures[str] = this.create(str, "#3c3a32", "#f9f6f2");

        return this.textures[str];
    }

    this.textures['2'] = this.create('2', '#eee4da', '#776e65');
    this.textures['4'] = this.create('4', '#ede0c8', '#776e65');
    this.textures['8'] = this.create('8',  '#f2b179', '#f9f6f2');
    this.textures['16'] = this.create('16', '#f59563', '#f9f6f2');
    this.textures['32'] = this.create('32', '#f67c5f', '#f9f6f2');
    this.textures['64'] = this.create('64', '#f65e3b', '#f9f6f2');
    this.textures['128'] = this.create('128', '#edcf72', '#f9f6f2');
    this.textures['256'] = this.create('256', '#edcc61', '#f9f6f2');
    this.textures['512'] = this.create('512', '#edc850', '#f9f6f2');
    this.textures['1024'] = this.create('1024', '#edc53f', '#f9f6f2');
    this.textures['2048'] = this.create('2048', '#edc22e', '#f9f6f2');

    this.extraSize[0] = 42;
    this.extraSize[1] = 36;
    this.extraSize[2] = 30;
    this.extraSize[3] = 26;
    this.extraSize[4] = 22;
}
