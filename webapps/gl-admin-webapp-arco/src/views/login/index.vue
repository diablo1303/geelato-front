<template>
  <div class="container">
    <div class="logo">
      <img v-if="tenantData.logoIcon" :src="tenantData.logoIcon" alt="logo" style="width: 14%"/>
      <div class="logo-text">{{ tenantData.name }}</div>
    </div>
    <LoginBanner/>
    <div class="content">
      <div class="top">
        <LoginNavTop v-if="tenantData.lang" @change-language="changeLanguage"/>
      </div>
      <div class="content-inner">
        <LoginForm/>
      </div>
      <div class="footer">
        <Footer/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted} from "vue";
import {useTenantStore} from '@/store';
import Footer from '@/components/footer/index.vue';
import LoginBanner from '@/components/banner/index.vue';
import LoginNavTop from '@/components/navtop/index.vue';
import LoginForm from './components/login-form.vue';

const tenantStore = useTenantStore();
const tenantData = computed(() => {
  return {
    logoIcon: tenantStore.logoIcon || '',
    name: tenantStore.name || '',
    slogan: tenantStore.slogan || '',
    lang: tenantStore.enableMutilLang || false,
  };
});

const loadTag = () => {
  // 标题
  document.title = tenantData.value.slogan;
  // 图标
  let link = null;
  const links = document.getElementsByTagName('link');
  for (let i = 0; i < links.length; i += 1) {
    if (links[0].rel && links[0].rel.indexOf("shortcut icon") !== -1) {
      // eslint-disable-next-line prefer-destructuring
      link = links[0];
      links[0].href = tenantData.value.logoIcon;
    }
  }
  if (!link) {
    link = document.createElement('link');
    link.rel = 'shortcut icon';
    link.type = 'image/x-icon';
    link.href = tenantData.value.logoIcon; // 这里填写您的图标路径
    document.head.appendChild(link);
  }
}

const changeLanguage = async (value: string) => {
  await tenantStore.queryTenant();
  loadTag();
}

onMounted(async () => {
  await tenantStore.queryTenant();
  loadTag();
});
</script>

<style lang="less" scoped>
.container {
  display: flex;
  height: 100vh;

  .banner {
    width: 500px;
    background-color: #002a49;
    background-image: url("../../assets/images/banner-bg.png");
    /* 让背景图基于容器大小伸缩 */
    background-size: cover;

    &-slogan {
      margin-top: 80px;
      margin-left: 80px;
      color: var(--color-fill-1);
      font-size: 16px;

      &-title {
        margin-top: 148px;
        font-size: 32px;
      }

      &-sub-title {
        margin-top: 14px;
        font-size: 24px;
      }

      &-keys {
        margin-top: 48px;

        div {
          margin-top: 16px;
          color: rgba(231, 231, 231, 0.6);
        }

        div::before {
          content: '√';
        }
      }
    }
  }

  .top {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
  }


  .content {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding-top: 40px;
    padding-bottom: 40px;
  }

  .footer {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
  }
}

.logo {
  position: fixed;
  top: 24px;
  left: 22px;
  z-index: 1;
  display: inline-flex;
  align-items: center;

  &-text {
    margin-right: 4px;
    margin-left: 4px;
    color: var(--color-fill-1);
    font-size: 20px;
  }
}
</style>

<style lang="less" scoped>
// responsive
@media (max-width: @screen-lg) {
  .container {
    .banner {
      width: 25%;
    }
  }
}
</style>
