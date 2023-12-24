<script lang="ts">
export default {
  name: 'index'
}
</script>
<script lang="ts" setup>
import {ref, watch, computed} from "vue";
import {useTenantStore} from "@/store";
import useLocale from "@/hooks/locale";
import {LOCALE_OPTIONS} from "@/locale";

const {changeLocale, currentLocale} = useLocale();
const locales = [...LOCALE_OPTIONS];
const emits = defineEmits(['update:modelValue', 'changeLanguage'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
const changeLanguageClick = (value: string) => {
  changeLocale(value);
  emits('changeLanguage', value);
}
const triggerBtn = ref();
const setDropDownVisible = (ev: MouseEvent) => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  triggerBtn.value.dispatchEvent(event);
};
</script>

<template>
  <div class="navbar">
    <ul class="right-side">
      <li>
        <a-button class="nav-btn" type="text" @click="setDropDownVisible($event)">
          <template #icon>
            <icon-language/>
          </template>
          {{ $t('settings.language') }}
        </a-button>
        <a-dropdown position="bl" trigger="click" @select="changeLanguageClick as any">
          <div ref="triggerBtn" class="trigger-btn"></div>
          <template #content>
            <a-doption
                v-for="item in locales" :key="item.value" :value="item.value">
              <template #icon>
                <icon-check v-show="item.value === currentLocale"/>
              </template>
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<style lang="less">
.navbar {
  display: flex;
  justify-content: flex-end;
}

.right-side {
  display: flex;
  padding-right: 80px;
  padding-top: 22px;
  list-style: none;

  :deep(.locale-select) {
    border-radius: 20px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }

  .nav-btn {
    /* border-color: rgb(var(--gray-2)); */
    color: rgb(var(--gray-8));
    font-size: 16px;
  }

  .trigger-btn,
  .ref-btn {
    position: absolute;
    bottom: 14px;
  }

  .trigger-btn {
    margin-left: 14px;
  }
}
</style>
