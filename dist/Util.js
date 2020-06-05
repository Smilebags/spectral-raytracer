export function lerp(a, b, mix) {
    return (a * (1 - mix)) + (b * mix);
}
export function mapValue(value, inFrom, inTo, outFrom, outTo, clampToOutRange = false) {
    const inRange = inTo - inFrom;
    const outRange = outTo - outFrom;
    const progress = (value - inFrom) / inRange;
    if (clampToOutRange) {
        return clamp((progress * outRange) + outFrom, Math.min(outTo, outFrom), Math.max(outTo, outFrom));
    }
    return (progress * outRange) + outFrom;
}
export function nextFrame() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => resolve());
    });
}
export function clamp(value, low, high) {
    if (value < low) {
        return low;
    }
    if (value > high) {
        return high;
    }
    return value;
}
export function logN(value, base) {
    return Math.log(value) / Math.log(base);
}
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=Util.js.map