import { computed, onScopeDispose, ref } from 'vue'
import { useRafFn } from '@vueuse/core'

export default function useCountdown(initSeconds: number) {
  const remainSeconds = ref(0)

  const count = computed(() => Math.ceil(remainSeconds.value))

  const isCounting = computed(() => remainSeconds.value > 0)

  const { pause, resume } = useRafFn(({ delta }) => {
    if (remainSeconds.value <= 0) {
      remainSeconds.value = 0
      return pause()
    }

    const secondsPassed = delta / 1000
    remainSeconds.value -= secondsPassed

    if (remainSeconds.value <= 0) {
      remainSeconds.value = 0
      pause()
    }
  }, { immediate: false })

  function start(updatedSeconds: number = initSeconds) {
    remainSeconds.value = updatedSeconds
    resume()
  }

  function stop() {
    remainSeconds.value = 0
    pause()
  }

  onScopeDispose(pause)

  return {
    count,
    isCounting,
    start,
    stop
  }
}
