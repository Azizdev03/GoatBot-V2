const fs = require("fs-extra");
const path = require("path");
const { getTime, drive } = global.utils;

module.exports = {
	config: {
		name: "leave",
		version: "2.0",
		author: "NTKhang & mod by Dadyyy",
		category: "events"
	},

	langs: {
		fr: {
			session1: "matin",
			session2: "midi",
			session3: "après-midi",
			session4: "soir",
			leaveType1: "a quitté",
			leaveType2: "a été expulsé de",
			defaultLeaveMessage: `💨 {userName} {type} le groupe **{threadName}** ce {session} à {time}h.

💔 Nous te souhaitons bonne route et, qui sait, peut-être à bientôt ?\n\n— Laureine 🤍`
		},
		en: {
			session1: "morning",
			session2: "noon",
			session3: "afternoon",
			session4: "evening",
			leaveType1: "left",
			leaveType2: "was kicked from",
			defaultLeaveMessage: `💨 {userName} {type} the group **{threadName}** this {session} at {time}h.

💔 We wish you the best — maybe see you again someday.\n\n— Laureine 🤍`
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		if (event.logMessageType === "log:unsubscribe")
			return async function () {
				const { threadID } = event;
				const threadData = await threadsData.get(threadID);
				if (!threadData.settings.sendLeaveMessage) return;

				const { leftParticipantFbId } = event.logMessageData;
				if (leftParticipantFbId === api.getCurrentUserID()) return;

				const hours = getTime("HH");
				const session = hours <= 10 ? getLang("session1") : hours <= 12 ? getLang("session2") : hours <= 18 ? getLang("session3") : getLang("session4");
				const userName = await usersData.getName(leftParticipantFbId);
				const threadName = threadData.threadName;

				let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;

				leaveMessage = leaveMessage
					.replace(/\{userName\}|\{userNameTag\}/g, userName)
					.replace(/\{type\}/g, leftParticipantFbId === event.author ? getLang("leaveType1") : getLang("leaveType2"))
					.replace(/\{threadName\}|\{boxName\}/g, threadName)
					.replace(/\{time\}/g, hours)
					.replace(/\{session\}/g, session);

				const form = {
					body: leaveMessage,
					mentions: leaveMessage.includes("{userNameTag}") ? [{ id: leftParticipantFbId, tag: userName }] : null
				};

				// Si aucune image attachée personnalisée n’est trouvée, on ajoute une par défaut
				if (!threadData.data.leaveAttachment) {
					const defaultPath = path.join(__dirname, "leave.jpg");
					if (fs.existsSync(defaultPath)) {
						form.attachment = fs.createReadStream(defaultPath);
					}
				} else {
					const files = threadData.data.leaveAttachment;
					const attachments = files.reduce((acc, file) => {
						acc.push(drive.getFile(file, "stream"));
						return acc;
					}, []);
					form.attachment = (await Promise.allSettled(attachments))
						.filter(({ status }) => status === "fulfilled")
						.map(({ value }) => value);
				}

				message.send(form);
			};
	}
};


Voici la nouvelle version de ton script leave stylée et prête pour Laureine 💖 :

Message esthétique

Session du jour dynamique (matin, midi...)

Image de départ personnalisée (défaut = leave.jpg)

Signature : — Laureine 🤍


🖼️ Place une image nommée leave.jpg dans le même dossier que ce fichier pour qu'elle s'affiche automatiquement si aucun média n’est défini.

Si tu veux, je peux maintenant faire pareil pour le message d’accueil (welcome.js) 👋. Tu veux ?

					
