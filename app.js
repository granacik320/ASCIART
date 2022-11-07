const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
window.devicePixelRatio=1;
let effect;

const simage = new Image();
document.addEventListener('DOMContentLoaded', () => {
    simage.src = Math.floor(Math.random()*4)+1+".png";
})

class Cell{
    constructor(x, y, symbol, color){
        this.x = x;
        this.y = y;
        this.symbol = symbol; 
        this.color = color;
    }
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.font = "26px Arial"
        ctx.fillText(this.symbol, this.x, this.y)
    }
}

class Artefacts{
    #cells = [];
    #pixels =[];
    #ctx = [];
    #width = [];
    #height = [];
    constructor(ctx, width, height){
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.drawImage(simage, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
    }
    #createsymbol(g){
        if(g > 250) return "@";
        else if(g > 240) return "*";
        else if(g > 220) return "+";
        else if(g > 200) return "#";
        else if(g > 180) return "&";
        else if(g > 160) return "%";
        else if(g > 140) return "_";
        else if(g > 120) return ":";
        else if(g > 100) return "$";
        else if(g > 80) return "#";
        else if(g > 60) return "-";
        else if(g > 40) return "X";
        else if(g > 20) return "W";
        else return "";

    }
    #createcells(sizecell){
        for(let y=0; y < this.#pixels.height; y += sizecell){
            for(let x=0; x < this.#pixels.height; x += sizecell){
                const posy = y * 4;
                const posx = x * 4;
                const pos = (posy * this.#pixels.width) - posx;

                if(this.#pixels.data[pos + 3] > 128){
                    const red = this.#pixels.data[pos];
                    const green = this.#pixels.data[pos + 1];
                    const blue = this.#pixels.data[pos + 2];
                    const total = red + green + blue;
                    const mix = total/3;
                    const color = "rgb(" + red + "," + green + "," +blue + ")";
                    const symbol = this.#createsymbol(mix);
                    if(total > 200) this.#cells.push(new Cell(x, y, symbol, color))
                }
            }
        }
    }
    #drawASCII(){
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        for(let i=0; i < this.#cells.length; i++){
            this.#cells[i].draw(this.#ctx);
        }
    }
    draw(sizecell){
        this.#createcells(sizecell)
        this.#drawASCII()
    }
}

simage.onload = function set(){
    canvas.width = "1250";
    canvas.height = "1250";
    ctx.drawImage(simage, 0, 0);
    effect = new Artefacts(ctx, canvas.height, canvas.width);
    effect.draw(22)
}