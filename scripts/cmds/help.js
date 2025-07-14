const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🐐 | Laureine Bot V1 ]";
const bannerImage = "https://i.imgur.com/BannerLaureine.png"; // Lien vers ton image d'accueil personnalisée

/**
* Auteur : NTKhang modifié par Dadyyy.
* Message : Respecte l’auteur, modifie mais n’efface pas sa trace
*/

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "Dadyyy",
    countDown: 5,
    role: 0,
    description: {
      fr: "Voir l’utilisation des commandes",
      en: "View command usage"
    },
    category: "informations",
    guide: {
      fr: "{pn} [vide | <page> | <nom commande>]",
      en: "{pn} [empty | <page> | <command name>]"
    },
    priority: 1
  },

  langs: {
    fr: {
      help:
`╭── 🎀 Bienvenue sur Laureine 🎀 ──⭓
│ Image d’accueil : ${bannerImage}
├───────────────⭔
│ Page : [%2/%3]
│ %4 commandes disponibles !
│ 📌 Tape %5help <page> pour voir plus
│ 📌 Tape %5help <nom> pour les détails
├── Commandes ──⭓
%1
╰─────────────────────⭓`,
      help2:
`╭── 🎀 Catégories de Commandes 🎀 ──⭓
%1├────⭔
│ %2 commandes utilisables
│ Tape %3help <nom commande> pour plus d’infos
╰─────────────────────⭓`,
      commandNotFound: "❌ La commande '%1' n'existe pas.",
      getInfoCommand:
`╭── 📄 Infos de la commande ──⭓
│ 📌 Nom : %1
│ 📝 Description : %2
│ 🔁 Alias : %3
│ 🧩 Alias perso : %4
│ 📦 Version : %5
│ 🔒 Rôle : %6
│ ⏱️ Cooldown : %7s
│ 👤 Auteur : %8
├── 📚 Utilisation ──⭓
│ %9
╰───────────────────────⭓`,
      onlyInfo:
`╭── 📄 Infos de la commande ──⭓
│ 📌 Nom : %1
│ 📝 Description : %2
│ 🔁 Alias : %3
│ 🧩 Alias perso : %4
│ 📦 Version : %5
│ 🔒 Rôle : %6
│ ⏱️ Cooldown : %7s
│ 👤 Auteur : %8
╰─────────────────────⭓`,
      onlyUsage:
"╭── 📚 Utilisation ──⭓\n│ %1\n╰─────────────────────⭓",
      onlyAlias:
"╭── 🔁 Alias ──⭓\n│ Globaux : %1\n│ Groupe : %2\n╰─────────────────────⭓",
      onlyRole:
"╭── 🔒 Rôle ──⭓\n│ %1\n╰─────────────────────⭓",
      doNotHave: "Aucun",
      roleText0: "0 (Tous les utilisateurs)",
      roleText1: "1 (Admins du groupe)",
      roleText2: "2 (Admins du bot)",
      roleText0setRole: "0 (défini, tout le monde)",
      roleText1setRole: "1 (défini, admins groupe)",
      pageNotFound: "❌ La page %1 n'existe pas."
    }
  }
};
