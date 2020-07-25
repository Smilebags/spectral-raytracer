import { matrixMultiply } from "./Util.js";
import { Vec3 } from "./Vec.js";
export default class GenericColourSpace {
    constructor(name, toMatrix, fromMatrix, adaptationToMatrix, adaptationFromMatrix) {
        this.name = name;
        this.toMatrix = toMatrix;
        this.fromMatrix = fromMatrix;
        this.adaptationToMatrix = adaptationToMatrix;
        this.adaptationFromMatrix = adaptationFromMatrix;
    }
    to(colour) {
        if (!this.adaptationToMatrix) {
            return Vec3.fromArray(matrixMultiply(this.toMatrix, colour.toArray()));
        }
        const adapted = matrixMultiply(this.adaptationToMatrix, colour.toArray());
        return Vec3.fromArray(matrixMultiply(this.toMatrix, adapted));
    }
    from(colour) {
        if (!this.adaptationFromMatrix) {
            return Vec3.fromArray(matrixMultiply(this.fromMatrix, colour.toArray()));
        }
        const adapted = matrixMultiply(this.adaptationFromMatrix, colour.toArray());
        return Vec3.fromArray(matrixMultiply(this.fromMatrix, adapted));
    }
}
