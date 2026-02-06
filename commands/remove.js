const { SlashCommandBuilder } = require('discord.js');
const { logEvent } = require('../functions/logger');

module.exports = {
    // Komut Tanımlaması
    data: new SlashCommandBuilder()
        .setName('remove') // Komut Adı: /remove
        .setDescription('Biletten kullanıcı çıkarır. / Removes a user from the ticket.')
        .addUserOption(option =>
            option.setName('target') // Parametre: target
                .setDescription('Çıkarılacak kullanıcı')
                .setRequired(true)),

    // Komut Çalıştırıldığında
    async execute(interaction) {
        // Kanal kontrolü
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ Bu komut sadece bilet kanallarında kullanılabilir.', ephemeral: true });
        }

        const targetUser = interaction.options.getUser('target');

        try {
            // Kullanıcının izinlerini sil (Kanaldan atar)
            await interaction.channel.permissionOverwrites.delete(targetUser);

            await interaction.reply({ content: `✅ ${targetUser} biletten çıkarıldı.` });

            // Logla
            await logEvent(interaction.client, interaction.guild, 'USER_REMOVE', {
                target: targetUser,
                executor: interaction.user,
                channel: interaction.channel
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Kullanıcı çıkarılırken hata oluştu.', ephemeral: true });
        }
    },
};
