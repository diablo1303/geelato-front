<template>
  <router-view v-slot="{ Component, route }">
    <transition appear mode="out-in" name="fade">
      <div v-if="route.meta.ignoreCache" :key="route.fullPath">
        <component :is="Component"/>
      </div>
      <keep-alive v-else :include="cacheList">
        <div :key="route.fullPath">
          <component :is="Component"/>
        </div>
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useTabBarStore} from '@/store';

const tabBarStore = useTabBarStore();

const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style lang="less" scoped></style>
