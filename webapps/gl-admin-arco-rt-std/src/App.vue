<template>
  <a-config-provider :locale="locale">
    <router-view/>
    <global-setting/>
  </a-config-provider>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
import GlobalSetting from '@/components/global-setting/index.vue';
import useLocale from '@/hooks/locale';

const {currentLocale} = useLocale();
const locale = computed(() => {
  switch (currentLocale.value) {
    case 'zh-CN':
      return zhCN;
    case 'en-US':
      return enUS;
    default:
      return enUS;
  }
});
</script>

+<style lang="less">
:root {
  --sider-bg-color: #002a49;
  --gl-color-transparent: rgba(255, 255, 255, 0);
  --gl-color-text-0: rgba(255, 255, 255, 1);
  --gl-color-text-1: rgba(255, 255, 255, 0.9);
  --gl-color-text-2: rgba(255, 255, 255, 0.8);
  --menu-item-selected-color: rgba(30, 144, 255, 1);
  --menu-sub-item-selected-color: rgba(30, 144, 255, 0.3);
}

body[gl-nav-style='leftBlue'] {
  .layout-navbar {

    .navbar {
      border-bottom: 0;

      .left-side {
        // 注册这里的值需要和 src/config/settings.json的menuWidth一致
        background-color: var(--sider-bg-color);

        .arco-typography {
          color: var(--gl-color-text-0);
        }
      }

      .center-side,
      .right-side {
        border-bottom: 1px solid var(--color-border);
        min-height: 60px;
        margin: 0;
      }
    }

    .navbar.gl-menu-collapse {
      .left-side {
        padding-left: 8px;
      }
    }
  }

  .arco-layout-sider {
    .arco-menu {
      background-color: var(--sider-bg-color);
      background-image: url('assets/images/banner-bg.png');
      /* 让背景图基于容器大小伸缩 */
      background-size: cover;

      .arco-menu-inline,
      .arco-menu-inline-content,
      .arco-menu-item,
      .arco-menu-inline-header,
      .arco-menu-pop {
        background-color: var(--gl-color-transparent);
        color: var(--gl-color-text-2);
      }

      .arco-menu-inline-content{
        color: #8f8f8f;
      }

      .arco-menu-selected {
        background-color: var(--menu-item-selected-color);
      }

      .arco-menu-inline-content .arco-menu-selected{
        background-color: var(--menu-sub-item-selected-color);
      }

      .arco-menu-inline-header.arco-menu-selected:hover{
        background-color: var(--menu-item-selected-color);
        color: #FFFFFF;
      }
      .arco-menu-item:not(.arco-menu-selected):hover {
        background-color: var(--gl-color-transparent);
        color: #FFFFFF;
      }

      .arco-menu-icon > svg,
      .gl-icon-font > svg,
      .arco-menu-icon-suffix > svg {
        color: var(--gl-color-text-2);
      }

      .arco-menu-collapse-button {
        border-radius: 12px;
      }
    }
  }
}
</style>
