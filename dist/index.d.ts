import { ICredentials, InputProps } from './common/entity';
export default class FcCommonComponent {
    /**
     * 获取 fc client
     * @param {InputProps} inputs
     * @returns
     */
    makeFcClient(inputs: InputProps): Promise<any>;
    /**
     * 获取 credentials 值
     * @param {InputProps} inputs
     * @returns {ICredentials}
     */
    getCredentials(inputs: InputProps): Promise<{
        access: string;
        credentials: ICredentials;
    }>;
    /**
     * 生成容器资源限制配置
     * @param memorySize 内存大小
     * @returns HostConfig define by DockerEngineAPI
     */
    genContainerResourcesLimitConfig(memorySize: number): Promise<any>;
    /**
     * 检查环境是否安装python，java，nodejs等语言环境
     * @param {string} runtime
     * @returns {[result, details]}
     */
    checkLanguage(runtime: string): Promise<[boolean, string]>;
    /**
     * 检查环境是否安装docker环境
     * @param {InputProps} inputs
     * @returns {[result, details]}
     */
    checkDocker(): Promise<[boolean, string]>;
}
