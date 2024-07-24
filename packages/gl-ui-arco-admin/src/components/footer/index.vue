<script lang="ts">
export default {
  name: 'GlFooter',
}
</script>

<script lang="ts" setup>
import {computed} from "vue";
import {useTenantStore} from "../../store";

const tenantStore = useTenantStore();
const tenantData = computed(() => {
  return {copyright: tenantStore.copyright, icpFilingNo: tenantStore.icpFilingNo};
});
</script>

<template>
  <a-layout-footer class="footer">
    {{ tenantData.copyright }}&nbsp;&nbsp;
    <a href="https://beian.miit.gov.cn/" style="text-decoration:none" target="_blank">{{ tenantData.icpFilingNo }}</a>
  </a-layout-footer>
</template>

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