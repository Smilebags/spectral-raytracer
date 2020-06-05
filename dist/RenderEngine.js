import Colour from "./Colour.js";
export default class RenderEngine {
    constructor(canvasOutput, integrator, scene) {
        this.canvasOutput = canvasOutput;
        this.integrator = integrator;
        this.scene = scene;
    }
    render() {
        const frameBuffer = this.integrator.render(this.scene);
        for (let y = 0; y < this.canvasOutput.height; y++) {
            for (let x = 0; x < this.canvasOutput.width; x++) {
                const xyzColour = new Colour(frameBuffer.get(x, y), 'XYZ');
                const recColour = xyzColour.toRec709();
                this.canvasOutput.setPixel(recColour.triplet, { x, y });
            }
        }
        this.canvasOutput.redraw();
    }
}
//# sourceMappingURL=RenderEngine.js.map