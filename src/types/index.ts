import { CameraSample } from "../RandomSampler";

export interface Integrator {
  render(scene: Scene): FrameBuffer<Vec3>
}

export interface FrameBuffer<T> {
  get(x: number, y: number): T;
}

export interface Sampler {
  get1D(): number;
  get2D(): Vec2;
}

export interface Scene {
}

export interface Camera {
  getRay(cameraSample: CameraSample): Ray;
  recordRadiances(radiances: Radiance[], sample: CameraSample): void;
}

export interface Film {
  splat(radiances: Radiance[], sample: CameraSample): void;
}

export interface Spectrum {
  sample(wavelength: number): number;
}

export interface Radiance {
  wavelength: number;
  intensity: number;
}

export interface Ray {
  origin: Vec3;
  direction: Vec3;
  length: number | null;
  time: number;
}

export interface Vec2 {
  x: number;
  y: number;
}
export interface Vec3 extends Vec2 {
  z: number;
}