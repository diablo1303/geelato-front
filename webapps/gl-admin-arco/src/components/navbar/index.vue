<template>
  <div class="navbar">
    <!--  头部菜单，左侧菜单，应用图标、应用名称  -->
    <div class="left-side">
      <a-space>
        <span style="text-align: center;width: 32px;height: 32px;">
            <img :src="appInfo.appLogo" alt="logo" style="width: 100%;height: 100%"/>
        </span>
        <a-typography-title :heading="5" :style="{ margin: 0, fontSize: '18px' }">
          {{ appInfo.appName }}
        </a-typography-title>
        <icon-menu-fold
            v-if="!topMenu && appStore.device === 'mobile'"
            style="font-size: 22px; cursor: pointer"
            @click="toggleDrawerMenu($event)"
        />
      </a-space>
    </div>
    <!--  头部菜单，中部菜单  -->
    <div class="center-side">
      <Menu v-if="topMenu"/>
    </div>
    <!--  头部菜单，右侧菜单，搜索、语言切换、明暗背景、消息、全屏模式、页面设置、用户  -->
    <ul class="right-side">
      <!--   搜索   -->
      <li v-show="false">
        <a-tooltip :content="$t('settings.search')">
          <a-button :shape="'circle'" class="nav-btn" type="outline">
            <template #icon>
              <icon-search/>
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!--   语言切换   -->
      <li v-show="false">
        <a-tooltip :content="$t('settings.language')">
          <a-button
              :shape="'circle'"
              class="nav-btn"
              type="outline"
              @click="setDropDownVisible($event)"
          >
            <template #icon>
              <icon-language/>
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale as any">
          <div ref="triggerBtn" class="trigger-btn"></div>
          <template #content>
            <a-doption
                v-for="item in locales"
                :key="item.value"
                :value="item.value"
            >
              <template #icon>
                <icon-check v-show="item.value === currentLocale"/>
              </template>
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li>
      <!--   明暗背景   -->
      <li>
        <a-tooltip
            :content="
            theme === 'light'
              ? $t('settings.navbar.theme.toDark')
              : $t('settings.navbar.theme.toLight')
          "
        >
          <a-button
              :shape="'circle'"
              class="nav-btn"
              type="outline"
              @click="handleToggleTheme($event)"
          >
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'"/>
              <icon-sun-fill v-else/>
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!--   消息   -->
      <li>
        <a-tooltip :content="$t('settings.navbar.alerts')">
          <div class="message-box-trigger">
            <a-badge :count="9" dot>
              <a-button
                  :shape="'circle'"
                  class="nav-btn"
                  type="outline"
                  @click="setPopoverVisible($event)"
              >
                <icon-notification/>
              </a-button>
            </a-badge>
          </div>
        </a-tooltip>
        <a-popover
            :arrow-style="{ display: 'none' }"
            :content-style="{ padding: 0, minWidth: '400px' }"
            content-class="message-popover"
            trigger="click"
        >
          <div ref="refBtn" class="ref-btn"></div>
          <template #content>
            <message-box/>
          </template>
        </a-popover>
      </li>
      <!--   全屏模式   -->
      <li>
        <a-tooltip
            :content="
            isFullscreen
              ? $t('settings.navbar.screen.toExit')
              : $t('settings.navbar.screen.toFull')
          "
        >
          <a-button
              :shape="'circle'"
              class="nav-btn"
              type="outline"
              @click="toggleFullScreen"
          >
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen"/>
              <icon-fullscreen v-else/>
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!--  页面设置    -->
      <li v-show="false">
        <a-tooltip :content="$t('settings.title')">
          <a-button
              :shape="'circle'"
              class="nav-btn"
              type="outline"
              @click="setVisible($event)"
          >
            <template #icon>
              <icon-settings/>
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!--   用户   -->
      <li>
        <a-dropdown trigger="click">
          <a-avatar
              :size="32"
              :style="{ marginRight: '8px', cursor: 'pointer' }"
          >
            <img :src="avatar" alt="avatar"/>
          </a-avatar>
          <template #content>
            <!--     切换角色       -->
            <a-doption v-show="false">
              <a-space @click="switchRoles">
                <icon-tag/>
                <span>
                  {{ $t('messageBox.switchRoles') }}
                </span>
              </a-space>
            </a-doption>
            <!--     用户中心       -->
            <a-doption v-show="false">
              <a-space @click="$router.push({ name: 'Info' })">
                <icon-user/>
                <span>
                  {{ $t('messageBox.userCenter') }}
                </span>
              </a-space>
            </a-doption>
            <!--     用户设置       -->
            <a-doption v-show="false">
              <a-space @click="$router.push({ name: 'Setting' })">
                <icon-settings/>
                <span>
                  {{ $t('messageBox.userSettings') }}
                </span>
              </a-space>
            </a-doption>
            <!--     账号设置       -->
            <a-doption>
              <a-space @click="accountSettingsClick($event)">
                <icon-settings/>
                <span>
                  {{ $t('messageBox.accountSettings') }}
                </span>
              </a-space>
            </a-doption>
            <!--      登出登录      -->
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export/>
                <span>
                  {{ $t('messageBox.logout') }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {computed, inject, ref} from 'vue';
import {Message} from '@arco-design/web-vue';
import {useDark, useFullscreen, useToggle} from '@vueuse/core';
import {useAppStore, useUserStore} from '@/store';
import {useRoute, useRouter} from 'vue-router';
import {LOCALE_OPTIONS} from '@/locale';
import useLocale from '@/hooks/locale';
import useUser from '@/hooks/user';
import Menu from '@/components/menu/index.vue';
import {getApp, getDownloadUrlById} from "@/api/application";
import defaultAvatar from '@/assets/images/default-avatar.png';
import {ACCOUNT_ROUTE_PATH} from "@/router/constants";
import {IS_ACCOUNT} from "@/router/routes";
import MessageBox from '../message-box/index.vue';

const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const {logout} = useUser();
const {changeLocale, currentLocale} = useLocale();
const {isFullscreen, toggle: toggleFullScreen} = useFullscreen();
const locales = [...LOCALE_OPTIONS];
const avatar = computed(() => {
  const userAvatar = userStore.userInfo.avatar;
  return userAvatar ? getDownloadUrlById(userAvatar) : defaultAvatar;
});
const theme = computed(() => {
  return appStore.theme;
});
const topMenu = computed(() => appStore.topMenu && appStore.menu);
const isDark = useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'arco-theme',
  onChanged(dark: boolean) {
    // overridden default behavior
    appStore.toggleTheme(dark);
  },
});
const toggleTheme = useToggle(isDark);
const handleToggleTheme = (ev: MouseEvent) => {
  toggleTheme();
};
const setVisible = (ev: MouseEvent) => {
  appStore.updateSettings({globalSettings: true});
};
const refBtn = ref();
const triggerBtn = ref();
const setPopoverVisible = (ev: MouseEvent) => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  refBtn.value.dispatchEvent(event);
};
const handleLogout = () => {
  logout();
};
const setDropDownVisible = (ev: MouseEvent) => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  triggerBtn.value.dispatchEvent(event);
};
const switchRoles = async () => {
  const res = await userStore.switchRoles();
  Message.success(res as string);
};
const toggleDrawerMenu = inject('toggleDrawerMenu') as (ev: MouseEvent) => void;

const appInfo = ref({appLogo: "/src/assets/favicon.ico", appName: "Geelato Admin Pro"});
const getAppInfo = async () => {
  if (route.params && route.params.appId) {
    try {
      const {data} = await getApp(route.params.appId as string);
      appInfo.value.appName = data.name;
      if (data.logo) {
        appInfo.value.appLogo = getDownloadUrlById(data.logo);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
getAppInfo();

const accountSettingsClick = (ev?: MouseEvent) => {
  if (IS_ACCOUNT.value) {
    router.push({path: ACCOUNT_ROUTE_PATH});
  } else {
    window.open(router.resolve({path: ACCOUNT_ROUTE_PATH}).href, "_blank");
  }
}
</script>

<style lang="less" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.center-side {
  flex: 1;
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;

  :deep(.locale-select) {
    border-radius: 20px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }

  .nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
  }

  .trigger-btn,
  .ref-btn {
    position: absolute;
    bottom: 14px;
  }

  .trigger-btn {
    margin-left: 14px;
  }
}
</style>

<style lang="less">
.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>
