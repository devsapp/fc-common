# FC-Common fc 系列组件依赖的公共能力

## 概述

包含FC系列组件的一颗公共能力，集成在一个组件中有如下几点好处：

1. 统一维护，避免重复的开发发布工作
2. 简化fc系组件代码
3. 组件支持热更，common能力发布后能及时同步到依赖common能力的组件中

## 安装与快速上手

````
npm i && npm run start

cd example

s test <method name>

s test -h
````

## 详细文档

- [makeFcClient](./docs/fc-common.md/#makeFcClient) 获取 fc clinet
- [getCredentials](./docs/fc-common.md/#getCredentials) 获取 credentials 值
- [genContainerResourcesLimitConfig](./docs/fc-common.md/#genContainerResourcesLimitConfig) 生成容器资源限制配置

### 应用编排使用方式

查看 example下 s.yaml

