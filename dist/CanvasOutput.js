import { Vec2 } from "./Vec.js";
export default class CanvasOutput {
    constructor(canvasEl, width = 100, height = 100, clipTooBright = false, gamma = 2.2, background = 1) {
        this.canvasEl = canvasEl;
        this.width = width;
        this.height = height;
        this.clipTooBright = clipTooBright;
        this.gamma = gamma;
        this.background = background;
        this.canvasEl.height = height;
        this.canvasEl.width = width;
        this.context = this.canvasEl.getContext('2d');
        this.imageData = new ImageData(width, height);
        this.clear();
        // setInterval(() => this.redraw(), 50);
    }
    drawLine(options) {
        const { lineWidth, from, to, color } = options;
        this.context.save();
        this.context.lineWidth = lineWidth * this.width;
        this.context.lineCap = 'round';
        const rgb = color.toRec709().clamp().triplet;
        const rgbString = `rgb(${(rgb.x ** (1 / this.gamma)) * 255}, ${(rgb.y ** (1 / this.gamma)) * 255}, ${(rgb.z ** (1 / this.gamma)) * 255})`;
        this.context.strokeStyle = rgbString;
        const canvasFrom = this.uvToCanvasCoordinates(from);
        const canvasTo = this.uvToCanvasCoordinates(to);
        this.context.beginPath();
        this.context.moveTo(canvasFrom.x, canvasFrom.y);
        this.context.lineTo(canvasTo.x, canvasTo.y);
        this.context.stroke();
        this.context.restore();
    }
    drawCircle(options) {
        const { radius, location, color } = options;
        this.context.save();
        const rgb = color.toRec709().clamp().triplet;
        const rgbString = `rgb(${(rgb.x ** (1 / this.gamma)) * 255}, ${(rgb.y ** (1 / this.gamma)) * 255}, ${(rgb.z ** (1 / this.gamma)) * 255})`;
        this.context.fillStyle = rgbString;
        const canvasLocation = this.uvToCanvasCoordinates(location);
        const canvasRadius = radius * this.width;
        this.context.beginPath();
        this.context.arc(canvasLocation.x, canvasLocation.y, canvasRadius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.restore();
    }
    uvToCanvasCoordinates(uv) {
        return new Vec2(uv.x * this.width, (1 - uv.y) * this.height);
    }
    clear(redraw = false) {
        for (let i = 0; i < this.imageData.data.length; i++) {
            this.imageData.data[i] = i % 4 === 3 ? 255 : this.background * 255;
        }
        if (redraw) {
            this.redraw();
        }
    }
    setPixel(color, coords) {
        const offset = ((coords.y * this.width) + coords.x) * 4;
        if (this.clipTooBright && (color.x >= 1 ||
            color.y >= 1 ||
            color.z >= 1)) {
            this.imageData.data[offset + 0] = 0;
            this.imageData.data[offset + 1] = 0;
            this.imageData.data[offset + 2] = 0;
            return;
        }
        this.imageData.data[offset + 0] = (color.x ** (1 / this.gamma)) * 255;
        this.imageData.data[offset + 1] = (color.y ** (1 / this.gamma)) * 255;
        this.imageData.data[offset + 2] = (color.z ** (1 / this.gamma)) * 255;
        // this.imageData.data[offset + 0] = color.x <= 1 ? (color.x ** (1 / this.gamma)) * 255 : 0;
        // this.imageData.data[offset + 1] = color.y <= 1 ? (color.y ** (1 / this.gamma)) * 255 : 0;
        // this.imageData.data[offset + 2] = color.z <= 1 ? (color.z ** (1 / this.gamma)) * 255 : 0;
    }
    redraw() {
        this.context.putImageData(this.imageData, 0, 0, 0, 0, this.width, this.height);
    }
}
//# sourceMappingURL=CanvasOutput.js.map