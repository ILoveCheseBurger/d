const {SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear a specific ammount of messages from a target or channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption(option => 
        option.setName("ammount")
        .setDescription("Ammount of messages you want to clear.")
        .setRequired(true)
    )
    .addUserOption(option => 
        option.setName("target")
        .setDescription("Select the user to clear there messages")
        .setRequired(false)
    ),

    async execute(interaction) {
        const {channel, options} = interaction;

        const ammount = options.getInteger("ammount");
        const target = options.getUser("target");

        const message = await channel.messages.fetch({
            limit: ammount +1,
        });

        const res = new EmbedBuilder()
        .setColor(0x009dff)

        if(target) {
            let i = 0;
            const filtered = [];

            (await message).filter((msg) => {
                if(msg.author.id === target.id && ammount > i) {
                    filtered.push(msg);
                    i++;
                }
            });

            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`Successfully deleted ${messages.size} messages from ${target}.`);
                interaction.reply({embeds: [res], ephemeral: true})
            });
        } else {
            await channel.bulkDelete(ammount, true).then(messages => {
                res.setDescription(`Successfully deleted ${messages.size} messages from the channel.`);
                interaction.reply({embeds: [res], ephemeral: true})
            });
        }
    }
}