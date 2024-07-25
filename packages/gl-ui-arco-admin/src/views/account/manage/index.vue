<script lang="ts">
export default {
  name: 'manageAccount',
};
</script>

<script lang="ts" setup>
import Breadcrumb from '../../../components/breadcrumb/index.vue';
import ManageAccount from '../../../components/account/manage/index.vue';
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['menu.account', 'menu.account.manage']"/>
    <ManageAccount/>
  </div>
</template>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}
</style>