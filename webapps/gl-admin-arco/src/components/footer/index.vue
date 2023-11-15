<template>
  <a-layout-footer class="footer">
    {{ appInfo.powerInfo }} {{ appInfo.versionInfo }} &nbsp;&nbsp;
    <a href="https://beian.miit.gov.cn/" style="text-decoration:none" target="_blank">粤ICP备2023086045号</a>
  </a-layout-footer>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getApp} from "@/api/application";

const router = useRouter();
const route = useRoute();

const appInfo = ref({powerInfo: "Geelato Admin Pro", versionInfo: "1.0"});
const getAppInfo = async () => {
  if (route.params && route.params.appId) {
    try {
      const {data} = await getApp(route.params.appId as string);
      appInfo.value.powerInfo = data.powerInfo || data.name;
      appInfo.value.versionInfo = data.versionInfo;
    } catch (err) {
      console.log(err);
    }
  }
}
// getAppInfo();
</script>

<style lang="less" scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  color: var(--color-text-2);
  text-align: center;
}
</style>
