const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');

const slackEvents = createEventAdapter(process.env.SLACK_SIGNIN_SECRET);
const web = new WebClient(process.env.SLACK_TOKEN);
const port = process.env.PORT || 3000;

slackEvents.on('app_mention', event => {
  console.log(
    `Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`
  );

  const msg = event.text.split('> ')[1];
  let response = "I don't know what you mean :hidethepain:";

  switch (msg) {
    case 'week':
      response = "We're currently in week 22";
      break;
    case 'notes':
      response = 'https://github.com/world-class/REPL/tree/master/notes';
      break;
    case 'I love you':
      response = 'I love you too';
      break;
  }

  (async () => {
    try {
      await web.chat.postMessage({
        channel: event.channel,
        thread_ts: event.thread_ts,
        text: response
      });
    } catch (error) {
      console.log(error);
    }

    console.log('Message posted!');
  })();
});

slackEvents.on('error', console.error);

slackEvents.start(port).then(() => {
  console.log(`server listening on port ${port}`);
});
