import { Vec3 } from "./Vec.js";
import ColourConverter from "./ColourConverter.js";
import { clamp, lerp, mapValue } from "./Util.js";
export default class Colour {
    constructor(triplet, colourSpace = 'REC.709') {
        this.triplet = triplet;
        this.colourSpace = colourSpace;
    }
    static fromSpectrum(spectrum, resolution = 16, low = 360, high = 830) {
        const samples = new Array(resolution).fill(null).map((item, index) => {
            const wavelength = mapValue(index, 0, resolution - 1, low, high);
            const intensity = spectrum.sample(wavelength);
            return Colour.fromWavelength(wavelength).multiply(intensity);
        });
        return Colour.fromAverage(samples);
    }
    static fromWavelength(wavelength) {
        const triplet = ColourConverter.tripletFromWavelength(wavelength);
        return new Colour(triplet, 'XYZ');
    }
    static fromAverage(colours) {
        const totalX = colours
            .map(colour => colour.triplet.x)
            .reduce((total, current) => total + current, 0);
        const totalY = colours
            .map(colour => colour.triplet.y)
            .reduce((total, current) => total + current, 0);
        const totalZ = colours
            .map(colour => colour.triplet.z)
            .reduce((total, current) => total + current, 0);
        return new Colour(new Vec3(totalX / colours.length, totalY / colours.length, totalZ / colours.length), colours[0].colourSpace);
    }
    multiply(colour) {
        if (typeof colour === 'number') {
            return new Colour(new Vec3(this.triplet.x * colour, this.triplet.y * colour, this.triplet.z * colour), this.colourSpace);
        }
        return new Colour(new Vec3(this.triplet.x * colour.triplet.x, this.triplet.y * colour.triplet.y, this.triplet.z * colour.triplet.z), this.colourSpace);
    }
    add(colour) {
        return new Colour(new Vec3(this.triplet.x + colour.triplet.x, this.triplet.y + colour.triplet.y, this.triplet.z + colour.triplet.z), this.colourSpace);
    }
    lerp(colour, mix) {
        return new Colour(new Vec3(lerp(this.triplet.x, colour.triplet.x, mix), lerp(this.triplet.y, colour.triplet.y, mix), lerp(this.triplet.z, colour.triplet.z, mix)), this.colourSpace);
    }
    normalise() {
        const max = Math.max(this.triplet.x, this.triplet.y, this.triplet.z);
        const triplet = new Vec3(this.triplet.x / max, this.triplet.y / max, this.triplet.z / max);
        return new Colour(triplet, this.colourSpace);
    }
    get sum() {
        return this.triplet.x + this.triplet.y + this.triplet.z;
    }
    get allPositive() {
        return this.triplet.x >= 0 && this.triplet.y >= 0 && this.triplet.z >= 0;
    }
    toxyY() {
        if (this.colourSpace !== 'XYZ') {
            throw 'Not supported';
        }
        const tripletInxyY = ColourConverter.xyzToxyY(this.triplet);
        return new Colour(tripletInxyY, 'xyY');
    }
    toRec709() {
        if (this.colourSpace == 'REC.709') {
            return this;
        }
        if (this.colourSpace === 'XYZ') {
            const tripletInRec709 = ColourConverter.xyzToRec709(this.triplet);
            return new Colour(tripletInRec709, 'REC.709');
        }
        throw 'Not supported';
    }
    tosRGB() {
        if (this.colourSpace == 'sRGB') {
            return this;
        }
        if (this.colourSpace == 'REC.709') {
            return new Colour(new Vec3(this.triplet.x ** 2.2, this.triplet.y ** 2.2, this.triplet.z ** 2.2), 'sRGB');
        }
        if (this.colourSpace === 'XYZ') {
            const tripletInRec709 = ColourConverter.xyzToRec709(this.triplet);
            return new Colour(new Vec3(tripletInRec709.x ** 2.2, tripletInRec709.y ** 2.2, tripletInRec709.z ** 2.2), 'sRGB');
        }
        throw 'Not supported';
    }
    get hex() {
        const sRGBColur = this.tosRGB();
        const r = Math.round(clamp(sRGBColur.triplet.x, 0, 1) * 255);
        const g = Math.round(clamp(sRGBColur.triplet.y, 0, 1) * 255);
        const b = Math.round(clamp(sRGBColur.triplet.z, 0, 1) * 255);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    clamp() {
        this.triplet.x = clamp(this.triplet.x, 0, 1);
        this.triplet.y = clamp(this.triplet.y, 0, 1);
        this.triplet.z = clamp(this.triplet.z, 0, 1);
        return this;
    }
}
//# sourceMappingURL=Colour.js.map