import CanvasOutput from "../../CanvasOutput.js";
import BasicCamera from "../../BasicCamera.js";
import BasicFilm from "../../BasicFilm.js";
import { Vec3 } from "../../Vec.js";
import SelfReflectionViewer from "./SelfReflectionViewer.js";
import { mapValue } from "../../Util.js";
import parabolic from "../../Spectrum/Parabolic.js";
import SPDSpectrum from "../../Spectrum/SPDSpectrum.js";
const numberofBounces = 10;
const colourPatchHeight = 4;
const colourPatchWidth = 4;
(async () => {
    const cameraPos = new Vec3(0, 0, 0);
    const cameraDir = new Vec3(0, 0, 1);
    const cameraUp = new Vec3(0, 1, 0);
    const getGaussianSpectrum = (center, width, peak = 2) => {
        return {
            sample: parabolic(center, width, peak),
        };
    };
    const funkySpectrum = {
        sample: (wavelength) => {
            const progress = mapValue(wavelength, 360, 830, 0, 1);
            return 4 * ((progress - 0.5) ** 2);
        },
    };
    const primariesWidth = 100;
    const primariesMaxReflectivity = 0.8;
    const red = getGaussianSpectrum(630, primariesWidth, primariesMaxReflectivity);
    const green = getGaussianSpectrum(532, primariesWidth, primariesMaxReflectivity);
    const blue = getGaussianSpectrum(467, primariesWidth, primariesMaxReflectivity);
    const white = { sample: () => 0.8 };
    const smoothPurpleSpectrum = getGaussianSpectrum(420, 60, 0.9);
    const smoothRedSpectrum = getGaussianSpectrum(700, 70, 0.99);
    const compositePurpleSpectrum = {
        sample: (wavelength) => parabolic(400, 50, 0.95)(wavelength) + parabolic(600, 20, 0.2)(wavelength)
    };
    const colours = [
        white,
        red,
        green,
        blue,
        compositePurpleSpectrum,
        smoothRedSpectrum,
        smoothPurpleSpectrum,
        funkySpectrum,
    ];
    const [d65spd, aspd] = await Promise.all([
        fetch('/static/d65.spd').then(res => res.text()),
        fetch('/static/a.spd').then(res => res.text()),
    ]);
    const d65Illuminant = new SPDSpectrum(d65spd, 'zero', 2 ** -7);
    const aIlluminant = new SPDSpectrum(aspd, 'zero', 2 ** -8);
    const lightPrimariesWidth = 20;
    const redLight = getGaussianSpectrum(630, lightPrimariesWidth, 0.9);
    const greenLight = getGaussianSpectrum(532, lightPrimariesWidth, 0.9);
    const blueLight = getGaussianSpectrum(467, lightPrimariesWidth, 1);
    const illuminants = [
        d65Illuminant,
        aIlluminant,
        redLight,
        greenLight,
        blueLight,
        d65Illuminant,
    ];
    // const width = numberOfLights * colourPatchWidth;
    // const height = numberofColours * numberofBounces * colourPatchHeight;
    const numberOfLights = illuminants.length;
    const numberofColours = colours.length;
    const width = colourPatchWidth * numberOfLights * numberofBounces;
    const height = colourPatchHeight * numberofColours;
    const canvasEl = document.querySelector('canvas');
    const canvasOutput = new CanvasOutput(canvasEl, width, height);
    const film = new BasicFilm(canvasOutput, width, height);
    const camera = new BasicCamera(cameraPos, cameraDir, cameraUp, film);
    const integrator = new SelfReflectionViewer(camera, illuminants, colours, numberofBounces, colourPatchWidth, colourPatchHeight);
    integrator.render();
})();
//# sourceMappingURL=index.js.map