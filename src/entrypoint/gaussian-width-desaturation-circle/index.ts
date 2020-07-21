import Colour from "../../Colour.js";
import { mapValue, sleep } from "../../Util.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2, Vec3 } from "../../Vec.js";
import GaussianWideningStrategy from "../../DesaturationStrategy/GaussianWideningStrategy.js";


const CLIP_OUT_OF_GAMUT = false;

const WAVELENGTH_LOW = 360;
const WAVELENGTH_HIGH = 830;

const LOW_COLOR = Colour.fromWavelength(WAVELENGTH_LOW).normalise();
const HIGH_COLOR = Colour.fromWavelength(WAVELENGTH_HIGH).normalise();

const LOCUS_SAMPLES = 200;
const PINK_EDGE_SAMPLES = 40;
const DESATURATION_SAMPLES = 60;
const HUE_SAMPLES = 250;

const CANVAS_SIZE = 1500;

const locusEl = document.querySelector('#locusWavelength') as HTMLInputElement;
const desaturationEl = document.querySelector('#desaturation') as HTMLInputElement;

const modeEl = document.querySelector('#mode') as HTMLButtonElement;
const sweepEl = document.querySelector('#sweep') as HTMLButtonElement;

const abneySwatchEl = document.querySelector('#abneySwatchLobe') as HTMLDivElement;
const gaussianSwatchEl = document.querySelector('#gaussianSwatchLobe') as HTMLDivElement;

const canvasEl = document.querySelector('canvas')!;
const canvasOutput = new CanvasOutput(canvasEl, CANVAS_SIZE, CANVAS_SIZE, true, 2.2, 0.18);


const state = {
  mode: 'hue',
  desaturation: 1,
  locusWavelength: 550,
  pinkProgress: 0.5,
  sweep: false,
};

const boundarySamples = createBoundarySamples(LOCUS_SAMPLES, PINK_EDGE_SAMPLES);

render(true);

locusEl.addEventListener('input', (e) => {
  if (!e) {
    return;
  }
  state.locusWavelength = Number((event!.target as HTMLInputElement).value);
  render(true);
});
desaturationEl.addEventListener('input', (e) => {
  if (!e) {
    return;
  }
  state.desaturation = Number((event!.target as HTMLInputElement).value);
  render(true);
});
sweepEl.addEventListener('click', () => {
  sweep();
});
modeEl.addEventListener('click', () => {
  toggleMode();
});

function toggleMode() {
  if (state.mode === 'saturation') {
    state.mode = 'hue';
    locusEl.style.display = 'none';
    desaturationEl.style.display = 'block';
  } else {
    state.mode = 'saturation';
    locusEl.style.display = 'block';
    desaturationEl.style.display = 'none';
  }
  modeEl.innerText = state.mode;
}

async function sweep() {
  // canvasOutput.clear(true);
  // drawPoints(boundarySamples);
  if(state.mode === 'hue') {
    await sweepHue();
    return;
  }
  if(state.mode === 'saturation') {
    await sweepSaturation();
    return;
  }
}

async function sweepHue() {
  for (let i = 0; i < HUE_SAMPLES; i++) {
    await sleep(1);
    state.desaturation = (i / (HUE_SAMPLES - 1)) ** 1.2;
    render();
  }
}
async function sweepSaturation() {
  for (let i = 0; i < 50; i++) {
    await sleep(1);
    state.locusWavelength = mapValue(i, 0, 49, WAVELENGTH_LOW, WAVELENGTH_HIGH);
    state.pinkProgress = mapValue(i, 0, 49, 0, 1);
    render();
  }
}



function render(clear = false) {
  if (clear) {
    canvasOutput.clear(true);
    // drawPoints(boundarySamples);
  }
  renderHue();
  if (state.mode === 'hue') {
    return;
  }
  // if (state.mode === 'saturation') {
  //   renderSaturation();
  //   return;
  // }
}

function renderHue() {
  const gaussianWideningStrategy = new GaussianWideningStrategy();
  const points = createBoundaryValues();
  const samplePoints = points.map((point, index, arr) => {
    const colour = gaussianWideningStrategy.desaturate(point, state.desaturation).multiply(14);
    const progress = mapValue(index, 0, arr.length - 1, 0, Math.PI * 2);
    const radius = mapValue(state.desaturation, 0, 1, 1, 0);
    const location = new Vec2(
      Math.sin(progress) * radius,
      Math.cos(progress) * radius,
    );
    
    return { colour, location };
  });
  drawPoints(samplePoints);
}

// function renderSaturation() {
//   const gaussianWideningStrategy = new GaussianWideningStrategy();

