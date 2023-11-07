<script lang="ts">
export default {
  name: 'index'
}
</script>
<script lang="ts" setup>

import {ref, watch} from "vue";

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
</script>

<template>
  <div class="gl-banner">
    <div class="gl-banner-slogan">
      <div class="gl-banner-slogan-title">
        海纳百川，桥通世界
      </div>
      <!--        <div class="banner-slogan-sub-title">-->
      <!--          自主可控数智化服务平台-->
      <!--        </div>-->
      <div class="gl-banner-slogan-keys">
        <div>
          客户、物流、跟踪等一站式服务
        </div>
        <div>
          自主可控、符合企业数字化需求
        </div>
        <div>
          敏捷响应、助力业务高效发展
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
  .gl-banner {
    width: 500px;
    background-color: #002a49;
    background-image: url("@/assets/images/banner-bg.png");
    /* 让背景图基于容器大小伸缩 */
    background-size: cover;

    &-slogan{
      margin-top: 80px;
      margin-left: 80px;
      color: var(--color-fill-1);
      font-size: 16px;
      &-title{
        margin-top: 148px;
        font-size: 32px;
      }
      &-sub-title{
        margin-top: 14px;
        font-size: 24px;
      }
      &-keys{
        margin-top: 48px;
        div{
          margin-top: 16px;
          color: rgba(231, 231, 231, 0.6);
        }
        div::before{
          content: '√';
        }
      }
    }
  }
</style>
