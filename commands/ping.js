module.exports = {
  run: async (client, message, args, db) => {

    message.channel.send(':ping_pong: Pong...').then(msg => {
        msg.edit(`:ping_pong: Pong...\n> ${client.ws.ping}ms`)
    })

},
  config: {
    name: "ping",
    aliases: [],
    desc: "",
    perms: [],
    enabled: true
  }
}; 
