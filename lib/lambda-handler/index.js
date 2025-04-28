const { WebClient } = require('@slack/web-api');
const { getRandomName } = require('./names');
const { getEmoji } = require('./format');
require('dotenv').config();

exports.handler = async (event) => {
  // Extract specific properties from the event object
  const { resource, path, httpMethod, headers, queryStringParameters, body } =
    event;
  const response = {
    resource,
    path,
    httpMethod,
    headers,
    queryStringParameters,
    body,
  };

  if (path === '/interactive-endpoint' && httpMethod === 'POST') {
    const data = JSON.parse(new URLSearchParams(body).get('payload'));

    if (data.callback_id === 'send_message_form') {
      const web = new WebClient(process.env.SLACK_BOT_TOKEN);

      const result = await web.views.open({
        trigger_id: data.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'send_message',
          title: {
            type: 'plain_text',
            text: 'Blind - 익명 메세지',
            emoji: true,
          },
          submit: {
            type: 'plain_text',
            text: 'Submit',
            emoji: true,
          },
          close: {
            type: 'plain_text',
            text: 'Cancel',
            emoji: true,
          },
          blocks: [
            {
              type: 'input',
              block_id: '#message',
              element: {
                type: 'plain_text_input',
                multiline: true,
                action_id: 'text_input_message',
              },
              label: {
                type: 'plain_text',
                text: '메세지',
                emoji: true,
              },
            },
            {
              type: 'input',
              block_id: '#nickname',
              element: {
                type: 'plain_text_input',
                action_id: 'text_input_name',
              },
              optional: true,
              label: {
                type: 'plain_text',
                text: '익명 닉네임',
                emoji: true,
              },
            },
          ],
        },
      });

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      };
    }

    if (
      data.type === 'view_submission' &&
      data.view.callback_id === 'send_message'
    ) {
      const web = new WebClient(process.env.SLACK_BOT_TOKEN);

      const nicknameInput =
        data.view.state.values['#nickname'].text_input_name.value?.trim() ?? '';
      const nickname =
        nicknameInput.length > 0 ? nicknameInput : getRandomName();

      await web.chat.postMessage({
        channel: '#bot-test',
        username: nickname,
        icon_emoji: getEmoji(nickname),
        text: data.view.state.values['#message'].text_input_message.value,
        blocks: [
          {
            type: 'section',
            block_id: '#blind_message_content',
            text: {
              type: 'mrkdwn',
              text: data.view.state.values['#message'].text_input_message.value,
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '스레드 달기',
                emoji: true,
              },
              value: 'make_thread_button_clicked', // 의미 없는 값
              action_id: '#make_thread_button_clicked',
            },
          },
        ],
      });

      return {
        statusCode: 200,
      };
    }

    if (data.type === 'block_actions') {
      const web = new WebClient(process.env.SLACK_BOT_TOKEN);
      const private_metadata = JSON.stringify({
        message_ts: data.message?.ts ?? '',
      });
      console.log(
        data.message,
        data.message.blocks
          .find((block) => block.block_id === '#blind_message_content')
          ?.elements.find((element) => element.type === 'rich_text_section')
          ?.elements,
      );
      const originalMessage =
        data.message.blocks.find(
          (block) => block.block_id === '#blind_message_content',
        )?.text?.text ??
        data.message.blocks
          .find((block) => block.block_id === '#blind_message_content')
          ?.elements.find((element) => element.type === 'text')?.text ??
        data.message.blocks
          .find((block) => block.block_id === '#blind_message_content')
          ?.elements.find((element) => element.type === 'rich_text_section')
          ?.elements.find((element) => element.type === 'text')?.text ??
        '';
      const description = `현재 아래 메시지에 스레드를 다는 중이에요.\n\n>>>\n${originalMessage}`;
      if (data.actions[0].action_id === '#make_thread_button_clicked') {
        const result = await web.views.open({
          trigger_id: data.trigger_id,
          view: {
            private_metadata: private_metadata,
            type: 'modal',
            callback_id: 'send_message_thread',
            title: {
              type: 'plain_text',
              text: 'Blind - 스레드 달기',
              emoji: true,
            },
            submit: {
              type: 'plain_text',
              text: 'Submit',
              emoji: true,
            },
            close: {
              type: 'plain_text',
              text: 'Cancel',
              emoji: true,
            },
            blocks: [
              {
                type: 'context',
                elements: [
                  {
                    type: 'mrkdwn',
                    text: description,
                  },
                ],
              },
              {
                type: 'input',
                block_id: '#message',
                element: {
                  type: 'plain_text_input',
                  multiline: true,
                  action_id: 'text_input_message',
                },
                label: {
                  type: 'plain_text',
                  text: '메세지',
                  emoji: true,
                },
              },
              {
                type: 'input',
                block_id: '#nickname',
                element: {
                  type: 'plain_text_input',
                  action_id: 'text_input_name',
                },
                optional: true,
                label: {
                  type: 'plain_text',
                  text: '익명 닉네임',
                  emoji: true,
                },
              },
            ],
          },
        });

        return {
          statusCode: 200,
          body: JSON.stringify(result),
        };
      }
    }

    if (
      data.type === 'view_submission' &&
      data.view.callback_id === 'send_message_thread'
    ) {
      const web = new WebClient(process.env.SLACK_BOT_TOKEN);
      const nicknameInput =
        data.view.state.values['#nickname'].text_input_name.value?.trim() ?? '';
      const nickname =
        nicknameInput.length > 0 ? nicknameInput : getRandomName();
      const private_metadata = JSON.parse(data.view.private_metadata);
      const message_ts = private_metadata.message_ts;

      await web.chat.postMessage({
        channel: '#bot-test',
        username: nickname,
        icon_emoji: getEmoji(nickname),
        text: data.view.state.values['#message'].text_input_message.value,
        thread_ts: message_ts,
      });

      return {
        statusCode: 200,
      };
    }
  }

  if (path === '/action-endpoint' && httpMethod === 'POST') {
    const data = JSON.parse(body);
    const web = new WebClient(process.env.SLACK_BOT_TOKEN);

    if (
      data.event?.type === 'function_executed' &&
      data.event.function.callback_id === 'a8fcb9'
    ) {
      let nickname = data.event.inputs.nickname?.trim() ?? '';

      if (nickname.length === 0) {
        nickname = getRandomName();
      }

      await web.chat.postMessage({
        channel: '#bot-test',
        username: nickname,
        icon_emoji: getEmoji(nickname),
        text: '익명의 메세지',
        blocks: [
          ...data.event.inputs['a6c345'].map((block) => ({
            ...block,
            block_id: '#blind_message_content',
          })),
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '스레드 달기',
                  emoji: true,
                },
                value: 'make_thread_button_clicked',
                action_id: '#make_thread_button_clicked',
              },
            ],
          },
        ],
      });

      return {
        statusCode: 200,
      };
    }

    if (data.type === 'url_verification') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'plain/text',
        },
        body: data.challenge,
      };
    }
  }

  console.log('Unknown path or body:', path, body);

  return {
    body: JSON.stringify(response, null, 2),
    statusCode: 200,
  };
};
