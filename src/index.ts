export * from './config';
export * from './status';
export * from './i18n';

import { Context } from 'koa';
import { Plugin, Utils, generateDocs, parseHttpRequestBody } from '@lib';
import { IBody, getLocatorSendingChannels, setLocatorSendingChannels } from './locatorSendingChannels';

export async function init(self: Plugin, utils: Utils) {
  const config = await utils.loadConfig(self);
  const packUri = (p: string) => {
    return config.apiPrefix + p;
  };
  self.status.status = 'idle';

  const errMsgBuzy = 'Busy now. Try later!';

  utils.http.apis.push(router => {
    const uri = packUri('/locator-sending-channels');

    router.get(uri, async (ctx: Context) => {
      if (self.debug)
        self.logger.debug(`GET ${uri}`);
      if (self.status.status !== 'idle') {
        ctx.status = 400;
        ctx.body = errMsgBuzy;
        return;
      }
      self.status.status = 'requesting';
      try {
        const res = await getLocatorSendingChannels(utils);
        ctx.status = 200;
        ctx.body = res;
      } catch (e) {
        console.error(e);
        ctx.status = 400;
        ctx.body = e;
      }
      self.status.status = 'idle';
    });

    router.post('/locator-sending-channels', async (ctx: Context) => {
      const requestBody = parseHttpRequestBody<IBody>(ctx);

      if (self.debug)
        self.logger.debug(`POST ${uri}`, JSON.stringify(requestBody, null, 2));
      if (self.status.status !== 'idle') {
        ctx.status = 400;
        ctx.body = errMsgBuzy;
        return;
      }
      self.status.status = 'requesting';
      try {
        const res = await setLocatorSendingChannels(utils, requestBody);
        ctx.status = 200;
        ctx.body = res;
      } catch (e) {
        console.error(e);
        ctx.status = 400;
        ctx.body = e;
      }
      self.status.status = 'idle';
    });

  })
  return true;
}

export async function test(self: Plugin, utils: Utils) {
  self.logger.info('Test', self.name);
  self.logger.info('Loading Config ..');
  const config = await utils.loadConfig(self);
  console.log(config);
  self.logger.info('Test OK.');
}

export const docs = generateDocs();
