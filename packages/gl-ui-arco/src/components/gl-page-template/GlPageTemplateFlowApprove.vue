<script lang="ts">
export default {
  name: 'GlPageTemplateFlowApprove'
}
</script>
<script lang="ts" setup>
import { nextTick, type Ref, ref, watch } from 'vue'
import type { ItemType } from './ItemsManager'
import useItemsManager from './ItemsManager'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const cardHeight = ref(400)
const cardBaseStyle = ref({ height: cardHeight.value + 'px' })
const collapseMaxHeight = ref(300)
const splitHeight = ref(370)

// 可选择的人员
const selectableUsers: Ref<ItemType[]> = ref([])
selectableUsers.value.push(
  ...[
    { name: '张三1', id: '1' },
    { name: '李四2', id: '2' },
    { name: '李四3', id: '3' },
    { name: '李四4', id: '4' },
    { name: '李四5', id: '5' },
    { name: '李四6', id: '6' }
  ]
)
// 主送人员
const refreshFlagMaster = ref(true)
const selectedMasterUserManager = useItemsManager({
  change: () => {
    refreshFlagMaster.value = false
    nextTick(() => {
      refreshFlagMaster.value = true
    })
  }
})
selectedMasterUserManager.init([
  { name: '张三1', id: '123' },
  { name: '张三2', id: '123' },
  {
    name: '张三3',
    id: '123'
  },
  { name: '张三4', id: '123' },
  { name: '张三5', id: '123' },
  { name: '张三6', id: '123' },
  { name: '张三7', id: '123' }
])
// 传阅人员
const refreshFlagPassToRead = ref(true)
const selectedPassToReadUserManager = useItemsManager({
  change: () => {
    refreshFlagPassToRead.value = false
    nextTick(() => {
      refreshFlagPassToRead.value = true
    })
  }
})
selectedPassToReadUserManager.init([
  { name: '李四1', id: '123' },
  { name: '李四2', id: '123' },
  {
    name: '李四3',
    id: '123'
  },
  { name: '李四4', id: '123' },
  { name: '李四5', id: '123' },
  { name: '李四6', id: '123' },
  { name: '李四7', id: '123' }
])

/**
 *  从选区中将人员信息添加到当前打开的主送人员或传阅人员面板中
 *  若已存在同一id的人员则不添加
 */
const selectUserTo = (user: ItemType) => {
  if (isMasterUserActive()) {
    selectedMasterUserManager.tryPush(user)
  } else {
    selectedPassToReadUserManager.tryPush(user)
  }
}

/**
 * 将可选列表中的用户全添加到主送人员或传阅人员面板中
 */
const selectAllUserTo = () => {
  if (isMasterUserActive()) {
    selectedMasterUserManager.tryPushBatch(selectableUsers.value)
  } else {
    selectedPassToReadUserManager.tryPushBatch(selectableUsers.value)
  }
}

// 打开的面板，开关切换模式; 1为主送，2为传阅
const accordionActiveKey: Ref<(string | number)[]> = ref(['1'])
const isMasterUserActive = () => {
  return accordionActiveKey.value[0] === '1'
}
/**
 * 点击同一个面板时，e为空数组，切换时才有值
 * @param e
 */
const changeAccordionActiveKey = (activeKey: (string | number)[], ev: Event) => {
  console.log('changeAccordionActiveKey',activeKey,accordionActiveKey.value[0],activeKey[0])
  if (activeKey.length > 0) {
    accordionActiveKey.value[0] = activeKey[0]
  } else {
    accordionActiveKey.value[0] = isMasterUserActive() ? '2' : '1'
  }
}

// 审批意见
const opinion = ref('')
// 常用词
const commonWords = ['阅', '拟同意', '同意']
const selectWord = (word: string) => {
  const endFlag = '。'
  const found = commonWords.find((commonWord: string) => {
    return commonWord + endFlag === opinion.value.trim()
  })
  opinion.value = found ? word + endFlag : word + endFlag + opinion.value
}
</script>

