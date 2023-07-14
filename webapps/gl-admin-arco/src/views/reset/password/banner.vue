<template>
  <div class="banner">
    <div class="banner-inner">
      <a-carousel animation-name="fade" class="carousel">
        <a-carousel-item v-for="item in carouselItem" :key="item.slogan">
          <div :key="item.slogan" class="carousel-item">
            <div class="carousel-title">{{ item.slogan }}</div>
            <div class="carousel-sub-title">{{ item.subSlogan }}</div>
            <img :src="item.image" class="carousel-image"/>
          </div>
        </a-carousel-item>
      </a-carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import bannerImage from '@/assets/images/reset-banner.png';

const {t} = useI18n();
const carouselItem = computed(() => [
  {
    slogan: t('reset.banner.slogan1'),
    subSlogan: t('reset.banner.subSlogan1'),
    image: bannerImage,
  },
  {
    slogan: t('reset.banner.slogan2'),
    subSlogan: t('reset.banner.subSlogan2'),
    image: bannerImage,
  },
  {
    slogan: t('reset.banner.slogan3'),
    subSlogan: t('reset.banner.subSlogan3'),
    image: bannerImage,
  },
]);
</script>

<style lang="less" scoped>
.banner {
  display: flex;
  align-items: center;
  justify-content: center;

  &-inner {
    flex: 1;
    height: 100%;
  }
}

.carousel {
  height: 100%;

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  &-title {
    color: var(--color-fill-1);
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }

  &-sub-title {
    margin-top: 8px;
    color: var(--color-text-3);
    font-size: 14px;
    line-height: 22px;
  }

  &-image {
    width: 320px;
    margin-top: 30px;
  }
}
</style>
