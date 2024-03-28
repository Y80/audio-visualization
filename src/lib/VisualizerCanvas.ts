export default class VisualizerCanvas {
  w: number
  h: number
  ctx: CanvasRenderingContext2D
  column: {
    w: number
    /** 列之间的间距 */
    gap: number
    /** 画布上的列的数量 */
    num: number
    gradient: CanvasGradient
  }
  cap: { w: number; h: number; style: string; lastY: number[] }

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.w = canvas.width
    this.h = canvas.height
    this.ctx = canvas.getContext('2d')!
    this.column = {
      w: 10,
      /** 列之间的间距 */
      gap: 2,
      /** 画布上的列的数量 */
      num: 0,
      gradient: this.ctx.createLinearGradient(0, 0, 0, this.h),
    }
    this.column.num = Math.floor(this.w / (this.column.w + this.column.gap))
    this.column.gradient.addColorStop(0, '#f00')
    this.column.gradient.addColorStop(0.2, '#f00')
    this.column.gradient.addColorStop(0.6, '#ff0')
    this.column.gradient.addColorStop(1, '#0f0')
    this.cap = {
      w: this.column.w,
      h: 2,
      style: '#fff',
      lastY: [],
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.w, this.h)
  }

  startX(idx = 0) {
    return idx * (this.column.w + this.column.gap)
  }

  // 画第一帧，把 cap 画出来
  drawFirstFrame() {
    this.ctx.fillStyle = this.cap.style
    const startY = this.h - this.cap.h
    for (let i = 0; i < this.column.num; i++) {
      this.ctx.fillRect(this.startX(i), startY, this.column.w, this.cap.h)
    }
  }

  drawFrame(frequencyData: Uint8Array) {
    // frequencyData.length 由 analyze.fftSize 决定，它一定是 2 的 幂，如 1024/2048...
    this.clear()
    const step = Math.floor(frequencyData.length / this.column.num)
    for (let i = 0; i < this.column.num; i++) {
      let frequencyValue = frequencyData[i * step]
      // frequencyValue 的值范围在 0-255，这里把它根据画布高度转换一下数值，提高视觉效果
      frequencyValue = Math.floor((frequencyValue * this.h) / (2 ** 8 - 1))
      const startX = this.startX(i)
      this.drawCap(i, startX, frequencyValue)
      this.drawColumn(startX, frequencyValue)
    }
  }

  drawColumn(startX: number, frequencyValue: number) {
    this.ctx.fillStyle = this.column.gradient
    this.ctx.fillRect(startX, this.h - frequencyValue, this.column.w, this.h)
  }

  drawCap(i: number, startX: number, frequencyValue: number) {
    const { cap } = this
    this.ctx.fillStyle = cap.style
    if (cap.lastY[i] > frequencyValue) {
      // 之前 cap 的位置比当前 value 大，让其 -1，连续多次 -1 形成的视觉效果就是自由下落
      cap.lastY[i] -= 2
    } else {
      // 直接 = value, 有一种 cap 被顶上去的视觉效果，注意这里是不需要过渡的（即连续的+1）
      cap.lastY[i] = frequencyValue
    }

    this.ctx.fillRect(startX, this.h - cap.lastY[i] - cap.h, cap.w, cap.h)
  }

  end() {
    const finished = () => this.cap.lastY.every((y) => y === 0)
    const draw = () => {
      this.clear()
      for (let i = 0; i < this.column.num; i++) {
        this.drawCap(i, this.startX(i), 0)
      }
      !finished() && window.requestAnimationFrame(draw)
    }
    window.requestAnimationFrame(draw)
  }
}
