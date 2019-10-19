import CanvasOutput from "./CanvasOutput.js";
import RenderEngine from "./RenderEngine.js";
import SamplerIntegrator from "./SamplerIntegrator.js";
import BasicCamera from "./BasicCamera.js";
import RandomSampler from "./RandomSampler.js";
import { Scene } from "./types/index.js";
import BasicFilm from "./BasicFilm.js";
import { Vec3 } from "./Vec.js";

const cameraPos = new Vec3(0, 0, 0);
const cameraDir = new Vec3(0, 0, -1);

const canvasEl = document.querySelector('canvas')!;
const canvasOutput = new CanvasOutput(canvasEl);
const film = new BasicFilm(canvasOutput);
const camera = new BasicCamera(cameraPos, cameraDir, film);
const sampler = new RandomSampler();
const scene: Scene = {};
const integrator = new SamplerIntegrator(camera, sampler);
integrator.render(scene);
// const renderEngine = new RenderEngine(canvasOutput, integrator, scene);
// renderEngine.render();