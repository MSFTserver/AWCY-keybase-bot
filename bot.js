const Bot = require("keybase-bot");
const username = process.env.KB_USERNAME;
const paperkey = process.env.KB_PASSWORD;
const teamName = process.env.KB_TEAMNAME;

const bot = new Bot();

async function start() {
  let result = {};
  let genChat = null;
	try {
		await bot.init(username, paperkey);
		console.log(
			`initialized ${bot.myInfo().username}, lock and loaded with useful info and snarky remarks at the ready!`
		);
	} catch (error) {
		console.error(error);
	}

  async function startMsg(){
    try {
      await bot.chat.listChannels(teamName).then(chatConversations => {
        //console.log(chatConversations);
        for (var i = 0; i < chatConversations.length; i++) {
          result[i] = chatConversations[i].channel.topicName
          if (chatConversations[i].channel.name == 'awcybottest' && chatConversations[i].channel.topicName == 'general'){
            genChat = chatConversations[i].id;
          }
          //result[chatConversations[i].channel.name] += chatConversations[i].channel.topicName;
        }
        //console.log(genChat);
        //console.log(JSON.stringify(result));
      });
      console.log(genChat);
      const channel = {genChat};
      const message = {
        body: `Hello test channel! This is ${bot.myInfo().username} saying hello!`
      };
      await bot.chat.send(channel, message);
      console.log("Message sent!");
    } catch (error) {
      console.error(error);
    }
  }

  async function joinChannels() {
    bot.chat.listChannels(teamName).then(async teamConversations => {
      for (const conversation of teamConversations) {
        if (conversation.memberStatus !== "active") {
          await bot.chat.join(conversation.channel);
          console.log("Joined team channel", conversation.channel);
        }
      }
    });
  }
  async function loadAds(){
    // server advertisement
    await bot.chat.advertiseCommands({
      advertisements: [
        {
          type: "public",
          commands: [
            {
              name: "echo",
              description: "Sends out your message to the current channel.",
              usage: "[your text]"
            }
          ]
        }
      ]
    });
  }
  async function listChannels(){
    // channel list!
    bot.chat.listChannels(teamName).then(chatConversations => {
      console.log(chatConversations);
      for (var i = 0; i < chatConversations.length; i++) {
        result[i] = chatConversations[i].channel.topicName
        if (chatConversations[i].channel.name == 'awcybottest' && chatConversations[i].channel.topicName == 'general'){
          genChat = chatConversations[i].id;
        }
        //result[chatConversations[i].channel.name] += chatConversations[i].channel.topicName;
      }
      //console.log(genChat);
      //console.log(JSON.stringify(result));
    });
  }
  async function watchMsg(){
    // watch channels for messages
    const onMessage = message => {
      const msg = message;
      if (msg.sender.username == bot.myInfo().username) return;
      if (msg.content.text.body.startsWith('!')){
      console.log(msg);
      const conversationId = msg.conversationId;
      bot.chat.send(conversationId, { body: "thanks!!!" });
    } else return;
    };
    bot.chat.watchAllChannelsForNewMessages(onMessage);
  }
  joinChannels();
  watchMsg();
  loadAds();
  listChannels();
  startMsg();
}
start();
