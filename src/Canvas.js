import React, { useRef, useEffect } from 'react'

const Canvas = props => {

  
  const { draw} = props
  const canvasRef = useRef(null)
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let animationFrameId
    
    const render = () => {
      draw(context)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

//640 320
  return <canvas width={16*50} height={9*50} ref={canvasRef} />
}

export default Canvas