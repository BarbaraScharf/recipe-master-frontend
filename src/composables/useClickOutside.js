/**
 * useClickOutside — composable que chama um callback quando o usuário
 * clica fora do elemento referenciado por `targetRef`.
 *
 * Uso:
 *   const containerRef = ref(null)
 *   useClickOutside(containerRef, () => { isOpen.value = false })
 */
import { onMounted, onUnmounted } from 'vue'

export function useClickOutside(targetRef, callback) {
  function handleClick(event) {
    if (targetRef.value && !targetRef.value.contains(event.target)) {
      callback()
    }
  }

  onMounted(() => document.addEventListener('mousedown', handleClick))
  onUnmounted(() => document.removeEventListener('mousedown', handleClick))
}
