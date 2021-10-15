import FcCommonComponent from '../src/index';

const inputs = {
  props: {
    region: 'cn-beijing',
  },
  credentials: {
    AccountID: '123',
    AccessKeyID: 'ssss',
    AccessKeySecret: 'ssss',
  },
  appName: '',
  project: {
    access: 'default',
    component: '',
    projectName: 'test',
  },
  command: '',
  args: '',
  argsObj: '',
  path: {
    configPath: '',
  },
};
const fc = await (new FcCommonComponent()).makeFcClient(inputs);
console.log(fc);

describe('make fc client', () => {
  it('deploy a logstore', async () => {
    const fc = await (new FcCommonComponent()).makeFcClient(inputs);
    console.log(fc);
  });
});

