import type Entry from "./Entry";
import type { LooseObject } from "../mix/LooseObject";

export default class ResultMapping {
  items: Array<Entry> = [];

  mapping: LooseObject = {};

  // key为组件内用到的字段名，右边为实体查询结果返回的字段
  // 当右边的字段不在fieldNames的范围内时，则该值为静态值，如以下的avatarUrl
  add(entry: Entry): void {
    if (
      Object.keys(this.mapping).find((key) => {
        return key === entry.key;
      })
    ) {
      console.error("已存在key:", entry.key, "添加实体失败：", entry);
    } else {
      this.items.push(entry);
      this.mapping[entry.key] = entry.value;
    }
  }

  getMapping(): LooseObject {
    return this.mapping;
  }
}
