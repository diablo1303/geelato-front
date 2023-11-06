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
        自主可控的服务平台
      </div>
      <!--        <div class="banner-slogan-sub-title">-->
      <!--          自主可控的服务平台-->
      <!--        </div>-->
      <div class="gl-banner-slogan-keys">
        <div>
          提供单证发送服务
        </div>
        <div>
          提高数据使用效率
        </div>
        <div>
          助力代订舱服务品质
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
