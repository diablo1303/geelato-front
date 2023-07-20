<template>
  <div class="container">
    <Breadcrumb :items="['menu.account', 'menu.account.user']"/>
    <a-card :title="$t('menu.account.user')" class="general-card">
      <!-- 头像，基本信息，更新信息(按钮)   -->
      <div>
        <a-upload :action="getUploadUrl()" :file-list="logoFile"
                  :limit="1" accept="image/*"
                  list-type="picture-card"
                  image-preview
                  @error="uploadLogoError" @success="uploadLogoSuccess" @before-remove="beforeRemoveLogo">
          <template #upload-button>
            <a-space>
              <a-button type="outline" style="border-radius: 6px;" @click="openFile">
                <template #icon>
                  <GlIconfont type="gl-upload" style="font-size: 16px;"/>
                </template>
                更新头像
              </a-button>
              <span>点击按钮完成上传</span>
            </a-space>
          </template>
        </a-upload>
      </div>
    </a-card>
  </div>
  <a-modal v-model:visible="visible" :footer="false" style="top: 20px" title="选择图标" width="80%">
    <div style="height:50%;width:50%;">

    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {getUploadUrl} from "@/api/application";

const visible = ref(false);

const openFile = () => {

}
</script>

<script lang="ts">
export default {
  name: 'userAccount',
};
</script>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}
</style>
