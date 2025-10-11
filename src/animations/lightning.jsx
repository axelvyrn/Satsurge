// Thanks to https://github.com/stackernews/stacker.news for the original implementation and inspiration

import React, { useRef, useEffect } from 'react'
import { randInRange } from '../utils/rand.ts'

// Lightning animation component
export function Lightning ({ onDone }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas.bolt) return

    const context = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    canvas.bolt = new Bolt(context, {
      startPoint: [Math.random() * (canvas.width * 0.5) + (canvas.width * 0.25), 0],
      length: canvas.height,
      speed: 100,
      spread: 30,
      branches: 20,
      onDone
    })
    canvas.bolt.draw()
  }, [])

  return <canvas className='fixed inset-0' ref={canvasRef} style={{ zIndex: 1000, pointerEvents: 'none' }} />
}

// Bolt animation class
function Bolt (ctx, options) {
  this.options = {
    startPoint: [0, 0],
    length: 100,
    angle: 90,
    speed: 30,
    spread: 50,
    branches: 10,
    maxBranches: 10,
    lineWidth: 3,
    ...options
  }
  this.point = [this.options.startPoint[0], this.options.startPoint[1]]
  this.branches = []
  this.lastAngle = this.options.angle
  this.children = []

  ctx.shadowColor = 'rgba(250, 218, 94, 1)'
  ctx.shadowBlur = 5
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.fillStyle = 'rgba(250, 250, 250, 1)'
  ctx.strokeStyle = 'rgba(250, 218, 94, 1)'
  ctx.lineWidth = this.options.lineWidth

  this.draw = (isChild) => {
    ctx.beginPath()
    ctx.moveTo(this.point[0], this.point[1])
    const angleChange = randInRange(1, this.options.spread)
    this.lastAngle += this.lastAngle > this.options.angle ? -angleChange : angleChange
    const radians = this.lastAngle * Math.PI / 180

    this.point[0] += Math.cos(radians) * this.options.speed
    this.point[1] += Math.sin(radians) * this.options.speed

    ctx.lineTo(this.point[0], this.point[1])
    ctx.stroke()

    const d = Math.sqrt(
      Math.pow(this.point[0] - this.options.startPoint[0], 2) +
      Math.pow(this.point[1] - this.options.startPoint[1], 2)
    )

    if (randInRange(0, 99) < this.options.branches && this.children.length < this.options.maxBranches) {
      this.children.push(new Bolt(ctx, {
        startPoint: [this.point[0], this.point[1]],
        length: d * 0.8,
        angle: this.lastAngle + randInRange(350 - this.options.spread, 370 + this.options.spread),
        resistance: this.options.resistance,
        speed: this.options.speed - 2,
        spread: this.options.spread - 2,
        branches: this.options.branches,
        lineWidth: ctx.lineWidth
      }))
    }

    this.children.forEach(child => {
      child.draw(true)
    })

    if (isChild) {
      return
    }

    if (d < this.options.length) {
      window.requestAnimationFrame(() => { this.draw() })
    } else {
      ctx.canvas.style.opacity = 1
      this.fade()
    }
  }

  this.fade = function () {
    ctx.canvas.style.opacity -= 0.04
    if (ctx.canvas.style.opacity <= 0) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      this.options.onDone()
      return
    }

    setTimeout(() => { this.fade() }, 50)
  }
}

// Function to trigger lightning animation
export function strike() {
  const key = Date.now() + Math.random()

  return key
}

// React hook for managing lightning state if needed
export function useLightningState() {
  const [lightningBolts, setLightningBolts] = React.useState([])

  const triggerStrike = () => {
    const key = strike()
    setLightningBolts(prev => [...prev, <Lightning key={key} onDone={() => {
      setLightningBolts(prev => prev.filter(bolt => bolt.key !== key))
    }} />])
  }

  return {
    lightningBolts,
    triggerStrike
  }
}