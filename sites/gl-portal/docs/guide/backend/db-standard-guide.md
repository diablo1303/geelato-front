# 数据库约定

## 字段约定

    // 主键字段
    private String id;
    // 树结构的父字段
    private String id;
    // 创建时间
    private Date createAt;
    // 更新时间
    private Date updateAt;
    // 创建人
    private Long creator;
    // 更新人
    private Long updater;
    // 逻辑删除的标识
    private int delStatus = 0;
    // 单位Id
    private Long buId;
    // 部门Id
    private Long deptId;
