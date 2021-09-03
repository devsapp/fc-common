import logger from './common/logger';
import {ICredentials, InputProps} from './common/entity';
import * as core from '@serverless-devs/core';
import * as _ from 'lodash';
import FC from '@alicloud/fc2';
import {checkEndpoint, getEndpointFromFcDefault} from "./utils/endpoint";

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
  public async getCredentials(inputs: InputProps): Promise<{access: string, credentials: ICredentials}> {
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
      credentials
    }
  }
}