<template>
  <div class="gl-page-template-flow-approve" style="width: 800px">
    <div class="gl-flow-approve">
      <div class="gl-title">
        <span>
          <GlIconfont type="gl-form" text="处理意见"></GlIconfont>
        </span>
        <a-space style="float: right">
          <span style="font-weight: 500">常用词</span>
          <a-tag v-for="word in commonWords" @click="selectWord(word)">{{ word }}</a-tag>
        </a-space>
      </div>
      <a-textarea v-model="opinion" placeholder="请输入详细意见"></a-textarea>
    </div>
    <div class="gl-flow-tasks">
      <div class="gl-title">
        <GlIconfont type="gl-flow" text="下一环节"></GlIconfont>
        <span style="font-weight: 500; float: right; cursor: pointer">
          <gl-iconfont type="gl-eye" text="查看流程图"></gl-iconfont>
        </span>
      </div>
      <div style="padding: 5px 0 15px 0">
        <a-radio-group type="button" size="mini">
          <a-radio value="1">
            <GlIconfont type="gl-user"></GlIconfont>
            主管审批
          </a-radio>
          <a-radio value="2">
            <GlIconfont type="gl-user"></GlIconfont>
            部门经理审批
          </a-radio>
          <a-radio value="3">
            <GlIconfont type="gl-setting"></GlIconfont>
            流程结束
          </a-radio>
        </a-radio-group>
      </div>
    </div>
    <div class="gl-flow-users">
      <div class="gl-title">
        <GlIconfont type="gl-team" text="发送对象"></GlIconfont>
      </div>
      <div style="display: flex">
        <a-card size="small" :style="cardBaseStyle" title="可选人员" style="width: 500px">
          <a-split :style="{ height: splitHeight + 'px' }" size="340px">
            <template #first>
              <div>这是一棵组织树</div>
            </template>
            <template #second>
              <a-input placeholder="查询人员列表" size="mini"></a-input>
              <a-list size="small" style="min-height: 322px; max-height: 322px; overflow-y: auto">
                <a-list-item
                  title="点击添加"
                  v-for="selectableUser in selectableUsers"
                  @click="selectUserTo(selectableUser)"
                >
                  <gl-iconfont type="gl-user" :text="selectableUser.name"></gl-iconfont>
                  <span style="float: right"> =&gt </span>
                </a-list-item>
              </a-list>
              <a-button size="mini" long @click="selectAllUserTo">一键添加 =&gt</a-button>
            </template>
          </a-split>
        </a-card>
        <div style="flex: 1; margin-left: 1em">
          <!-- TODO 主送范围应可以是人员、或者是组织-->
          <a-collapse
            :accordion="true"
            :active-key="accordionActiveKey"
            @change="changeAccordionActiveKey"
          >
            <a-collapse-item header="主送人员" key="1">
              <template #extra>
                <a-tag size="small" color="arcoblue" v-if="refreshFlagMaster"
                  >{{ selectedMasterUserManager.getItems().length }}
                </a-tag>
              </template>
              <div
                :style="{
                  'max-height': collapseMaxHeight + 'px',
                  'min-height': collapseMaxHeight + 'px'
                }"
                style="overflow-y: auto"
              >
                <a-tag
                  v-if="refreshFlagMaster"
                  color="blue"
                  closable
                  v-for="(selectedItem, selectedIndex) in selectedMasterUserManager.getItems()"
                  @close="selectedMasterUserManager.remove(selectedIndex)"
                  >{{ selectedItem.name }}
                </a-tag>
              </div>
              <div style="text-align: right">
                <a-button size="mini" type="text" @click="selectedMasterUserManager.removeAll"
                  >清空已选
                </a-button>
              </div>
            </a-collapse-item>
            <a-collapse-item header="传阅人员" key="2">
              <template #extra>
                <a-tag size="small" color="arcoblue" v-if="refreshFlagPassToRead"
                  >{{ selectedPassToReadUserManager.getItems().length }}
                </a-tag>
              </template>
              <div
                :style="{
                  'max-height': collapseMaxHeight + 'px',
                  'min-height': collapseMaxHeight + 'px'
                }"
                style="overflow-y: auto"
              >
                <a-tag
                  v-if="refreshFlagPassToRead"
                  color="blue"
                  closable
                  v-for="(selectedItem, selectedIndex) in selectedPassToReadUserManager.getItems()"
                  @close="selectedPassToReadUserManager.remove(selectedIndex)"
                  >{{ selectedItem.name }}
                </a-tag>
              </div>
              <div style="text-align: right">
                <!-- TODO 从我的常用联系人中添加传阅人员-->
                <a-button size="mini" type="text">我的常用联系人</a-button>
                <a-button size="mini" type="text" @click="selectedPassToReadUserManager.removeAll"
                  >清空已选
                </a-button>
              </div>
            </a-collapse-item>
          </a-collapse>
        </div>
        <!--        </a-card>-->
      </div>
    </div>
  </div>
</template>

<style>
.gl-page-template-flow-approve {
  .gl-title {
    height: 2.4em;
    font-weight: bold;

    .arco-tag {
      cursor: pointer;
    }
  }

  .gl-title:not(first) {
    margin-top: 8px;
  }

  .gl-flow-tasks {
    svg:hover {
      border: 0;
    }

    .arco-radio-button-content > span:hover {
      border: 0;
    }
  }

  .gl-flow-users {
    .arco-tag {
      margin-right: 4px;
      margin-bottom: 3px;
    }

    .arco-card-body {
      padding: 0;
    }

    .arco-card-header {
      height: 30px;

      .arco-card-header-title {
        font-size: 13px !important;
        font-weight: 500 !important;
      }
    }

    .arco-collapse-item-header {
      padding-top: 2px;
      padding-bottom: 2px;
    }

    .arco-collapse-item-header-title {
      font-size: 13px;
    }

    .arco-collapse-item-header-extra {
      font-size: 13px;
    }

    .arco-collapse-item-content {
      background-color: white;
      padding-left: 8px;
      padding-right: 8px;
    }

    .arco-list-item {
      font-size: 12px !important;
      padding: 2px 8px !important;
      border: 0px;
      cursor: pointer;
    }
  }
}
</style>
