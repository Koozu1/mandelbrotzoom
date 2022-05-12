import React, { Component } from "react";
import Sketch from "react-p5";
import Canvas from "./Canvas";

export default class App extends Component {
  x = 50
  y = 50
  sf = 1
  height = 360 //360
  width = 640 //640
  transformX = 0
  transformY = 0
  isMouseDragged = null
  cenX = 0;
  cenY = 0;
 

  setup = (p5, parent) => {
    const cnv = p5.createCanvas(1000, 1000).parent(parent)
    p5.noStroke()
    p5.colorMode(p5.HSB)


    this.drawBrot(p5)

    cnv.mouseWheel((event) => {
      //console.log(event)
      console.log(this.sf)

      var delta = -event.deltaY
      if(delta > 0){
        console.log( "stuff",this.cenX, p5.mouseX)
        this.sf *= 1.05
        this.cenX += 0.001 * (1 / this.sf) * (p5.mouseX - (this.width / 2) - this.cenX)
        this.cenY += 0.001 * (1 / this.sf) * (p5.mouseY - (this.height / 2) - this.cenY)
        
      
      }else{
        this.sf *= 0.95

        this.cenX -= 0.001 * (1 / this.sf) * (p5.mouseX - (this.width / 2) - this.cenX)
        this.cenY -= 0.001 * (1 / this.sf) * (p5.mouseY - (this.height / 2) - this.cenY)

      }
      
      this.drawBrot(p5)
    })

    cnv.mousePressed(() => {
      
    })
  }

  draw = p5 => {
    let mx = p5.mouseX
    let my = p5.mouseY
  }

  drawBrot = p5 => {
    for (let x = 0; x < this.width; x++) {
      for(let y = 0; y < this.height; y++) {
        let  c = this.pixelToPoint(p5, x, y)
        let result = this.calculatePoint(p5, c)

        if(result.isIn){
          p5.set(x, y, p5.color(0))
        }else if(result.i > 1){
          p5.set(x, y, p5.color(
            150 + 200 - p5.pow(result.i / (50), 0.5) * 200 % 255, 80, 100
            ))
        }else{
          p5.set(x, y, p5.color(50))
        }


      }
    }
    p5.updatePixels()

  }

  pixelToPoint = (p5, x, y) => {
    let p = p5.createVector(
      (x - this.width / 2) * (4 / this.width) * (16/ (9 * this.sf)) + this.cenX,
      (y - this.height / 2) * (4 / this.height) * ( 1 / this.sf) + this.cenY

    )

    return p

  }

  calculatePoint = (p5, c) => {
    let z0 = p5.createVector(0, 0)
    let i = 0
    let bounds = 2
    let isIn = true

    while ( i < 50 && isIn){
      z0 = p5.createVector(
        z0.x * z0.x - z0.y * z0.y + c.x,
        2 * z0.x * z0.y + c.y
      )
      i++
      if(z0.mag() > bounds){
        isIn = false
      }
    }
    return{
      'i': i,
      'isIn': isIn
    }
  }
  
  randNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  render() {
    return( 
    <>
      <Sketch setup={this.setup} draw={this.draw} />
      <p>KIRVA</p>

    </>
    )
  }
}