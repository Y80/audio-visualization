<script setup lang="ts">
import { onMounted, ref } from 'vue'
import VisualizerCanvas from '../lib/VisualizerCanvas'
import AudioManager from '../lib/AudioManager'

const audioRef = ref<null | HTMLAudioElement>(null)
const canvasRef = ref<null | HTMLCanvasElement>(null)

onMounted(() => {
  if (!canvasRef.value || !audioRef.value) return

  audioRef.value.addEventListener('play', handlePlay)
  audioRef.value.addEventListener('pause', handlePause)

  const vizCanvas = new VisualizerCanvas(canvasRef.value)
  const audioMgt = new AudioManager(audioRef.value)

  vizCanvas.drawFirstFrame()

  let animationFrameTimer = 0

  function handlePlay() {
    function renderFrame() {
      vizCanvas.drawFrame(audioMgt.getFrequencyData())
      animationFrameTimer = window.requestAnimationFrame(renderFrame)
    }
    animationFrameTimer = window.requestAnimationFrame(renderFrame)
  }

  function handlePause() {
    window.cancelAnimationFrame(animationFrameTimer)
    vizCanvas.end()
  }
})
</script>

<template>
  <main class="flex flex-col items-center gap-8 mt-24">
    <canvas :ref="(el) => (canvasRef = el as any)" width="800" height="500" class="p-4 border rounded-lg bg-black" />
    <audio :ref="(el) => (audioRef = el as any)" src="/sample.mp3" controls />
  </main>
</template>
