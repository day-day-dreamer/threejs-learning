// event.js
import { onMounted, onUnmounted } from "vue";

const useEventListener = (target, event, callback, bool = false) => {
  onMounted(() => target.addEventListener(event, callback, bool));
  onUnmounted(() => target.removeEventListener(event, callback, bool));
};
export default useEventListener;
