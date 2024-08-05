:: 构建所有项目
echo on

:: /c 关闭窗口 /k 保留窗口
echo build packages
start cmd /k "cd ../packages/gl-ui & pnpm build"
start cmd /k "cd ../packages/gl-ui-arco & pnpm build"
:: start cmd /k "cd ../packages/gl-ui-arco-admin & pnpm build"
start cmd /k "cd ../packages/gl-ui-schema & pnpm build"
start cmd /k "cd ../packages/gl-ui-schema-arco & pnpm build"
start cmd /k "cd ../packages/gl-ide & pnpm build"
start cmd /k "cd ../packages/gl-ide-arco & pnpm build"

start cmd /k "cd ../webapps/gl-admin-arco & pnpm build-prod"
start cmd /k "cd ../webapps/gl-admin-webapps-arco & pnpm build-prod"



:: start cmd /k "cd ../webapps/gl-admin-arco-dt-std & pnpm build-prod"
:: start cmd /k "cd ../webapps/gl-admin-arco-rt-std & pnpm build-prod"