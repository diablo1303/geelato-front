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
    // 组织Id
    private Long deptId;


## 新建或更新表，不删除表字段
!!! 危险，只用于开发环境
依据当前实体最新的元数据进行数据库表重建
`https://localhost:8080/api/meta/ddl/recreate/{entityName}`
