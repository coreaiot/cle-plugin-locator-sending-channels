import { checkSum1B } from './checkSum1B';
import { IBinaryCommand, IGatewayResult, Utils } from '@lib';

const cmdSetLocatorSendingChannel: IBinaryCommand = {
  cmd: 0x23,
  result: b => {
    if (!b.length) return false;
    if (b[b.length - 1] !== checkSum1B(b.slice(0, b.length - 1))) return false;
    if (b[b.length - 2] !== 0x01) return false;
    return b;
  },
};

const cmdGetLocatorSendingChannel: IBinaryCommand = {
  cmd: 0x24,
  result: b => {
    if (!b.length) return false;
    if (b[b.length - 1] !== checkSum1B(b.slice(0, b.length - 1))) return false;
    return b;
  },
};

export async function getLocatorSendingChannels(
  utils: Utils,
) {
  const locators: Array<{
    mac: string;
    ip: string;
    port: number;
    modelName: string;
    errMsg?: string;
  }> = [];

  const gateways = (() => {
    const locators: IGatewayResult[] = [];
    const now = new Date().getTime();
    const ts = now - utils.projectEnv.locatorLifeTime;
    const buf = utils.ca.getLocatorsBuffer(ts);
    if (buf.length > 5) {
      const bsize = buf.readUint16LE(3);
      const n = (buf.length - 5) / bsize;
      for (let i = 0; i < n; ++i) {
        const l = utils.parseLocatorResult(buf, i * bsize + 5, ts);
        locators.push(l);
      }
    }
    return locators;
  })();

  for (const v of gateways) {
    const modelName = v.info && v.info.modelName;
    if (
      (modelName &&
        (modelName.startsWith('CL-GA25') || modelName.startsWith('CL-GA30')))
    ) {
      const [ip, portStr] = v.ip.split(':');
      const port = portStr ? ~~portStr : 8256;
      const ex = locators.find(x => x.mac === v.mac);
      if (ex) {
        ex.ip = ip;
        ex.port = port;
        ex.modelName = modelName;
      } else {
        locators.push({
          mac: v.mac,
          ip,
          port,
          modelName,
        });
      }
    }
  }
  await Promise.all(
    locators.map(async l => {
      try {
        const res = await udpGetLocatorSendingChannel(utils, l.mac);
        for (const [k, v] of Object.entries(res)) l[k] = v;
      } catch (e) {
        l.errMsg = e;
      }
    })
  );
  return locators;
}

async function udpGetLocatorSendingChannel(utils: Utils, mac: string) {
  const { take, timeout, catchError } = utils.modules.rxjsOperators;
  const { throwError, TimeoutError } = utils.modules.rxjs;

  const res = await utils.udp
    .sendBinaryCmd(mac, cmdGetLocatorSendingChannel)
    .pipe(
      timeout(2000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          throw 'Timeout';
        }
        return throwError(err);
      }),
      take(1),
    )
    .toPromise();

  if (res.data.length === 15) {
    if (res.data[res.data.length - 2])
      return {
        channel: res.data[res.data.length - 4] + 2400,
        whitening: !!res.data[res.data.length - 3],
      };
    return {
      channel: 'default',
    };
  }
  throw 'Failed to get locator sending channel';
}

export interface IBody {
  channel: number; // 下行信道
  whitening: boolean; // 白化
  enabled: boolean; // 启用自定义。不启用基站会使用扫描信道
}

export async function setLocatorSendingChannels(
  utils: Utils,
  body: IBody,
) {
  const locators: Array<{
    mac: string;
    ip: string;
    port: number;
    modelName: string;
    errMsg?: string;
  }> = [];

  const gateways = (() => {
    const locators: IGatewayResult[] = [];
    const now = new Date().getTime();
    const ts = now - utils.projectEnv.locatorLifeTime;
    const buf = utils.ca.getLocatorsBuffer(ts);
    if (buf.length > 5) {
      const bsize = buf.readUint16LE(3);
      const n = (buf.length - 5) / bsize;
      for (let i = 0; i < n; ++i) {
        const l = utils.parseLocatorResult(buf, i * bsize + 5, ts);
        locators.push(l);
      }
    }
    return locators;
  })();

  for (const v of gateways) {
    const modelName = v.info && v.info.modelName;
    if (
      (modelName &&
        (modelName.startsWith('CL-GA25') || modelName.startsWith('CL-GA30')))
    ) {
      const [ip, portStr] = v.ip.split(':');
      const port = portStr ? ~~portStr : 8256;
      const ex = locators.find(x => x.mac === v.mac);
      if (ex) {
        ex.ip = ip;
        ex.port = port;
        ex.modelName = modelName;
      } else {
        locators.push({
          mac: v.mac,
          ip,
          port,
          modelName,
        });
      }
    }
  }
  await Promise.all(
    locators.map(async l => {
      try {
        await udpSetLocatorSendingChannel(
          utils,
          l.mac,
          body.channel,
          body.whitening,
          body.enabled
        );
      } catch (e) {
        l.errMsg = e;
      }
    })
  );
  return locators;
}

async function udpSetLocatorSendingChannel(
  utils: Utils,
  mac: string,
  channel: number,
  whitening: boolean,
  enabled: boolean
) {
  const b = Buffer.alloc(3);
  b[0] = channel - 2400;
  b[1] = ~~whitening;
  b[2] = ~~enabled;

  const { take, timeout, catchError } = utils.modules.rxjsOperators;
  const { throwError, TimeoutError } = utils.modules.rxjs;

  const res = await utils.udp
    .sendBinaryCmd(mac, cmdSetLocatorSendingChannel, b)
    .pipe(
      timeout(2000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          throw 'Timeout';
        }
        return throwError(err);
      }),
      take(1),
    )
    .toPromise();
  if (!res) throw 'Failed to set locator sending channel';
  return true;
}
