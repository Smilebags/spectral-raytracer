import Colour from "../../Colour.js";
import { Vec3 } from "../../Vec.js";
import colourSpaceProviderSingleton from "../../ColourSpaceProviderSingleton.js";
const blackEl = document.querySelector('#black');
const greyEl = document.querySelector('#grey');
const whiteEl = document.querySelector('#white');
const ieblackEl = document.querySelector('#ieblack');
const iegreyEl = document.querySelector('#iegrey');
const iewhiteEl = document.querySelector('#iewhite');
fillCanvasWithColour(blackEl, new Colour(new Vec3(0.3128, 0.3290, 0), 'xyY', colourSpaceProviderSingleton));
fillCanvasWithColour(greyEl, new Colour(new Vec3(0.3128, 0.3290, 0.5), 'xyY', colourSpaceProviderSingleton));
fillCanvasWithColour(whiteEl, new Colour(new Vec3(0.3128, 0.3290, 0.99), 'xyY', colourSpaceProviderSingleton));
fillCanvasWithColour(ieblackEl, new Colour(new Vec3(0, 0, 0), 'XYZ', colourSpaceProviderSingleton));
fillCanvasWithColour(iegreyEl, new Colour(new Vec3(0.5, 0.5, 0.5), 'XYZ', colourSpaceProviderSingleton));
fillCanvasWithColour(iewhiteEl, new Colour(new Vec3(1, 1, 1), 'XYZ', colourSpaceProviderSingleton));
function fillCanvasWithColour(canvasEl, colour) {
    const ctx = canvasEl.getContext('2d');
    ctx.fillStyle = colour.hex;
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
}
