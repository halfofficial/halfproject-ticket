const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('priority')
        .setDescription('Bilet önceliğini ayarlar. / Sets the ticket priority.')
        .addStringOption(option =>
            option.setName('level')
                .setDescription('Öncelik seviyesi')
                .setRequired(true)
                .addChoices(
                    { name: 'Standart', value: 'standard' },
                    { name: 'Yüksek / High', value: 'high' },
                    { name: 'Acil / Urgent', value: 'urgent' },
                )),
    async execute(interaction) {
        // Yetki Kontrolü: Sadece Personel (Staff) rolü kullanabilir
        if (!interaction.member.roles.cache.has(interaction.client.config.roles.staff)) {
            return interaction.reply({ content: '❌ Sadece yetkililer bu komutu kullanabilir.', ephemeral: true });
        }

        const level = interaction.options.getString('level');
        const channel = interaction.channel;

        // Emojiyi belirle
        let emoji = '';
        if (level === 'high') emoji = '🔴';
        if (level === 'urgent') emoji = '🔥';
        if (level === 'standard') emoji = '🟢';

        // Kanalın mevcut açıklamasını (topic) al ve güncelle
        const topic = channel.topic || '';
        await channel.setTopic(`${emoji} Priority: ${level.toUpperCase()} | ${topic}`);

        await interaction.reply({ content: `✅ Bilet önceliği **${level.toUpperCase()}** olarak ayarlandı ${emoji}` });
    },
};
