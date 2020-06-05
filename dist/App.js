export default class App {
    constructor(canvasEl, size = 200) {
        this.canvasEl = canvasEl;
        this.size = size;
        this.canvasEl.height = size;
        this.canvasEl.width = size;
        this.context = this.canvasEl.getContext('2d');
        this.imageData = new ImageData(size, size);
        this.imageData.data.fill(255);
        this.redraw();
    }
    setPixel(color, coords) {
        const offset = ((coords.y * this.size) + coords.x) * 4;
        this.imageData.data[offset + 0] = color.x;
        this.imageData.data[offset + 1] = color.y;
        this.imageData.data[offset + 2] = color.z;
    }
    redraw() {
        this.context.putImageData(this.imageData, 0, 0, 0, 0, this.size, this.size);
    }
}
//# sourceMappingURL=App.js.map