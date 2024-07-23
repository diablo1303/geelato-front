<script lang="ts">
export default {
  name: 'GlBanner',
}
</script>

<script lang="ts" setup>
import {ref, watch, computed} from "vue";
import {useTenantStore} from "../../store";

const emits = defineEmits(['update:modelValue'])
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

const tenantStore = useTenantStore();
const tenantData = computed(() => {
  return {slogan: tenantStore.slogan, features: tenantStore.features};
});
</script>

<template>
  <div class="gl-banner">
    <div class="gl-banner-slogan">
      <div class="gl-banner-slogan-title">
        {{ tenantData.slogan }}
      </div>
      <div class="gl-banner-slogan-keys">
        <div v-for="(features,i) in tenantData.features" :key="i">
          <span v-for="(feature,j) in features" :key="j">
          &nbsp;{{ feature.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.gl-banner {
  width: 500px;
  background-color: #002a49;
  background-image: url("../../assets/images/banner-bg.png");
  /* 让背景图基于容器大小伸缩 */
  background-size: cover;

  &-slogan {
    margin-top: 80px;
    margin-left: 80px;
    margin-right: 40px;
    color: var(--color-fill-1);
    font-size: 16px;

    &-title {
      margin-top: 148px;
      font-size: 32px;
    }

    &-sub-title {
      margin-top: 14px;
      font-size: 24px;
    }

    &-keys {
      margin-top: 48px;

      div {
        margin-top: 20px;
        color: rgba(231, 231, 231, 0.6);
      }

      div::before {
        content: '√';
      }
    }
  }
}
</style>