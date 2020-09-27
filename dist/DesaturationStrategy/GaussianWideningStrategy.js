import { GaussianSpectrum } from "../Spectrum/GaussianSpectrum.js";
import Colour from "../Colour/Colour.js";
export default class GaussianWideningStrategy {
    constructor(wavelengthLow, wavelengthHigh) {
        this.wavelengthLow = wavelengthLow;
        this.wavelengthHigh = wavelengthHigh;
        this.wavelengthRange = this.wavelengthHigh - this.wavelengthLow;
    }
    getWidthFromDesaturation(desaturation) {
        if (desaturation <= 0) {
            return 0;
        }
        return 50 * Math.log(1 / (1 - desaturation));
    }
    desaturate(wavelength, amount, integrationSampleCount, wrap = true) {
        const primary = this.locusLobeWideningStrategy(wavelength, amount, integrationSampleCount);
        if (!wrap) {
            return primary;
        }
        const above = this.locusLobeWideningStrategy(wavelength + this.wavelengthRange, amount, integrationSampleCount);
        const below = this.locusLobeWideningStrategy(wavelength - this.wavelengthRange, amount, integrationSampleCount);
        const twoAbove = this.locusLobeWideningStrategy(wavelength + (this.wavelengthRange * 2), amount, integrationSampleCount);
        const twoBelow = this.locusLobeWideningStrategy(wavelength - (this.wavelengthRange * 2), amount, integrationSampleCount);
        return Colour.fromAverage([
            primary,
            above,
            below,
            twoAbove,
            twoBelow,
        ]).multiply(5);
    }
    locusLobeWideningStrategy(wavelength, amount, integrationSampleCount) {
        const width = this.getWidthFromDesaturation(amount);
        const spectrum = new GaussianSpectrum(wavelength, width);
        return Colour.fromSpectrum(spectrum, integrationSampleCount);
    }
    ;
}
