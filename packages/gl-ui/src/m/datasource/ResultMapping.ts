export default class ResultMapping {
  fieldMappings: FieldMapping[] = []

  isEmpty() {
    return this.fieldMappings.length === 0
  }

  findFieldMapping(fieldName: string) {
    return this.fieldMappings.find((filedMapping: FieldMapping) => {
      return filedMapping.name === fieldName
    })
  }
}

export class FieldMapping {
  name: string = ''
  value?: string
  valueExpression?: string

  constructor(name?: string, value?: string, valueExpression?: string) {
    this.name = name || ''
    this.value = value
    this.valueExpression = valueExpression
  }
}
