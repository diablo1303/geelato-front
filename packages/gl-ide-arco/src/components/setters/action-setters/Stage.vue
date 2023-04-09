<template>
  <div class="gl-ide-plugin-form-designer-sidebar" :style="tabPanelStyle">
    <table class="gl-table">
      <tr class="gl-table-row gl-table-row-header">
        <th class="gl-table-cell" style="width: 40%">规则</th>
        <th class="gl-table-cell">详细配置</th>
        <th class="gl-table-cell" style="width: 6em">仅提醒</th>
        <th class="gl-table-cell" style="width: 4em">操作</th>
      </tr>
      <template v-for="(rule,ruleIndex) in currentRules">
        <tr class="gl-table-row" :key="ruleIndex">
          <td class="gl-table-cell">
            <a-select v-model="rule.name" style="width: 100%">
              <a-select-option :value="ruleTemplate.name" v-for="(ruleTemplate,ruleTemplateIndex) in templateRules"
                               :key="ruleTemplateIndex">{{ruleTemplate.title}}
              </a-select-option>
            </a-select>
          </td>
          <td class="gl-table-cell rule-detail" style="padding: 0 0.5em">
            <div v-if="rule.name==='between'">
              <span>最大值</span>
              <a-input v-model="rule.opts.max" style="width: 4em"/>
              <span>最小值</span>
              <a-input v-model="rule.opts.min" style="width: 4em"/>
            </div>
            <div v-else-if="rule.name==='max'">
              <span>最大值</span>
              <a-input v-model="rule.opts.max" style="width: 4em"/>
            </div>
            <div v-else-if="rule.name==='min'">
              <span>最小值</span>
              <a-input v-model="rule.opts.min" style="width: 4em"/>
            </div>
            <div v-else-if="rule.name==='max_value'">
              <span>最大值</span>
              <a-input v-model="rule.opts.max_value" style="width: 4em"/>
            </div>
            <div v-else-if="rule.name==='min_value'">
              <span>最小值</span>
              <a-input v-model="rule.opts.min_value" style="width: 4em"/>
            </div>
            <div v-else-if="rule.name==='regex'">
              <span>正则表达式</span>
              <a-input v-model="rule.opts.regex" style="width: 80%"/>
            </div>
            <div v-else-if="rule.name==='confirmed'">
              <span>等值字段</span>
              <a-input v-model="rule.opts.confirmed" style="width: 80%"/>
            </div>
            <div v-else>
              无
            </div>
          </td>
          <td class="gl-table-cell">
            <a-switch></a-switch>
          </td>
          <td class="gl-table-cell" style="text-align: center">
            <a-button class="gl-mini-btn"
                      @click="$gl.utils.remove(currentRules,ruleIndex)">
              <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
            </a-button>
          </td>
        </tr>
      </template>
      <tr class="gl-table-row">
        <td colspan="4">
          <a-button size="small" block
                    @click="currentRules.push({name: '', title: '', description: '',opts:{}})"
                    style="line-height: 1.499em">
            <a-icon type="plus" size="small"/>
            添加规则
          </a-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import mixin from '../../../../mixin-designer'

  export default {
    name: "GlIdePluginFormDesignerLogicAndRuleStage",
    mixins: [mixin],
    props: {
      opts: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        currentRules: [],
        templateRules: [
          {name: 'required', title: '验证字段是否必需', description: '', opts: {}},
          {name: 'email', title: '验证有效的电子邮件', description: '', opts: {}},
          {name: 'length', title: '验证字段是否有指定的有效长度', description: '', opts: {}},
          {name: 'max', title: '验证字段最大的有效长度', description: '', opts: {}},
          {name: 'min', title: '验证字段最小的有效长度', description: '', opts: {}},
          {name: 'max_value', title: '验证字段允许的最大值,不可超过最大值', description: '', opts: {}},
          {name: 'min_value', title: '验证字段允许的最小值,不可超过最小值', description: '', opts: {}},
          {name: 'numeric', title: '验证字段仅包含数字', description: '', opts: {}},
          {name: 'confirmed', title: '验证字段等于指定字段', description: '', opts: {}},
          {name: 'ip', title: '验证字段必须具有有效ip值的字符串', description: '', opts: {}},
          {name: 'credit_card', title: '验证字段必须是有效的信用卡', description: '', opts: {}},
          {name: 'alpha', title: '验证字段可能只包含字母字符', description: '', opts: {}},
          {name: 'alpha_dash', title: '验证字段可能包含字母字符，数字，短划线或下划线', description: '', opts: {}},
          {name: 'alpha_num', title: '验证字段可能只包含字母字符或数字', description: '', opts: {}},
          {name: 'alpha_spaces', title: '验证字段可能包含字母字符或空格', description: '', opts: {}},
          {
            name: 'between',
            title: '验证字段必须具有值范围',
            description: '',
            opts: {}
          },
          {name: 'date_format', title: '验证字段必须是指定格式的有效日期', description: '', opts: {}},
          {name: 'date_between', title: '验证字段必须是两个日期之间的有效日期', description: '', opts: {}},
          {name: 'regex', title: '验证字段与指定的正则表达式匹配', description: '', opts: {}},
          // {name: 'alpha', title: '验证字段可能只包含字母字符', description: '', opts:{}},
          // {name: 'alpha', title: '验证字段可能只包含字母字符', description: '', opts:{}},
          // {name: 'alpha', title: '验证字段可能只包含字母字符', description: '', opts:{}},
          // {name: 'alpha', title: '验证字段可能只包含字母字符', description: '', opts:{}},
          // {name: 'alpha', title: '验证字段可能只包含字母字符', description: '', opts:{}},
          // {name: 'alpha', title: '验证字段可能只包含字母字符', description: '', opts:{}},
          // {name: 'alpha', title: '验证字段可能只包含字母字符', description: '', opts:{}},
          // {name: 'alpha', title: '验证字段可能只包含字母字符', description: '', opts:{}},
          // {name: 'alpha', title: '验证字段可能只包含字母字符', description: '', opts:{}},
          // {name: 'alpha', title: '验证字段可能只包含字母字符', description: '', opts:{}},
          // {name: 'alpha', title: '验证字段可能只包含字母字符', description: '', opts:{}},
          // {name: 'alpha', title: '验证字段可能只包含字母字符', description: '', opts:{}},
        ]
      }
    },
    mounted() {
    },
    methods: {
      getTemplateRule(name) {
        return this.templateRules.find((item) => {
          return item.name === name
        })
      },
      getRuleCount(property) {
        return property.rules && property.rules.keys.length || 0
      }
    }
  }
</script>

<style scoped>
  .item {
    margin: 0.125em 0.125em;
    padding: 0.125em 0.25em;
    float: left;
    width: 48%;
    cursor: pointer;
    background: #f4f6fc;
    border: 1px solid #f4f6fc;
    color: rgba(0, 0, 0, 1);
    border-radius: 0;
    line-height: 1.75em;
  }

  .gl-table-cell.rule-detail > div {
    margin-top: 2px;
  }

  .gl-table-cell.rule-detail > div input {
    margin-left: 0.5em;
  }
</style>
