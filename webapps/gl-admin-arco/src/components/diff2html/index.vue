<script lang="ts">
export default {
  name: 'Diff2Html'
}
</script>
<script lang="ts" setup>
import {watch, ref} from "vue";
import {createPatch} from "diff";
import {html, parse} from "diff2html";
import {Diff2HtmlUI} from "diff2html/lib/ui/js/diff2html-ui";
import "highlight.js/styles/googlecode.css";
import "diff2html/bundles/css/diff2html.min.css";
import {generateRandom} from "@/utils/strings";

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  title: {type: String, default: ''},
  newValue: {type: Object, default: null},
  newHeader: {type: String, default: ''},
  oldValue: {type: Object, default: null},
  oldHeader: {type: String, default: ''},
});

const generateFormData = () => {
  return {
    id: props.modelValue || generateRandom(),
    title: props.title || '',
    newString: props.newValue ? JSON.stringify(props.newValue, null, 2) : '',
    newHeader: props.newHeader || 'LEFT',
    oldString: props.oldValue ? JSON.stringify(props.oldValue, null, 2) : '',
    oldHeader: props.oldHeader || 'RIGHT',
  };
}

const mv = ref(generateFormData());

const createDiffData = () => {
  const diffJsonList = [];
  // 对比差异
  const diffStr = createPatch(mv.value.title, mv.value.oldString, mv.value.newString, mv.value.oldHeader, mv.value.newHeader, {context: 99999});
  // 差异json化
  const diffJson = parse(diffStr);
  diffJsonList.push(diffJson[0]);
  // 使用diff2html-ui
  const targetElement = document.getElementById(mv.value.id);
  if (targetElement) {
    const diff2htmlUi = new Diff2HtmlUI(targetElement, diffJsonList, {
      drawFileList: true,
      matching: "lines",
      highlight: true,
      outputFormat: 'side-by-side',// line-by-line
      fileListToggle: false,
      fileListStartVisible: false,
      fileContentToggle: false,
      synchronisedScroll: true,
      renderNothingWhenEmpty: false,
    });
    diff2htmlUi.draw();		// 绘制页面
    diff2htmlUi.highlightCode();	// 高亮数据
    diff2htmlUi.fileListToggle(false);	// 是否折叠概要
  }
}

/**
 * 元组件参数变更，初始化
 */
watch(() => props, () => {
  mv.value = generateFormData();
  createDiffData();
}, {deep: true, immediate: true});

</script>
<template>
  <div :id="mv.id"/>
</template>
<style lang="less" scoped>

</style>