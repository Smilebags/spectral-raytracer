export default class CoefficientSpectrum {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    sigmoid(x) {
        return 0.5 + (x / 1 + (x ** 2));
    }
    sample(wavelength) {
        const x = wavelength;
        const { a, b, c } = this;
        const parabola = (a * (x ** 2)) + (b * x) + c;
        return this.sigmoid(parabola);
    }
}
