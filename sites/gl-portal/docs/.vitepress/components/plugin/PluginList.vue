<script lang="ts">
export default {
  name: "PluginList",
};
</script>
<script lang="ts" setup>
import { ref } from "vue";

const records = ref([]);
records.value = [
  {
    code: "api-engine",
    name: "接口引擎",
    price: "￥6,400",
    pic: "../../../public/images/plugin/api.jpg",
    enabled: true,
    description: "快速搭建内、外部应用接口，提供数据服务",
  },
  {
    code: "sql-engine",
    name: "SQL引擎",
    price: "￥6,400",
    pic: "../../../public/images/plugin/sql.jpg",
    description: "提供自定义Sql功能，支持动态参数",
    enabled: true,
  },
  {
    name: "企微插件",
    price: "￥6,400",
    pic: "../../../public/images/plugin/ew.jpg",
    description: "支持企微单点登录，组织人员数据同步",
    enabled: true,
  },
  {
    name: "钉钉插件",
    price: "￥6,400",
    pic: "../../../public/images/plugin/dingding.png",
    description: "支持钉钉单点登录，组织人员数据同步",
    enabled: true,
  },
  {
    name: "移动端插件",
    price: "￥13,800",
    pic: "../../../public/images/plugin/mobilephone.jpg",
    description: "支持移动端开发，发布H5应用",
    enabled: true,
  },
  {
    name: "短信插件（阿里云）",
    price: "￥2000",
    pic: "../../../public/images/plugin/sms.jpg",
    description: "支持通过阿里云短信服务，发送短信",
    enabled: true,
  },
  {
    name: "高级组件包插件",
    price: "￥9600",
    pic: "../../../public/images/plugin/ui.jpg",
    description: "使用树组件、时间轴组件等高级组件",
    enabled: true,
  },
  {
    name: "字段加密插件",
    price: "￥2000",
    pic: "../../../public/images/plugin/encryption.jpg",
    description: "支持配置模型指定字段加密存储",
    enabled: true,
  },
  {
    name: "存储插件",
    price: "￥4800",
    pic: "../../../public/images/plugin/store.jpg",
    description: "扩展第三方的存储接口",
    enabled: true,
  },
  {
    name: "数据库适配",
    price: "立即咨询",
    pic: "../../../public/images/plugin/db.jpg",
    description: "除Mysql外的一种数据库适配",
    enabled: true,
  },
  {
    name: "国产化适配",
    price: "立即咨询",
    pic: "../../../public/images/plugin/xc.jpg",
    description: "数据库、服务器、中间件、浏览器等",
    enabled: true,
  },
];
</script>

<template>
  <div>
    <a-space wrap size="large" style="width: 1280px">
      <a-card :style="{ width: '320px' }" v-for="record in records">
        <template #actions>
          <span style="font-size: 1em"> By Geelato </span>
        </template>
        <template #cover>
          <div
            :style="{
              height: '148px',
              overflow: 'hidden',
            }"
          >
            <img
              :style="{ width: '100%', transform: 'translateY(-20px)' }"
              alt="dessert"
              :src="record.pic"
            />
          </div>
        </template>
        <a-card-meta :title="record.name" :description="record.description">
          <template #avatar>
            <div
              :style="{
                display: 'flex',
                alignItems: 'center',
                color: '#1D2129',
              }"
            >
              <a-avatar
                :size="14"
                :style="{
                  marginRight: '8px',
                  backgroundColor: record.enabled ? '#0467c2' : '',
                }"
              >
              </a-avatar>
              <a-typography-text style="color: #0467c2">{{
                record.price
              }}</a-typography-text>
            </div>
          </template>
        </a-card-meta>
      </a-card>
    </a-space>
  </div>
</template>
