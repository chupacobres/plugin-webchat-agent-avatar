import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import reducers, { namespace } from './states';

const PLUGIN_NAME = 'WebchatAgentAvatarPlugin';

export default class WebchatAgentAvatarPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);

    flex.MessageInput.defaultProps.useSeparateInputStore = true;

    flex.Actions.addListener("afterAcceptTask", (payload) => {
      const avatar = payload.task._task._worker.attributes.image_url
      const channelSid = payload.task._task.attributes.channelSid
      const attributes = {
        agent_image_url: avatar
      };
      console.log("What I need @@@", avatar, channelSid)
      manager.chatClient.getChannelBySid(channelSid)
        .then(function (channel) {
          channel.updateAttributes(attributes)
            .then(function (channel) {
              console.log("ATTRIBUTES UPDATED");
            });
        })
    });
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
