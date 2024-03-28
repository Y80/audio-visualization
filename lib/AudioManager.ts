export default class AudioManager {
  initialed = false

  private _ctx: AudioContext
  private _analyzer: AnalyserNode
  private _source: MediaElementAudioSourceNode

  constructor(private readonly audio: HTMLAudioElement) {}

  // 浏览器为了用户体验，不允许没有任何交互时触发音频播放。实例化 AudioContext 同理。
  // 因此 init() 需要延迟执行
  tryInit() {
    if (this.initialed) return
    const ctx = new AudioContext()
    const analyzer = ctx.createAnalyser()
    const source = ctx.createMediaElementSource(this.audio)
    source.connect(analyzer)
    source.connect(ctx.destination)
    this._ctx = ctx
    this._analyzer = analyzer
    this._source = source
    this.initialed = true
  }

  get ctx() {
    this.tryInit()
    return this._ctx
  }

  get analyzer() {
    this.tryInit()
    return this._analyzer
  }

  getFrequencyData() {
    const data = new Uint8Array(this.analyzer.frequencyBinCount)
    this.analyzer.getByteFrequencyData(data)
    return data
  }
}
