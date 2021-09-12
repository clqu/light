module.exports = (Discord, client, config) => {
  client.commands = new Discord.Collection();
  client.aliases = new Discord.Collection();

  require('fs').readdir('./commands', (err, files) => {
      if (files) {
          let loadedCommands = 0;
          console.log(`[Light Partner] ${files.length} adet komut bulundu, yükleniyor...`);
          files.forEach(file => {
              loadedCommands++
              let command = require(`${process.cwd()}/${'./commands'}/${file}`);

              function kill() {
                throw new Error('[HATA] Komut dosyası yapısında hata mevcut!');
              };
            
              if (!command || typeof command != 'object') return kill();
              if (!command.run || !command.config) return kill();
              if (typeof command.run != 'function') return kill();
              if (typeof command.config != 'object') return kill();
              if (typeof command.config.name != 'string') return kill();
              if (!['array', 'object'].includes(typeof command.config.aliases)) return kill();
              if (!['array', 'object'].includes(typeof command.config.perms)) return kill();
              if (typeof command.config.enabled != 'boolean') return kill();

              client.commands.set(command.config.name, command);
              command.config.aliases.forEach(alias => client.aliases.set(alias, command.config.name));
              if (loadedCommands == files.length) console.log(`[Light Partner] Komutlar başarıyla yüklendi! (${files.length})`);
          });
      };
  });
};