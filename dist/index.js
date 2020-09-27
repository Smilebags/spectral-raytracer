import CanvasOutput from "./CanvasOutput.js";
import SamplerIntegrator from "./SamplerIntegrator.js";
import BasicCamera from "./BasicCamera.js";
import RandomSampler from "./RandomSampler.js";
import BasicFilm from "./BasicFilm.js";
import { Vec3 } from "./Vec.js";
import BasicScene from "./BasicScene.js";
import BasicAggregate from "./BasicAggregate.js";
import ShapePrimitive from "./ShapePrimitive.js";
import BasicShape from "./BasicShape.js";
const cameraPos = new Vec3(0, 0, 0);
const cameraDir = new Vec3(0, 0, 1);
const cameraUp = new Vec3(0, 1, 0);
const canvasEl = document.querySelector('canvas');
const canvasOutput = new CanvasOutput(canvasEl);
const film = new BasicFilm(canvasOutput);
const camera = new BasicCamera(cameraPos, cameraDir, cameraUp, film);
const sampler = new RandomSampler();
const vertices = [
    new Vec3(-0.5, -0.5, -3),
    new Vec3(-0.5, 0.5, -3),
    new Vec3(0.5, -0.5, -3),
    new Vec3(0.5, 0.5, -3),
];
const faces = [
    [0, 1, 2],
    [1, 2, 3],
];
const shape = new BasicShape(vertices, faces);
const shapePrimitive = new ShapePrimitive(shape, {});
const aggregate = new BasicAggregate([shapePrimitive]);
const scene = new BasicScene(aggregate);
const integrator = new SamplerIntegrator(camera, sampler);
integrator.render(scene);
const testRay = {
    origin: new Vec3(0, 0, 0),
    direction: new Vec3(0, 0, -1),
    length: null,
    time: 0,
};
let testIntersection = shape.intersect(testRay);
console.log(testIntersection);
testRay.direction = new Vec3(10, 0, 1).normalise();
testIntersection = shape.intersect(testRay);
console.log(testIntersection);
//# sourceMappingURL=index.js.map