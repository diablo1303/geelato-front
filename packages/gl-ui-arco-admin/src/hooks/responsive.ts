import {onBeforeMount, onBeforeUnmount, onMounted} from 'vue';
import {useDebounceFn} from '@vueuse/core';
import {useAppStore} from '../store';
import {eventUtil} from '@geelato/gl-ui';

const WIDTH = 992; // https://arco.design/vue/component/grid#responsivevalue

function queryDevice() {
  const rect = document.body.getBoundingClientRect();
  return rect.width - 1 < WIDTH;
}

export default function useResponsive(immediate?: boolean) {
  const appStore = useAppStore();

  function resizeHandler() {
    if (!document.hidden) {
      const isMobile = queryDevice();
      appStore.toggleDevice(isMobile ? 'mobile' : 'desktop');
      appStore.toggleMenu(isMobile);
    }
  }

  const debounceFn = useDebounceFn(resizeHandler, 100);
  onMounted(() => {
    if (immediate) debounceFn();
  });
  onBeforeMount(() => {
    eventUtil.addEventListen(window, 'resize', debounceFn);
  });
  onBeforeUnmount(() => {
    eventUtil.removeEventListen(window, 'resize', debounceFn);
  });
}
