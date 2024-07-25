<script lang="ts">
export default {
  name: 'userAccount',
};
</script>

<script lang="ts" setup>
import Breadcrumb from '../../../components/breadcrumb/index.vue';
import UserAccount from '../../../components/account/user/index.vue';
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['menu.account', 'menu.account.user']"/>
    <UserAccount/>
  </div>
</template>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}
</style>
