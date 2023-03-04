export interface QueryCol {
  id: string;
  title: "";
  name: "";
  colspan: number;
  // 操作
  cop: string;
  isAdvanceQuery: boolean;
  componentName: string;
  props: { placeholder: "" };
}

export interface Query {
  title: string;
  items: QueryCol[];
}

const defaultQuery: Query = {
  title: "标题",
  items: [],
};
export { defaultQuery };
