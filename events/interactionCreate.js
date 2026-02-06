const { Events, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const { logEvent } = require('../functions/logger');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {

        // 1. CHAT KOMUTLARI
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Komut hatası.', ephemeral: true });
            }
            return;
        }

        // 2. BUTON TIKLAMALARI
        if (interaction.isButton()) {
            const config = client.config;
            const customId = interaction.customId;

            // --- KATEGORİ BUTONLARI ---
            const isGeneral = customId === config.ticketCategories.general.id;
            const isTechnical = customId === config.ticketCategories.technical.id;
            const isSales = customId === config.ticketCategories.sales.id;

            if (isGeneral || isTechnical || isSales) {

                let categoryName = "Genel";
                if (isTechnical) { categoryName = "Teknik"; }
                if (isSales) { categoryName = "Satış"; }

                const guild = interaction.guild;
                const member = interaction.member;

                // --- Bilet Kontrolü ---
                const ticketName = `ticket-${member.user.username}`;
                const existingChannel = guild.channels.cache.find(c => c.name === ticketName);

                if (existingChannel) {
                    return interaction.reply({
                        content: `❌ Zaten açık bir talebiniz var: ${existingChannel}`,
                        ephemeral: true
                    });
                }

                try {
                    // Kanalı Oluştur
                    const channel = await guild.channels.create({
                        name: ticketName,
                        type: ChannelType.GuildText,
                        parent: client.config.ticketCategory,
                        topic: `Service: ${categoryName} | User: ${member.user.tag}`,
                        permissionOverwrites: [
                            {
                                id: guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: member.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                            },
                            {
                                id: client.config.roles.staff,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                            }
                        ],
                    });

                    // Hoşgeldin Mesajı
                    let welcomeMsg = config.messages.ticketWelcome.replace('{category}', categoryName);

                    const embed = new EmbedBuilder()
                        .setColor(config.colors.main) // Tek Renk (Gri)
                        .setDescription(welcomeMsg);

                    // Kontrol Butonları (Hepsi Gri ButtonStyle.Secondary)
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId('close_ticket_confirm').setLabel('Kapat / Close').setStyle(ButtonStyle.Secondary).setEmoji('🔒'),
                            new ButtonBuilder().setCustomId('claim_ticket').setLabel('Sahiplen / Claim').setStyle(ButtonStyle.Secondary).setEmoji('🙋‍♂️'), // Bu da gri (Secondary)
                        );

                    await channel.send({ content: `${member} | <@&${client.config.roles.staff}>`, embeds: [embed], components: [row] });
                    await interaction.reply({ content: `✅ Bilet oluşturuldu: ${channel}`, ephemeral: true });

                    // Logla
                    await logEvent(client, guild, 'TICKET_CREATE', {
                        user: member.user,
                        channel: channel,
                        issue: "Buton ile oluşturuldu",
                        service: categoryName
                    });

                } catch (error) {
                    console.error('Bilet hatası:', error);
                    await interaction.reply({ content: 'Hata oluştu.', ephemeral: true });
                }
                return;
            }

            // --- B) Bilet Kapatma Onayı ---
            if (interaction.customId === 'close_ticket_confirm') {
                if (!interaction.member.roles.cache.has(client.config.roles.staff)) {
                    return interaction.reply({ content: '❌ Sadece yetkililer bileti kapatabilir.', ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setColor(config.colors.main) // Tek Renk (Gri)
                    .setDescription(`
🔒 **Bilet Kapatma Onayı**
Desteğe olan ihtiyacınızın bittiğinden emin misiniz?
\`Are you sure you want to close this ticket?\`
                    `);

                const confirmRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId('ticket_close_final').setLabel('Evet, Kapat').setStyle(ButtonStyle.Secondary), // Gri (Secondary)
                        new ButtonBuilder().setCustomId('ticket_close_cancel').setLabel('İptal').setStyle(ButtonStyle.Secondary)
                    );

                await interaction.reply({ embeds: [embed], components: [confirmRow], ephemeral: false });
            }

            // --- C) Kapatmayı İptal ---
            if (interaction.customId === 'ticket_close_cancel') {
                await interaction.message.delete();
            }

            // --- D) Kesin Kapatma ---
            if (interaction.customId === 'ticket_close_final') {
                const channel = interaction.channel;

                const transcriptFile = await discordTranscripts.createTranscript(channel, {
                    limit: -1,
                    returnType: 'attachment',
                    filename: `transcript-${channel.name}.html`,
                    saveImages: true,
                    poweredBy: true
                });

                await logEvent(client, interaction.guild, 'TRANSCRIPT', {
                    channelName: channel.name,
                    user: interaction.user,
                    files: [transcriptFile]
                });

                await logEvent(client, interaction.guild, 'TICKET_CLOSE', {
                    channelName: channel.name,
                    user: interaction.user
                });

                await interaction.reply("Bilet kapatılıyor...");
                setTimeout(() => { channel.delete().catch(console.error); }, 5000);
            }

            // --- E) Sahiplenme ---
            if (interaction.customId === 'claim_ticket') {
                if (!interaction.member.roles.cache.has(client.config.roles.staff)) {
                    return interaction.reply({ content: 'Only staff.', ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setColor(config.colors.main) // Tek Renk (Gri)
                    .setDescription(`🎫 Ticket claimed by ${interaction.user}`);

                await interaction.reply({ embeds: [embed] });
                await interaction.channel.setTopic(`Claimed by ${interaction.user.tag}`);

                await logEvent(client, interaction.guild, 'TICKET_CLAIM', {
                    user: interaction.user,
                    channel: interaction.channel
                });
            }
        }
    },
};
