## 前端技术栈

| 技术      | 版本   | 说明                                   |
| --------- | ------ | --------------------------------------|
| Vue       | 2.6.14 | 前端渐进式框架                         |
| Sass      | -      | CSS 扩展语言                           |
| ElementUI | 2.12.0 | Vue 2.0 组件库                         |
| Webpack   | -      | 项目打包工具                            |
| Avue      | 2.6.18 | 基于 ElementUI 二次封装 Vue 2.0 组件库  |



## 前端模块说明

```lua
cloud-ui                                -- UI工程
├── public                              -- 静态资源
├    └── cdn                            -- 伪CDN
├    └── img                            -- 图片资源
├    └── svg                            -- SVG资源
├    └── util                           -- 网上下载的工具
├    └── favicon.ico                    -- 网站图标
├    └── index.html                     -- 网站工作台，也是唯一的一张页面
├── src                                 -- 源码目录
├    └── api                            -- 和后端交互的API相关
├    ├── components                     -- 自己封装的组件
├    ├── config                         -- 工程配置
├    ├── const                          -- 常量
├    ├── docker                         -- docker部署相关
├    ├── filters                        -- 全局过滤器
├    └── mixins                         -- VUE组件混入
├    └── page                           -- 页面组件
├    └── route                          -- VUE-Router相关
├         └── page                      -- 页面路由
├         └── views                     -- 业务路由
├         └── avue-router.js            -- 自定义路由处理，包括路由拦截，动态路由等
├         └── axios.js                  -- axios增强
├         └── route.js                  -- 路由配置入口
├    └── store                          -- VUEX相关
├    └── styles                         -- 样式管理
├    └── util                           -- 工具包
├    └── views                          -- 业务代码
├    └── App.vue                        -- 根组件
├    └── error.js                       -- 自定义错误日志处理
├    └── main.js                        -- 入口js
├    └── permission.js                  -- 权限判断，导航守卫
├── .browserslistrc                     -- barbel兼容配置
├── .editorconfig                       -- 开发组统一环境配置
├── .editorconfig                       -- ESLint配置
├── .gitignore                          -- git忽略列表
├── .postcssrc.js                       -- CSS预处理配置
├── babel.config.js                     -- barbel配置入口
├── package.json                        -- 依赖管理
├── vue.config.js                       -- vue cli3的webpack配置
```


## 开发

```bash
# 克隆项目
git clone https://git.linewellcloud.com/nlinks/minielectric/safetycloud-group/safetycloud-admin-ui

# 进入项目目录
cd safetycloud-admin-ui

# 安装依赖
npm install

# 通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```


## 发布

```bash
# 构建测试环境
npm run build:test

# 构建生产环境
npm run build:prod
```