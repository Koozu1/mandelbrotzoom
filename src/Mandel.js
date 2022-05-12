import React, { useState } from "react";
import { checkHtmlElement } from "../node_modules/@testing-library/jest-dom/dist/utils";
import Canvas from "./Canvas";

function Mandel() {
    //const [xMin, setxMin] = useState(-2.5)
    //const [xMax, setxMax] = useState(1)
    //const [yMin, setyMin] = useState(-1)
    //const [yMax, setyMax] = useState(1)
    const [absScale, setabsScale] = useState(1)
    const [cWidth, setcWidth] = useState(0)
    const [cHeight, setcHeight] = useState(0)
    const [cenX, setcenX] = useState(0)
    const [cenY, setcenY] = useState(0)

    
    
    const [iterations, setIterations] = useState(250)

    const [anyHasChanged, setAnyHasChanged] = useState(true)

    const [response, setResponse] = useState()
    const [httprequests, setHttpRequests] = useState(0)
    

    const draw = (ctx) => {
        /*
        if (response != null && httprequests < 10) {
            console.log(response, httprequests)
            //setResponse(null)
        }
        */
        if (!anyHasChanged) {
            if (response != null) {
                let img = ctx.createImageData(ctx.canvas.width, ctx.canvas.height)
                //img = makeCanvas(ctx.canvas.width, ctx.canvas.height, img, response)

                /*
                for (let x = 0; x < cWidth; x++) {
                    for (let y = 0; y < cHeight; y++) {
                        let curPixel = response[y * cWidth + x + 1]
                        //console.log(curPixel)
                        if(curPixel === undefined){
                            curPixel = [255, 255, 255, 255]
                        }
            
                        img.data[(x * cHeight + y + 1) * 4] = curPixel[0]
                        img.data[(x * cHeight + y + 1) * 4 + 1] = curPixel[1]
                        img.data[(x * cHeight + y + 1) * 4 + 2] = curPixel[2]
                        img.data[(x * cHeight + y + 1) * 4 + 3] = curPixel[3]
            
            
                    }
                }
                */
               for(let i = 0; i < response.length; i++){
                    img.data[i * 4] = response[i][0]
                    img.data[i * 4 + 1] = response[i][1]
                    img.data[i * 4 + 2] = response[i][2]
                    img.data[i * 4 + 3] = 255
               }
                ctx.putImageData(img, 0, 0)

            }

            return
        } else {
            setAnyHasChanged(false)
            setResponse(null)
        }

        
        setcWidth(ctx.canvas.width)
        setcHeight(ctx.canvas.height)
    
        
        httpPost('/mandelbrotCalc', cWidth, cHeight, absScale, cenX, cenY, iterations)



        //let xScale = (xMax - xMin) * absScale / ctx.canvas.width
        //let yScale = (yMax - yMin) * absScale / ctx.canvas.height


        //LOOP VARS
        let rX
        let rY
        let ca
        let cb
        //INNER LOOP VARS
        let xMulti
        let yMulti
        /*
        if (httprequests > 10) {
            return
        }
        */
       //console.log("wouldpost", absScale, anyHasChanged)
        //httpPost('/mandelbrotCalc', cWidth, cHeight, absScale, cenX, cenY, iterations)
        //setHttpRequests(httprequests + 1)

        //for(let i = 0; i < img.data.length; i += 4) {

        //}
        //console.log("2", cWidth)

        
        /*
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

                let pixel = (x + y * cWidth) * 4
                let color = pickColorHSV1(iterations, n, rX * rX, rY * rY)

                img.data[pixel] = color[0]
                img.data[pixel + 1] = color[1]
                img.data[pixel + 2] = color[2]
                img.data[pixel + 3] = 255
            
                //ctx.putImageData(img, 0, 0) 


            }
            //ctx.putImageData(img, 10, 10) 
        }
        */
        //ctx.putImageData(img, 10, 10)
    }

    //TODO - stop adding listeners all the time.
    
    window.addEventListener("wheel", (event) => {
        setAnyHasChanged(true)
        let delta = -event.deltaY
        if (delta > 0) {
            setabsScale(absScale * 1.2)
            //setIterations(iterations + 20)
            setIterations(iterations * 1.05)
            
            setcenX(cenX + 0.001 * (1 / absScale) * (event.x - (cWidth / 2) - cenX))
            setcenY(cenY + 0.001 * (1 / absScale) * (event.y - (cHeight / 2) - cenY))
            //cenX += 0.001 * (1 / absScale) * (event.x - (cWidth / 2) - cenX)
            //cenY += 0.001 * (1 / absScale) * (event.y - (cHeight / 2) - cenY)
        } else {
            setabsScale(absScale * 0.8)
            //setIterations(iterations - 20)
            setIterations(iterations * 0.95)

            setcenX(cenX - 0.001 * (1 / absScale) * (event.x - (cWidth / 2) - cenX))
            setcenY(cenY - 0.001 * (1 / absScale) * (event.y - (cHeight / 2) - cenY))
            //cenX -= 0.001 * (1 / absScale) * (event.x - (cWidth / 2) - cenX)
            //cenY -= 0.001 * (1 / absScale) * (event.y - (cHeight / 2) - cenY)
        }
    })
    
    const httpPost = (url, cWidth, cHeight, absScale, cenX, cenY, iterations) => {
        console.log(JSON.stringify(
            {
                cWidth,
                cHeight,
                absScale,
                cenX,
                cenY,
                iterations
            }
        ))
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "cWidth": cWidth,
                "cHeight": cHeight,
                "absScale": absScale,
                "cenX": cenX,
                "cenY": cenY,
                "iterations": iterations
            })
        }).then(res => res.json()).then(res => {
            setResponse(res)
            console.log("response", absScale)
        })
    }
    


    return <Canvas draw={draw} />
}

