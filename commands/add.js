const { SlashCommandBuilder } = require('discord.js');
const { logEvent } = require('../functions/logger');

module.exports = {
    // Komut Tanımlaması
    data: new SlashCommandBuilder()
        .setName('add') // Komut Adı: /add
        .setDescription('Bilete kullanıcı ekler. / Adds a user to the ticket.')
        .addUserOption(option =>
            option.setName('target') // Parametre adı: target
                .setDescription('Eklenecek kullanıcı') // Açıklama
                .setRequired(true)), // Zorunlu

    // Komut Çalıştırıldığında
    async execute(interaction) {
        // Kontrol: Bu komut sadece "ticket-" ile başlayan kanallarda çalışır
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ Bu komut sadece bilet kanallarında kullanılabilir.', ephemeral: true });
        }

        // Eklenmek istenen kullanıcıyı al
        const targetUser = interaction.options.getUser('target');

        try {
            // Kanalın izinlerini güncelle
            await interaction.channel.permissionOverwrites.create(targetUser, {
                ViewChannel: true, // Kanalı GÖR
                SendMessages: true, // Mesaj YAZ
                ReadMessageHistory: true // Geçmişi OKU
            });

            // Başarılı mesajı
            await interaction.reply({ content: `✅ ${targetUser} bilete eklendi.` });

            // Logla
            await logEvent(interaction.client, interaction.guild, 'USER_ADD', {
                target: targetUser,
                executor: interaction.user,
                channel: interaction.channel
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Kullanıcı eklenirken hata oluştu.', ephemeral: true });
        }
    },
};
