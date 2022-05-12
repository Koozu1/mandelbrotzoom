/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.run = (req, res) => {
    console.log("1")
    if (req.method !== "POST") {
        return res.status(405).end();
    }
    console.log("2")


    let body = req.body
    console.log(body)

    let cWidth = body[0]
    let cHeight = body[1]
    let absScale = body[2]
    let cenX = body[3]
    let cenY = body[4]
    let iterations = body[5]

    let pixels = []

    //LOOP VARS
    let rX
    let rY
    let ca
    let cb
    //INNER LOOP VARS
    let xMulti
    let yMulti
    // test {"cWidth":640,"cHeight":320,"absScale":1,"cenX":0,"cenY":0,"iterations":250}

    for (let x = 0; x < cWidth; x++) {
        for (let y = 0; y < cHeight; y++) {
            rX = (x - cWidth / 2) * (4 / cWidth) * (16 / (9 * absScale)) + cenX
            rY = (y - cHeight / 2) * (4 / cHeight) * (1 / absScale) + cenY
            ca = rX
            cb = rY
            let n = 0
            while (n < iterations) {
                xMulti = rX * rX
                yMulti = rY * rY
                let aa = xMulti - yMulti
                let bb = 2 * rX * rY
                rX = aa + ca
                rY = bb + cb

                if (rX * rX + rY * rY > 16) {
                    break
                }
                n++
            }
            let color = pickColorHSV1(iterations, n, rX * rX, rY * rY)
            pixels.push(color)
        }
    }
    console.log("3")
    console.log(pixels)
    res.json(pixels)
};

var logBase = 1.0 / Math.log(2.0);
var logHalfBase = Math.log(0.5) * logBase;
const smoothColor = (steps, n, Tr, Ti) => {
    return 5 + n - logHalfBase - Math.log(Math.log(Tr + Ti)) * logBase;
}

const pickColorHSV1 = (steps, n, Tr, Ti) => {
    if (n == steps) // converged?
        return [0, 0, 0];

    var v = smoothColor(steps, n, Tr, Ti);
    var c = hsv_to_rgb(360.0 * v / steps, 1.0, 1.0);
    c.push(255); // alpha
    return c;
}

const hsv_to_rgb = (h, s, v) => {
    if (v > 1.0) v = 1.0;
    var hp = h / 60.0;
    var c = v * s;
    var x = c * (1 - Math.abs((hp % 2) - 1));
    var rgb = [0, 0, 0];

    if (0 <= hp && hp < 1) rgb = [c, x, 0];
    if (1 <= hp && hp < 2) rgb = [x, c, 0];
    if (2 <= hp && hp < 3) rgb = [0, c, x];
    if (3 <= hp && hp < 4) rgb = [0, x, c];
    if (4 <= hp && hp < 5) rgb = [x, 0, c];
    if (5 <= hp && hp < 6) rgb = [c, 0, x];

    var m = v - c;
    rgb[0] += m;
    rgb[1] += m;
    rgb[2] += m;

    rgb[0] *= 255;
    rgb[1] *= 255;
    rgb[2] *= 255;
    return rgb;
}