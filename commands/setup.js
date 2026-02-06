const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-panel')
        .setDescription('Destek paneli mesajını gönderir.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction) {
        const config = interaction.client.config;
        const faqChannelId = config.faqChannelId || "SS-KANAL-ID";

        // Config'den mesaj metnini al ve değişkenleri yerleştir
        let description = config.messages.panelDescription.replace('{faqChannelId}', faqChannelId);

        const embed = new EmbedBuilder()
            .setColor(config.colors.main) // Arkaplan Rengi (Koyu Gri)
            .setTitle(config.messages.panelTitle)
            .setDescription(description);

        // Butonları Config'den Çekip Oluşturma
        const row = new ActionRowBuilder();

        // Genel Destek Butonu
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(config.ticketCategories.general.id)
                .setLabel(config.ticketCategories.general.label)
                .setEmoji(config.ticketCategories.general.emoji)
                .setStyle(ButtonStyle[config.ticketCategories.general.style])
        );

        // Teknik Destek Butonu
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(config.ticketCategories.technical.id)
                .setLabel(config.ticketCategories.technical.label)
                .setEmoji(config.ticketCategories.technical.emoji)
                .setStyle(ButtonStyle[config.ticketCategories.technical.style])
        );

        // Satış Butonu
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(config.ticketCategories.sales.id)
                .setLabel(config.ticketCategories.sales.label)
                .setEmoji(config.ticketCategories.sales.emoji)
                .setStyle(ButtonStyle[config.ticketCategories.sales.style])
        );

        await interaction.channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: 'Panel başarıyla güncellendi!', ephemeral: true });
    },
};
