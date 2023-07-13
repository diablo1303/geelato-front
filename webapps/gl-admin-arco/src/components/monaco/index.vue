<template>
  <div
      ref="codeEditBox"
      :class="heightChange&&'codeEditBox1'"
      class="codeEditBox"
  />
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted, ref, watch} from 'vue'
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

export default defineComponent({
  name: 'MonacoEditor',
  props: editorProps,
  emits: ['update:modelValue', 'change', 'editor-mounted'],
  setup(props, {emit}) {
    // eslint-disable-next-line no-restricted-globals
    (self as any).MonacoEnvironment = {
      getWorker: (_: string, label: string) => {
        // eslint-disable-next-line no-shadow,no-restricted-globals
        const getWorkerModule = (moduleUrl: string, label: string) => new Worker((self as any).MonacoEnvironment.getWorkerUrl(moduleUrl), {
          name: label,
          type: 'module',
        });
        switch (label) {
          case 'json':
            return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label);
          case 'css':
          case 'scss':
          case 'less':
            return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label);
          case 'html':
          case 'handlebars':
          case 'razor':
            return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label);
          case 'typescript':
          case 'javascript':
            return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label);
          default:
            return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label);
        }
      },
    }
    let editor: any
    const codeEditBox = ref()

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
        emit('update:modelValue', value)
        emit('change', value)
      })
      // eslint-disable-next-line vue/custom-event-name-casing
      emit('editor-mounted', editor)
    }
    watch(
      () => props.modelValue,
      (newValue) => {
        if (editor) {
          const value = editor.getValue()
          if (newValue !== value) {
            editor.setValue(newValue)
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

    onBeforeUnmount(() => {
      editor.dispose()
    })

    onMounted(() => {
      init()
    })

    return {codeEditBox}
  },
})
</script>

<style lang="less" scoped>
.codeEditBox {
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 340px;
  overflow-y: auto;
}

.codeEditBox1 {
  height: calc(100% - 360px);
}
</style>