<template>
  <div
      :style="{height: height+'px'}"
      ref="codeEditBox"
      class="codeEditBox"
      :class="heightChange&&'codeEditBox1'"
  />
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
      name: 'GlMonacoEditor'
    }
)
</script>
<script lang="ts" setup>
import {defineComponent, onBeforeUnmount, onMounted, ref, watch, defineExpose} from 'vue'
import * as monaco from 'monaco-editor'
// @ts-ignore
// eslint-disable-next-line import/extensions
import {language as sqlLanguage} from 'monaco-editor/esm/vs/basic-languages/sql/sql.js';
// @ts-ignore
// eslint-disable-next-line import/extensions
import {language as yamlLanguage} from 'monaco-editor/esm/vs/basic-languages/yaml/yaml.js';
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution'
import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
import {editorProps} from './type'
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import {utils} from "@geelato/gl-ui";


const props = defineProps({
  ...editorProps
})
const emits = defineEmits(['update:modelValue', 'change', 'editor-mounted'])
// eslint-disable-next-line no-restricted-globals
// (self as any).MonacoEnvironment = {
//   getWorker: (_: string, label: string) => {
//     // eslint-disable-next-line no-shadow,no-restricted-globals
//     const getWorkerModule = (moduleUrl: string, label: string) => new Worker((self as any).MonacoEnvironment.getWorkerUrl(moduleUrl), {
//       name: label,
//       type: 'module',
//     });
//     switch (label) {
//       case 'json':
//         return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label);
//       case 'css':
//       case 'scss':
//       case 'less':
//         return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label);
//       case 'html':
//       case 'handlebars':
//       case 'razor':
//         return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label);
//       case 'typescript':
//       case 'javascript':
//         return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label);
//       default:
//         return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label);
//     }
//   },
// }
let editor: any
const codeEditBox = ref()

const formatCode = (value: string, language: string) => {
  return prettier.format(value, {
    parser: language,
    plugins: [parserBabel],
    tabWidth: 2,
  })
}

const init = () => {
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  })
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
  })
  monaco.languages.registerCompletionItemProvider('sql', {
    provideCompletionItems() {
      const suggestions: any = [];
      // 这个keywords就是sql.js文件中有的
      sqlLanguage.keywords.forEach((item: any) => {
        suggestions.push({
          label: item,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: item,
        });
      })
      sqlLanguage.operators.forEach((item: any) => {
        suggestions.push({
          label: item,
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: item,
        });
      })
      sqlLanguage.builtinFunctions.forEach((item: any) => {
        suggestions.push({
          label: item,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: item,
        });
      })
      sqlLanguage.builtinVariables.forEach((item: any) => {
        suggestions.push({
          label: item,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: item,
        });
      })
      return {
        // 最后要返回一个数组
        suggestions,
      };
    },
  })
  monaco.languages.registerCompletionItemProvider('yaml', {
    provideCompletionItems() {
      const suggestions: any = [];
      // 这个keywords就是python.js文件中有的
      yamlLanguage.keywords.forEach((item: any) => {
        suggestions.push({
          label: item,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: item,
        });
      })
      return {
        // 最后要返回一个数组
        suggestions,
      };
    },
  })

  editor = monaco.editor.create(codeEditBox.value, {
    value: props.modelValue,
    language: props.language,
    readOnly: props.readOnly,
    theme: props.theme,
    ...props.options,
  })

  // 监听值的变化
  editor.onDidChangeModelContent(() => {
    const value = editor.getValue() // 给父组件实时返回最新文本
    emits('update:modelValue', value)
    emits('change', value)
  })
  // editor.getModel().focus()
  console.log('editor.getPosition()', editor.getPosition())

  // eslint-disable-next-line vue/custom-event-name-casing
  emits('editor-mounted', editor)
  // utils.sleep(1000)
  // editor.focus()

  watch(
      () => props.modelValue,
      (newValue) => {
        if (editor) {
          const value = editor.getValue()
          if (newValue !== value) {
            editor.setValue(formatCode(newValue, props.language))

          }
        }
      },
  )

  watch(
      () => props.options,
      (newValue) => {
        editor.updateOptions(newValue)
      },
      {deep: true},
  )
  watch(
      () => props.readOnly,
      () => {
        // eslint-disable-next-line no-console
        console.log('props.readOnly', props.readOnly)
        editor.updateOptions({readOnly: props.readOnly})
      },
      {deep: true},
  )
  watch(
      () => props.theme,
      () => {
        monaco.editor.setTheme(props.theme)
      }
  )
  watch(
      () => props.language,
      (newValue) => {
        monaco.editor.setModelLanguage(editor.getModel()!, newValue)
      },
  )
}
onBeforeUnmount(() => {
  editor.dispose()
})

onMounted(() => {
  init()

})

const onInsetText = (text: string) => {
  const curSelection = editor.getSelection() // 选择的文本范围或光标的当前位置
  const {startLineNumber, startColumn, endLineNumber, endColumn} = curSelection
  // 在光标位置插入文本
  editor.executeEdits('', [
    {
      range: new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn),
      text, // 插入的文本
      forceMoveMarkers: true
    },
  ])
  // 核心 设置光标的位置
  editor.setPosition({column: startColumn + text.length - 1, lineNumber: startLineNumber})
}

/**
 *  如果当前已选中，则替换
 *  如果当前未选中，则插入
 * @param content
 */
const replaceSelectOrInsert = (text: string) => {
  editor.focus()
  console.log('editor', text, editor.getSelection(), editor.getPosition())
  const curSelection = editor.getSelection() // 获取光标的信息
  const {startLineNumber, startColumn, endLineNumber, endColumn} = curSelection
  // 在光标位置插入文本
  editor.executeEdits('', [
    {
      range: new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn),
      text, // 插入的文本
      forceMoveMarkers: true
    }
  ])

  // 先中刚添加的内容
  editor.setSelection({startLineNumber, startColumn, endLineNumber, endColumn: startColumn + text.length})

  // 插入完文本 需要聚焦下光标
  // editor.focus()
}
defineExpose({replaceSelectOrInsert})
</script>

<style lang="less" scoped>
.codeEditBox {
  resize: vertical;
  //overflow: auto;
  width: 100%;
  height: 100%;
  //flex: 1;
  overflow-y: auto;
}

.codeEditBox1 {
  //height: calc(100% - 360px);
}
</style>