<template>
  <div class="container">
    <div class="logo">
      <img v-if="tenantData.logoIcon" alt="logo" :src="tenantData.logoIcon" style="width: 14%"/>
      <div class="logo-text">{{ tenantData.name }}</div>
    </div>
    <ResetPasswordBanner/>
    <div class="content">
      <div class="top">
        <LoginNavTop v-if="tenantData.lang" @change-language="changeLanguage"/>
      </div>
      <div class="content-inner">
        <ResetPasswordForm/>
      </div>
      <div class="footer">
        <Footer/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted} from "vue";
import {useTenantStore} from "@/store";
import ResetPasswordBanner from '@/components/banner/index.vue';
import ResetPasswordForm from "@/views/reset/password/reset-password.vue";
import Footer from '@/components/footer/index.vue';
import LoginNavTop from "@/components/navtop/index.vue";

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
    width: 550px;
    background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
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