const logBase = 1.0 / Math.log(2.0);
const logHalfBase = Math.log(0.5) * logBase;
const smoothColor = (steps, n, Tr, Ti) => {

    return 5 + n - logHalfBase - Math.log(Math.log(Tr + Ti)) * logBase;
}

const pickColorHSV1 = (steps, n, Tr, Ti) => {
    if (n == steps) // converged?
        return [0, 0, 0];

    let v = smoothColor(steps, n, Tr, Ti);
    let c = hsv_to_rgb(360.0 * v / steps, 1.0, 1.0);
    c.push(255); // alpha
    return c;
}

const hsv_to_rgb = (h, s, v) => {
    if (v > 1.0) v = 1.0;
    let hp = h / 60.0;
    let c = v * s;
    let x = c * (1 - Math.abs((hp % 2) - 1));
    let rgb = [0, 0, 0];

    if (0 <= hp && hp < 1) rgb = [c, x, 0];
    if (1 <= hp && hp < 2) rgb = [x, c, 0];
    if (2 <= hp && hp < 3) rgb = [0, c, x];
    if (3 <= hp && hp < 4) rgb = [0, x, c];
    if (4 <= hp && hp < 5) rgb = [x, 0, c];
    if (5 <= hp && hp < 6) rgb = [c, 0, x];

    let m = v - c;
    rgb[0] += m;
    rgb[1] += m;
    rgb[2] += m;

    rgb[0] *= 255;
    rgb[1] *= 255;
    rgb[2] *= 255;
    return rgb;
}

const makeCanvas = (cWidth, cHeight, img, pixels) => {
    /*
    for (let i = 0; i < pixels.length; i++) {
        let height = getHeight(cWidth, i)
    }

    for(let i = 0; i < pixels.length; i++) {
        img.data[i * 4] = pixels[i][0]
        img.data[i * 4 + 1] = pixels[i][1]
        img.data[i * 4 + 2] = pixels[i][2]
        img.data[i * 4 + 3] = pixels[i][3]
    }
    */

    for (let x = 0; x < cWidth; x++) {
        for (let y = 0; y < cHeight; y++) {
            let curPixel =  (x * cHeight + y + 1) * 4
            //console.log(curPixel)
            if(curPixel === undefined){
                curPixel = [255, 255, 255, 255]
            }

            img.data[(y * cWidth + x + 1) * 4] = curPixel[0]
            img.data[(y * cWidth + x + 1) * 4 + 1] = curPixel[1]
            img.data[(y * cWidth + x + 1) * 4 + 2] = curPixel[2]
            img.data[(y * cWidth + x + 1) * 4 + 3] = curPixel[3]


        }
    }

    // y * cWidth + x + 1
    // x * cHeight + y + 1


    
    return img
}

const getHeight = (width, num) => {
    return (Math.floor((num + 1) / width))
}


export default Mandel