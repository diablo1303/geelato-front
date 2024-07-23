<script lang="ts">
export default {
  name: 'userAccount',
};
</script>

<script lang="ts" setup></script>

<template>
  <div class="container">
    <GlBreadcrumb :items="['menu.account', 'menu.account.user']"/>
    <GlUserAccount/>
  </div>
</template>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}
</style>
