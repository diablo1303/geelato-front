<template>
  <div class="container">
    <div class="logo">
      <img
          alt="logo"
          :src="favicon"
          style="width: 14%"
      />
      <div class="logo-text">Geelato Admin</div>
    </div>
<!--    <LoginBanner/>-->
    <div class="banner">
      <div class="banner-slogan">
        <div class="banner-slogan-title">
          自主可控的服务平台
        </div>
<!--        <div class="banner-slogan-sub-title">-->
<!--          自主可控的服务平台-->
<!--        </div>-->
        <div class="banner-slogan-keys">
          <div>
            提供单证发送服务
          </div>
          <div>
            提高数据使用效率
          </div>
          <div>
            助力代订舱服务品质
          </div>
        </div>
      </div>
    </div>
    <div class="content">
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
import Footer from '@/components/footer/index.vue';
import favicon from '@/assets/favicon.ico';
// import LoginBanner from './components/banner.vue';
import LoginForm from './components/login-form.vue';
</script>

<style lang="less" scoped>
.container {
  display: flex;
  height: 100vh;

  //.banner {
  //  width: 550px;
  //  background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
  //}

  .banner {
    width: 500px;
    background-color: #002a49;
    background-image: url("../../assets/images/banner-bg.png");
    /* 让背景图基于容器大小伸缩 */
    background-size: cover;

    &-slogan{
      margin-top: 80px;
      margin-left: 80px;
      color: var(--color-fill-1);
      font-size: 16px;
      &-title{
        margin-top: 148px;
        font-size: 32px;
      }
      &-sub-title{
        margin-top: 14px;
        font-size: 24px;
      }
      &-keys{
        margin-top: 48px;
        div{
          margin-top: 16px;
          color: rgba(231, 231, 231, 0.6);
        }
        div::before{
          content: '√';
        }
      }
    }
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
