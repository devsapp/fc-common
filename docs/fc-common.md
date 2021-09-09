## makeFcClient



## getCredentials



## genContainerResourcesLimitConfig

根据内存大小生成容器资源限制配置

### genContainerResourcesLimitConfig(memorySize: number)

#### 参数：

- memorySize: number，MB，128-3072时需为64的整数，大于3072时只能为4096 | 8192 | 16384 | 32768

#### 返回：

- memorySize不合法时：无返回 ｜ 返回undefined

- memorySize合法时：

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

