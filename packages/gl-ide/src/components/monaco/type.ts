import type {PropType} from 'vue'

export type Theme = 'vs' | 'hc-black' | 'vs-dark'
export type FoldingStrategy = 'auto' | 'indentation'
export type RenderLineHighlight = 'all' | 'line' | 'none' | 'gutter'

export interface Options {
  automaticLayout: boolean // 自适应布局
  foldingStrategy: FoldingStrategy // 折叠方式  auto | indentation
  renderLineHighlight: RenderLineHighlight // 行亮
  selectOnLineNumbers: boolean // 显示行号
  placeholder: string
  minimap: {
    // 关闭小地图
    enabled: boolean
  }
  // readOnly: Boolean // 只读
  fontSize: number // 字体大小
  scrollBeyondLastLine: boolean // 取消代码后面一大段空白
  overviewRulerBorder: boolean // 不要滚动条的边框
  scrollbar: {
    verticalScrollbarSize: number // 垂直滚动条宽度，默认px
    horizontalScrollbarSize: number // 水平滚动条高度
  },
  contextmenu: boolean // 禁用右键菜单
  acceptSuggestionOnCommitCharacter: boolean
}

export const editorProps = {
  modelValue: {
    type: String as PropType<string>,
    default: null,
  },
  heightChange: {
    type: Boolean,
    default: false,
  },
  formatter: {
    type: String,
    default: 0,
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: '100%',
  },
  height: {
    type: [String, Number] as PropType<string | number>,
    default: '100%',
  },
  language: {
    type: String as PropType<string>,
    default: 'javascript',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String as PropType<string>,
    validator(value: string): boolean {
      return ['vs', 'hc-black', 'vs-dark', 'hc-light'].includes(value)
    },
    default: 'vs',
  },
  options: {
    type: Object as PropType<Options>,
    default() {
      return {
        autoIndex: true,
        automaticLayout: true,
        foldingStrategy: 'indentation', // 折叠方式  auto | indentation
        renderLineHighlight: 'all' || 'line' || 'none' || 'gutter', // 行亮
        selectOnLineNumbers: true, // 显示行号
        minimap: {enabled: false},// 关闭小地图
        placeholder: '',
        fontSize: 14, // 字体大小
        scrollBeyondLastLine: true, // 取消代码后面一大段空白
        overviewRulerBorder: false, // 不要滚动条的边框
        scrollbar: {
          verticalScrollbarSize: 8, // 垂直滚动条宽度，默认px
          horizontalScrollbarSize: 8 // 水平滚动条高度
        },
        contextmenu: false, // 禁用右键菜单
        acceptSuggestionOnCommitCharacter: true,
        wordWrap: 'on',
        wordWrapColumn: 120,
        wrappingIndent: 'indent',
      }
    },
  },
}
