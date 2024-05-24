<script lang="ts">
export default {
  name: 'GlBackgroundImageSetter'
}
</script>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { utils } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: Object
})

const backgroundConfig = ref({
  url: props.modelValue?.url,
  repeat: props.modelValue?.repeat,
  size: props.modelValue?.size,
  position: props.modelValue?.position
})

watch(
  backgroundConfig.value,
  (value) => {
    emits('update:modelValue', {
      backgroundImage: `url(${value.url})`,
      backgroundRepeat: value.repeat,
      backgroundSize: value.size,
      backgroundPosition: value.position
    })
  },
  { deep: true }
)
</script>

<template>
  <div class="background-configurator">
    <div class="config-panel">
      <div>
        <label for="image-url">背景图 URL:</label>
        <input
          id="image-url"
          type="text"
          v-model="backgroundConfig.url"
          placeholder="Enter image URL"
        />
      </div>
      <div>
        <label for="repeat">背景重复:</label>
        <select id="repeat" v-model="backgroundConfig.repeat">
          <option value="repeat">Repeat</option>
          <option value="no-repeat">No Repeat</option>
          <option value="repeat-x">Repeat X</option>
          <option value="repeat-y">Repeat Y</option>
        </select>
      </div>
      <div>
        <label for="size">背景尺寸:</label>
        <select id="size" v-model="backgroundConfig.size">
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="auto">Auto</option>
        </select>
      </div>
      <div>
        <label for="position">背景位置:</label>
        <select id="position" v-model="backgroundConfig.position">
          <option value="center">Center</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background-configurator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-preview {
  width: 300px;
  height: 200px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

.config-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
