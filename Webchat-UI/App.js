import React from 'react';
import * as FlexWebChat from "@twilio/flex-webchat-ui";

class App extends React.Component {

  state = {};

  constructor(props) {
    super(props);

    const { configuration } = props;

    FlexWebChat.Manager.create(configuration)
      .then(manager => {

        function getAvatar(identity, manager) {
          let avatar = '';
          let isAgent = false;
          let currentMember = null;
          manager.chatClient.channels.channels._c.forEach(c => {
            c.members._c.forEach(member => {
              if (member.identity === identity) {
                currentMember = member;
              }
            });
            if (currentMember && currentMember.attributes.member_type === 'agent') {
              isAgent = true;
            }
            if (isAgent && c.attributes.agent_image_url) {
              avatar = c.attributes.agent_image_url;
            }
          });
          return avatar;
        }

        manager.updateConfig({
          componentProps: {
            MessagingCanvas: {
              avatarCallback: (identity) => {
                return getAvatar(identity, manager);
              },
            }
          }
        });

        FlexWebChat.MessageInput.defaultProps.useSeparateInputStore = true;

        this.setState({ manager });
      }
      )
      .catch(error => this.setState({ error }));
  }

  render() {
    const { manager, error } = this.state;
    if (manager) {
      return (
        <FlexWebChat.ContextProvider manager={manager}>
          <FlexWebChat.RootContainer />
        </FlexWebChat.ContextProvider>
      );
    }

    if (error) {
      console.error("Failed to initialize Flex Web Chat", error);
    }

    return null;
  }
}

export default App;
