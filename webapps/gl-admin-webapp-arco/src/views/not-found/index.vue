<template>
  <div class="content">
    <a-result :subtitle="'not found'" class="result" status="404"></a-result>
    <div class="operation-row">
      <a-button key="back" type="primary" @click="back($event)"> back</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from 'vue-router';
import {DEFAULT_ROUTE} from "@/router/constants";
// eslint-disable-next-line import/no-cycle
import {pageBaseRoute} from "@/router/routes";
import {ref} from "vue";

const router = useRouter();
const route = useRoute();
const routeParams = ref({
  appId: (route && route.params && route.params.appId as string) || '',
  tenantCode: (route && route.params && route.params.tenantCode as string) || ''
});
const back = (ev: MouseEvent) => {
  // console.log(DEFAULT_ROUTE);
  // console.log(`${routeParams.value.tenantCode}/${routeParams.value.appId}`);
  if (routeParams.value.tenantCode && routeParams.value.appId) {
    pageBaseRoute(router, routeParams.value);
  } else {
    router.push({path: '/'});
  }
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
