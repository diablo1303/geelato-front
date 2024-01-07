import prettier from 'prettier/standalone'
import parserBabel from 'prettier/parser-babel'
import parserTypescript from 'prettier/parser-typescript'

export const format = (value: string, language: string) => {
  try {
    return prettier.format(value, {
      parser: language,
      plugins: [parserBabel, parserTypescript],
      tabWidth: 2
    })
  } catch (e: any) {
    console.warn(`格式化${language}出错。`, e?.message)
    return value
  }
}

export default function useCodePrettier() {
  return { format }
}
