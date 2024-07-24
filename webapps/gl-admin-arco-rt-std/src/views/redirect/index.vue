<script lang="ts">
export default {
  name: "Redirect"
}
</script>

<script lang="ts" setup>
import {useRoute, useRouter} from 'vue-router';

const router = useRouter();
const route = useRoute();

const gotoPath = route.params.path as string;

router.replace({path: gotoPath});
</script>

<template>
  <div></div>
</template>

<style lang="less" scoped></style>
