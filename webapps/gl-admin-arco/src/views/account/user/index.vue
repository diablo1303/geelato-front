<template>
  <div class="container">
    <Breadcrumb :items="['menu.account', 'menu.account.user']"/>
    <a-card :title="$t('menu.account.user')" class="general-card">
      <!-- 头像，基本信息，更新信息(按钮)   -->
      <div style="width: 500px;">
        <a-list class="account-user-list">
          <a-list-item class="account-user-list-item">
            <a-list-item-meta class="account-user-list-item-meta">
              <template #avatar>
                <span class="account-user-avatar">
                  <img :src="avatarData" alt="avatar"/>
                </span>
              </template>
              <template #title>
                <a-button size="small" style="border-radius: 6px;" type="outline" @click="updateAvatarClick($event)">
                  <template #icon>
                    <GlIconfont type="gl-upload"/>
                  </template>
                  {{ $t('account.user.avatar.button') }}
                </a-button>
              </template>
              <template #description>
                <a-space style="margin-top: 10px;">{{ $t('account.user.avatar.button.description') }}</a-space>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
      <div style="width: 500px;">
        <a-form
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            class="account-user-form"
            layout="vertical"
            size="large">
          <a-form-item
              :label="$t('account.user.form.description')"
              field="description">
            <a-textarea v-model="formData.description"
                        :auto-size="{minRows:5,maxRows:5}"
                        :max-length="512"
                        show-word-limit/>
          </a-form-item>
          <a-form-item
              :label="$t('account.user.form.address')"
              field="address">
            <a-textarea v-model="formData.address"
                        :auto-size="{minRows:1,maxRows:5}"
                        :max-length="512"
                        show-word-limit/>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button :loading="buttonLoading" status="success" type="primary"
                        @click="updateUserInfoClick($event)">
                {{ $t('account.user.form.button.update') }}
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
    </a-card>
  </div>
  <VueCropping v-model="vueCropperVisible" :img-src="vueCropperImg" @completeEvent="vueCropperCompleteEvent"/>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";
import {Notification} from "@arco-design/web-vue";
import {useUserStore} from "@/store";
import VueCropping from "@/components/vue-cropper/index.vue";
import {uploadFile} from "@/components/vue-cropper/type";
import {getDownloadUrlById} from "@/api/application";
import defaultAvatar from '@/assets/images/default-avatar.png';
import {AccountUserInfo, updateUserInfo} from "@/api/user";

const {t} = useI18n();
const userStore = useUserStore();
const vueCropperVisible = ref(false);
const vueCropperImg = ref<string>("");
const buttonLoading = ref(false);
// 头像
const avatarData = computed(() => {
  const data = userStore.userInfo.avatar;
  return data ? getDownloadUrlById(data) : defaultAvatar;
});
// 账户信息
const formData = computed<AccountUserInfo>(() => {
  const data = userStore.userInfo;
  return {description: data.description, address: data.address} as unknown as AccountUserInfo;
});

const updateAvatarClick = (ev?: MouseEvent) => {
  uploadFile((file: File, url: string) => {
    vueCropperImg.value = url;
    vueCropperVisible.value = true;
  });
}

const vueCropperCompleteEvent = () => {
  userStore.info();
}

const updateUserInfoClick = async (ev?: MouseEvent) => {
  buttonLoading.value = true;
  try {
    await updateUserInfo(userStore.userInfo.id as string, formData.value);
    userStore.info();
    Notification.success(t('account.user.form.msg.success'));
  } catch (err) {
    console.log(err);
  } finally {
    buttonLoading.value = false;
  }
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

.account-user {
  &-list > :first-child > :first-child > :first-child {
    border: none;
  }

  &-avatar {
    text-align: center;
    width: 81px;
    height: 81px;
  }

  &-avatar > img {
    width: 81px;
    height: 81px;
  }
}
</style>