//   const locusWavelength = state.locusWavelength;
//   const lobeDesaturationSamples = new Array(DESATURATION_SAMPLES)
//     .fill(null)
//     .map((item, index) => {
//       const desaturationAmount = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1);
//       return gaussianWideningStrategy.desaturate(locusWavelength, desaturationAmount);
//     });
//   drawPoints(lobeDesaturationSamples);

//   // const pinkProgress = state.pinkProgress;
//   // const pinkDesaturationSamples = new Array(DESATURATION_SAMPLES)
//   //   .fill(null)
//   //   .map((item, index) => {
//   //     const desaturationAmount = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1);
//   //     return gaussianWideningStrategy.desaturate(pinkProgress, desaturationAmount);
//   //   });
//   // drawPoints(pinkDesaturationSamples);
//   fillSwatches(lobeDesaturationSamples);
// }

function fillSwatches(lobeSamples: Colour[]) {
  const clippedColour = lobeSamples[1].toRec709().normalise().clamp();
  abneySwatchEl.style.backgroundColor = clippedColour.hex;

  for (let i = 1; i < lobeSamples.length; i++) {
    const sample = lobeSamples[i];
    if (sample.toRec709().allPositive) {
      console.log(sample.toRec709().normalise().hex);
      gaussianSwatchEl.style.backgroundColor = sample.toRec709().normalise().hex;
      break;
    }
  }

  // const clippedPinkColour = pinkSamples[1].toRec709().normalise().clamp();
  // abneySwatchPinkEl.style.backgroundColor = clippedPinkColour.hex;

  // for (let i = 1; i < pinkSamples.length; i++) {
  //   const sample = pinkSamples[i];
  //   if (sample.toRec709().allPositive) {
  //     console.log(sample.toRec709().normalise().hex);
  //     gaussianSwatchPinkEl.style.backgroundColor = sample.toRec709().normalise().hex;
  //     break;
  //   }
  // }
}


function createBoundaryValues(locusSampleCount = LOCUS_SAMPLES, pinkEdgeSampleCount = PINK_EDGE_SAMPLES) {
  const locusPoints = new Array(locusSampleCount)
    .fill(null)
    .map(
      (item, index) => 
        mapValue((index / (locusSampleCount - 1)), 0, 1, WAVELENGTH_LOW, WAVELENGTH_HIGH),
      );
  
  // const pinkEdgePoints = new Array(pinkEdgeSampleCount)
  //   .fill(null)
  //   .map((item, index) => mapValue(index, 0, pinkEdgeSampleCount - 1, 0, 1)
  //   );
  
  return [
    ...locusPoints,
    // ...pinkEdgePoints,
  ];
}


function createBoundarySamples(locusSampleCount: number, pinkEdgeSampleCount: number) {
  const locusSamples = new Array(locusSampleCount)
    .fill(null)
    .map(
      (item, index) => Colour.fromWavelength(
        mapValue((index / (locusSampleCount - 1)), 0, 1, WAVELENGTH_LOW, WAVELENGTH_HIGH),
      ));
  
  // const pinkEdgeSamples = new Array(pinkEdgeSampleCount)
  //   .fill(null)
  //   .map((item, index) => LOW_COLOR.lerp(
  //     HIGH_COLOR,
  //     mapValue(index, 0, pinkEdgeSampleCount - 1, 0, 1) ** 0.5
  //   ));
  
  return [
    ...locusSamples,
    // ...pinkEdgeSamples,
  ];
}

function drawDot(point: Colour): void {
  const xyYlocation = point.toxyY();
  const location = new Vec2(xyYlocation.triplet.x, xyYlocation.triplet.y).add(0.1);
  canvasOutput.drawCircle({
    radius: 0.05,
    location,
    color: point,
  });
}

function drawPoints(points: { colour: Colour, location: Vec2 }[]): void {
  points
    .map(({location, colour}) => {
      const mappedLocation = location.multiply(0.49).add(0.5);
        return {
          location: mappedLocation,
          colour,
        };
    })
    .forEach(({location, colour}, index, arr) => {
      if (index === 0) {
        return;
      }
      if (isColourOutOfRec709Gamut(colour) && CLIP_OUT_OF_GAMUT) {
        return;
      }
      canvasOutput.drawLine({
        lineWidth: 0.003,
        from: arr[index - 1].location,
        to: location,
        color: colour,
      });
  });
}


function isColourOutOfRec709Gamut(colour: Colour): boolean {
  const rec709Colour = colour.toRec709();
  return (
    rec709Colour.triplet.x >= 1 ||
    rec709Colour.triplet.y >= 1 ||
    rec709Colour.triplet.z >= 1 ||
    rec709Colour.triplet.x <= 0 ||
    rec709Colour.triplet.y <= 0 ||
    rec709Colour.triplet.z <= 0
  );
}