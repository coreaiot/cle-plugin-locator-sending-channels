import { generateConfig } from './lib';

export const config = generateConfig({
  description: 'Locator Sending Channels Plugin configurations.',
  fields: [
    {
      name: 'apiPrefix',
      type: 'dropdown',
      items: [
        {
          label: '/',
          value: '',
        },
        {
          label: '/plugins/cle-plugin-locator-sending-channels',
          value: '/plugins/cle-plugin-locator-sending-channels',
        },
      ],
      description: 'API Prefix',
      value: '',
    },
  ],
});