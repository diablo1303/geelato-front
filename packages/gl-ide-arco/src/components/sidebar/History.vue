<template>
  <div>
    <div class="gl-history-item" v-if="history" v-for="(item,index) in reverseItems">
      <span>{{ index + 1 }}. {{ item.type }}</span>
      <span style="float: right">{{ item.createAt }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlIdePluginCoreHistory",
  data() {
    return {
      history: this.$ide.operationHistory
    }
  },
  computed: {
    reverseItems() {
      return this.history.items.reverse()
    }
  }
})
</script>

<style>
.gl-history-item {
  padding: 0.2em;
}

.gl-history-item:hover {
  cursor: pointer;
  background-color: #e6e6e6;
}
</style>
