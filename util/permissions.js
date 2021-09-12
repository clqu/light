module.exports = (Discord, client, config) => {
  client.permission = (message, perms) => {
      let s = true;
      if (!message.guild || !['object', 'array'].includes(typeof perms)) return;
      let userPerms = new Discord.Permissions(message.member.permissions || 0).toArray();

      for (let i = 0; i < perms.length; i++) {
          if (perms[i] == 'DEVELOPER') {
              if (!config.developers.includes(message.author.id)) s = false;
          } else if (perms[i] == 'OWNER') {
              if (message.guild.ownerID != message.author.id) s = false;
          } else {
              if (!userPerms.includes(perms[i])) s = false;
          };
      };

      return s;
  };
};