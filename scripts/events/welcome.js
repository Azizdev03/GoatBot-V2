const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
  global.temp.welcomeEvent = {};

module.exports = {
  config: {
    name: "welcome",
    version: "1.8",
    author: "NTKhang & Dadyyy",
    category: "events"
  },

  langs: {
    en: {
      session1: "morning",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      welcomeMessage: "Thank you for inviting me to the group!\nBot prefix: %1\nTo see the full list of commands, type: %1help",
      multiple1: "you",
      multiple2: "you all",
      defaultWelcomeMessage: `🎉 Welcome {userName}!

👋 We’re thrilled to have {multiple} join the group: "{boxName}" 💬
🕒 Time of day: {session}

✨ May your stay be filled with laughter, learning, and legendary memes!

🔍 Type /help to discover all my features!

🚀 Let's get started together!
- Laureine 🤖`
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType === "log:subscribe")
      return async function () {
        const hours = getTime("HH");
        const { threadID } = event;
        const prefix = global.utils.getPrefix(threadID);
        const threadData = await threadsData.get(threadID);
        const { nickNameBot } = global.GoatBot.config;
        const dataAddedParticipants = event.logMessageData.addedParticipants;

        if (dataAddedParticipants.some(user => user.userFbId === api.getCurrentUserID())) {
          if (nickNameBot)
            api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
          return message.send(getLang("welcomeMessage", prefix));
        }

        if (!global.temp.welcomeEvent[threadID])
          global.temp.welcomeEvent[threadID] = {
            joinTimeout: null,
            dataAddedParticipants: []
          };

        global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
        clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

        global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
          const dataAdded = global.temp.welcomeEvent[threadID].dataAddedParticipants;
          const threadName = threadData.threadName;
          const banned = threadData.data.banned_ban || [];
          const userName = [], mentions = [];
          let multiple = dataAdded.length > 1;

          for (const user of dataAdded) {
            if (banned.some(b => b.id === user.userFbId)) continue;
            userName.push(user.fullName);
            mentions.push({ tag: user.fullName, id: user.userFbId });
          }

          if (!userName.length) return;

          let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
          const session = hours <= 10 ? getLang("session1") : hours <= 12 ? getLang("session2") : hours <= 18 ? getLang("session3") : getLang("session4");

          welcomeMessage = welcomeMessage
            .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
            .replace(/\{boxName\}|\{threadName\}/g, threadName)
            .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
            .replace(/\{session\}/g, session);

          const form = {
            body: welcomeMessage,
            mentions: welcomeMessage.includes("{userNameTag}") ? mentions : []
          };

          const defaultImagePath = "attachments/welcome/banner.jpg";
          if (!threadData.data.welcomeAttachment) {
            threadData.data.welcomeAttachment = [defaultImagePath];
          }

          const files = threadData.data.welcomeAttachment;
          const attachments = files.map(file => drive.getFile(file, "stream"));
          form.attachment = (await Promise.allSettled(attachments))
            .filter(r => r.status === "fulfilled")
            .map(r => r.value);

          message.send(form);
          delete global.temp.welcomeEvent[threadID];
        }, 1500);
      };
  }
};
