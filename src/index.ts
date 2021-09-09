import logger from './common/logger';
import { ICredentials, InputProps } from './common/entity';
import * as core from '@serverless-devs/core';
import * as _ from 'lodash';
import FC from '@alicloud/fc2';
import { checkEndpoint, getEndpointFromFcDefault } from './utils/endpoint';
import { getDockerInfo } from './utils/docker';
import { bytesToSize } from './utils/utils';

const DEFAULT_TIMEOUT = 600 * 1000;

export default class FcCommonComponent {
  /**
   * 获取 fc client
   * @param {InputProps} inputs
   * @returns
   */
  public async makeFcClient(inputs: InputProps) {
    logger.debug(`input: ${JSON.stringify(inputs.props)}`);
    const region: string = inputs?.props?.region;
    const timeout: number = inputs?.props?.timeout;
    if (!region) {
      logger.error('Please provide region in your props.');
      return;
    }
    const credentials: ICredentials = (await this.getCredentials(inputs)).credentials;

    const endpointFromCredentials: string = credentials.endpoint;
    const endpointFromFcDefault: string = await getEndpointFromFcDefault();

    let endpoint: string = null;
    if (endpointFromCredentials) {
      // 优先使用 credentials 中的 endpoint
      if (!checkEndpoint(region, credentials?.AccountID, endpointFromCredentials)) {
        return;
      }
      endpoint = endpointFromCredentials;
    } else if (endpointFromFcDefault) {
      if (!checkEndpoint(region, credentials?.AccountID, endpointFromFcDefault)) {
        return;
      }
      endpoint = endpointFromFcDefault;
    }
    if (endpoint) {
      logger.info(`Using endpoint ${endpoint}`);
    }
    return new FC(credentials.AccountID, {
      accessKeyID: credentials.AccessKeyID,
      accessKeySecret: credentials.AccessKeySecret,
      securityToken: credentials.SecurityToken,
      region: region,
      timeout: timeout * 1000 || DEFAULT_TIMEOUT,
      endpointFromCredentials,
    });
  }

  /**
   * 获取 credentials 值
   * @param {InputProps} inputs
   * @returns {ICredentials}
   */
  public async getCredentials(inputs: InputProps): Promise<{ access: string; credentials: ICredentials }> {
    if (!_.isEmpty(inputs?.credentials)) {
      return {
        access: inputs?.project?.access,
        credentials: inputs.credentials,
      };
    }
    const res: any = await core.getCredentials(inputs?.project?.access);
    const credentials: ICredentials = {
      AccountID: res?.AccountID,
      AccessKeyID: res?.AccessKeyID,
      AccessKeySecret: res?.AccessKeySecret,
      endpoint: res?.endpoing,
    };
    return {
      access: res?.Alias,
      credentials,
    };
  }

  /**
   * 生成容器资源限制配置
   * @param memorySize 内存大小
   * @returns HostConfig define by DockerEngineAPI
   */
  public async genContainerResourcesLimitConfig(memorySize: number): Promise<any> {
    // memorySize = memorySize.props.memorySize; // for test

    if (memorySize < 128) {
      logger.error(`ContainerMemory is too small (min: 128, actual: '${memorySize}').`);
      return;
    } else if (memorySize < 3072 && memorySize % 64 !== 0) {
      logger.error(`ContainerMemory is set to an invalid value. The value must be a multiple of 64 MB. (actual: '${memorySize}').`);
      return;
    } else if (memorySize > 3072 && ![4096, 8192, 16384, 32768].includes(memorySize)) {
      logger.error(`Memory is set to an invalid value (allowed: 4096 | 8192 | 16384 | 32768, actual: '${memorySize}').`);
      return;
    }

    const dockerInfo = getDockerInfo();
    const { NCPU, MemTotal } = dockerInfo;
    const isWin: boolean = process.platform === 'win32';
    const memoryCoreRatio: number = memorySize > 3072 ? 1 / 2048 : 2 / 3072; // 内存核心比，弹性实例2C/3G，性能实例1C/2G

    const cpuPeriod: number = 6400;
    let cpuQuota: number = Math.ceil(cpuPeriod * memoryCoreRatio * memorySize);
    cpuQuota = Math.min(cpuQuota, cpuPeriod * NCPU); // 最高不超过限制
    cpuQuota = Math.max(cpuQuota, cpuPeriod); // 按照内存分配cpu配额时, 最低为100%，即1Core

    let memory = memorySize * 1024 * 1024; //bytes
    if (memory > MemTotal) {
      memory = MemTotal;
      logger.warning(`The memory config exceeds the docker limit. The memory actually allocated: ${bytesToSize(memory)}.
Now the limit of RAM resource is ${MemTotal} bytes. To improve the limit, please refer: https://docs.docker.com/desktop/${
        isWin ? 'windows' : 'mac'
      }/#resources.`);
    }

    const ulimits: any = [
      { Name: 'nofile', Soft: 1024, Hard: 1024 },
      { Name: 'nproc', Soft: 1024, Hard: 1024 },
    ];

    return {
      CpuPeriod: cpuPeriod,
      CpuQuota: cpuQuota,
      Memory: memory,
      Ulimits: ulimits,
    };
  }
}
