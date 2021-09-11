## makeFcClient

获取 fc client

### makeFcClient(inputs: InputProps)

#### 参数：

```typescript
inputs: InputProps {
  props: any {
    region: string,
    timeout: number,
    credentials: ICredentials
  }
}
```

#### 返回：

- 获取endpoint失败时：无返回 ｜ 返回undefined

- 成功返回FC：

  ```tsx
  new FC(credentials.AccountID, {
    accessKeyID: credentials.AccessKeyID,
    accessKeySecret: credentials.AccessKeySecret,
    securityToken: credentials.SecurityToken,
    region: region,
    timeout: timeout * 1000 || DEFAULT_TIMEOUT,
    endpointFromCredentials,
  })
  ```

#### 示例：

```bash
# bash with s.yaml
$ s test makeFcClient
[2021-09-10T10:07:17.497] [INFO ] [S-CLI] - Start ...
test:
  accountid: '1921******57'
  accessKeyID: LT*****0eMkg
  accessKeySecret: 5rt**********UkJV
  endpoint: http://1921*******57.cn-shenzhen.fc.aliyuncs.com
  host: 1921******57.cn-shenzhen.fc.aliyuncs.com
  version: '2016-08-15'
  timeout: 600000
  headers: {}
```



## getCredentials

获取 credentials 值

### getCredentials(inputs: InputProps)

#### 参数：

```typescript
inputs: InputProps {
  props: any {
    credentials: ICredentials
  }
}
```

#### 返回：

```tsx
{
  access: res?.Alias,
  credentials,
}
```

#### 示例：

```bash
# bash with s.yaml
$ s test getCredentials
[2021-09-10T10:10:26.805] [INFO ] [S-CLI] - Start ...
test:
  access: default
  credentials:
    Alias: default
    AccountID: '1921******57'
    AccessKeyID: LTA********kg
    AccessKeySecret: 5rt***********kJV
```



## genContainerResourcesLimitConfig

根据内存大小生成容器资源限制配置

### genContainerResourcesLimitConfig(memorySize: number)

#### 参数：

- memorySize: number，MB，128-3072时需为64的整数，大于3072时只能为4096 | 8192 | 16384 | 32768

#### 返回：

- memorySize不合法时：无返回 ｜ 返回undefined

- 成功返回HostConfig：

  ```tsx
  {
    CpuPeriod,
    CpuQuota,
    Memory,
    Ulimits,
  }
  ```

#### 示例：

```bash
# bash with s.yaml
$ s test genContainerResourcesLimitConfig
[2021-09-06T08:06:15.837] [INFO ] [S-CLI] - Start ...
test:
  CpuPeriod: 6400
  CpuQuota: 6400
  Memory: 134217728
  Ulimits:
    - Name: nofile
      Soft: 1024
      Hard: 1024
    - Name: nproc
      Soft: 1024
      Hard: 1024
```

