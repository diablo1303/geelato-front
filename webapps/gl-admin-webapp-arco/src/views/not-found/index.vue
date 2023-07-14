<template>
  <div class="content">
    <a-result :subtitle="'not found'" class="result" status="404"></a-result>
    <div class="operation-row">
      <a-button key="back" type="primary" @click="back($event)"> back</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router';
import {DEFAULT_ROUTE} from "@/router/constants";

const router = useRouter();
const back = (ev: MouseEvent) => {
  console.log(DEFAULT_ROUTE)
  // warning： Go to the node that has the permission
  router.push({name: DEFAULT_ROUTE.name, params: DEFAULT_ROUTE.params});
};
</script>

<style lang="less" scoped>
.content {
  // padding-top: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -95px;
  margin-top: -121px;
  text-align: center;
}
</style>
