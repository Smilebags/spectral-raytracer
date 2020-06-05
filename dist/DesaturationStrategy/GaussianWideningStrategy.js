import { GaussianSpectrum } from "../Spectrum/GaussianSpectrum.js";
import Colour from "../Colour.js";
import { mapValue } from "../Util.js";
export default class GaussianWideningStrategy {
    constructor(wavelengthLow = 360, wavelengthHigh = 830) {
        this.wavelengthLow = wavelengthLow;
        this.wavelengthHigh = wavelengthHigh;
        this.wavelengthRange = this.wavelengthHigh - this.wavelengthLow;
        this.minPhotometricEnergy = Colour.fromWavelength(wavelengthLow).sum;
        this.maxPhotometricEnergy = Colour.fromWavelength(wavelengthLow).sum;
        this.photometricEnergies = new Array(this.wavelengthRange).fill(null)
            .map((item, index) => {
            const wavelength = this.wavelengthLow + index;
            const sum = Colour.fromWavelength(wavelength).sum;
            this.minPhotometricEnergy = Math.min(this.minPhotometricEnergy, sum);
            this.maxPhotometricEnergy = Math.max(this.maxPhotometricEnergy, sum);
            return Colour.fromWavelength(wavelength).sum;
        });
    }
    getWidthFromDesaturation(desaturation) {
        if (desaturation <= 0) {
            return 0;
        }
        // return (1 / ((desaturation - 1) ** 2)) - 1;
        return mapValue(desaturation, 0, 1, 0.1, 200);
    }
    desaturate(wavelength, amount) {
        const primary = this.locusLobeWideningStrategy(wavelength, amount);
        const above = this.locusLobeWideningStrategy(wavelength + this.wavelengthRange, amount);
        const below = this.locusLobeWideningStrategy(wavelength - this.wavelengthRange, amount);
        // const totalAboveEnergy = primary.sum + above.sum + below.sum;
        // const totalBelowEnergy = primary.sum + above.sum + below.sum;
        // const aboveFactor = above.sum / totalAboveEnergy;
        // const belowFactor = below.sum / totalBelowEnergy;
        // const scaledPrimary = primary;
        // const scaledAbove = above.multiply(aboveFactor);
        // const scaledBelow = below.multiply(belowFactor);
        return Colour.fromAverage([
            primary,
            above,
            below,
        ]);
    }
    locusLobeWideningStrategy(wavelength, amount) {
        const width = this.getWidthFromDesaturation(amount);
        const baseSpectrum = new GaussianSpectrum(wavelength, width);
        // const luminousEfficacySpectrum: Spectrum = {
        //   sample(w) {
        //     const colour = Colour.fromWavelength(w);
        //     return colour.sum;
        //   }
        // };
        // const factor = (wXYZSum: number) => (this.maxPhotometricEnergy - this.minPhotometricEnergy) / (wXYZSum - this.minPhotometricEnergy);
        // const perceptualGaussian: Spectrum = {
        //   sample(w) {
        //     const col = Colour.fromWavelength(w);
        //     const notsure = factor(col.sum);
        //     const gaussian = baseSpectrum.sample(w);
        //     return gaussian * notsure;
        //   }
        // };
        return Colour.fromSpectrum(baseSpectrum, 2 ** 6);
    }
    ;
}
//# sourceMappingURL=GaussianWideningStrategy.js.map