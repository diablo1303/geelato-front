<script lang="ts">
export default {
  name: "ResetIndex",
}
</script>

<script lang="ts" setup>
import {computed, onMounted} from "vue";
import {useTenantStore} from "../../store";
import Banner from "../../components/banner/index.vue";
import NavTop from "../../components/navtop/index.vue";
import ResetPassword from "../../components/reset-password/index.vue";
import Footer from "../../components/footer/index.vue";


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

<template>
  <div class="container">
    <div class="logo">
      <img v-if="tenantData.logoIcon" :src="tenantData.logoIcon" alt="logo" style="width: 14%"/>
      <div class="logo-text">{{ tenantData.name }}</div>
    </div>
    <Banner/>
    <div class="content">
      <div class="top">
        <NavTop v-if="tenantData.lang" @change-language="changeLanguage"/>
      </div>
      <div class="content-inner">
        <ResetPassword/>
      </div>
      <div class="footer">
        <Footer/>
      </div>
    </div>
  </div>
</template>

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