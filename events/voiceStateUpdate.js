const { Events, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState, client) {

        const supportChannelId = client.config.voiceChannelId;
        if (!supportChannelId) return;

        const userJoined = newState.channelId === supportChannelId && oldState.channelId !== supportChannelId;

        if (userJoined) {
            if (newState.member.user.bot) return;

            const channel = newState.channel;

            try {
                const connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });

                const player = createAudioPlayer();
                const resourcePath = path.resolve(__dirname, '..', client.config.voiceMp3 || 'audio.mp3');

                try {
                    const resource = createAudioResource(resourcePath);
                    player.play(resource);
                    connection.subscribe(player);
                } catch (err) {
                    console.error("Ses hatası:", err);
                }

                const guild = newState.guild;
                const ticketName = `ticket-${newState.member.user.username}`;
                const existingChannel = guild.channels.cache.find(c => c.name === ticketName);

                if (existingChannel) { return; }

                const categoryId = client.config.ticketCategory;

                const ticketChannel = await guild.channels.create({
                    name: ticketName,
                    type: ChannelType.GuildText,
                    parent: categoryId,
                    topic: 'Service: Voice Support (General) | User: ' + newState.member.user.tag,
                    permissionOverwrites: [
                        { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                        { id: newState.member.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
                        { id: client.config.roles.staff, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                    ],
                });

                const config = client.config;
                let welcomeMsg = config.messages.ticketWelcome.replace('{category}', 'Sesli Destek (Genel) / Voice Support (General)');

                const embed = new EmbedBuilder()
                    .setTitle('Sesli Destek / Voice Support')
                    .setDescription(welcomeMsg)
                    .setColor(config.colors.main); // Tek Renk (Gri)

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId('close_ticket_confirm').setLabel('Kapat / Close').setStyle(ButtonStyle.Secondary).setEmoji('🔒'),
                        new ButtonBuilder().setCustomId('claim_ticket').setLabel('Sahiplen / Claim').setStyle(ButtonStyle.Secondary).setEmoji('🙋‍♂️'), // Gri
                    );

                await ticketChannel.send({ content: `${newState.member} | <@&${client.config.roles.staff}>`, embeds: [embed], components: [row] });

            } catch (error) {
                console.error("Ses/Ticket hatası:", error);
            }
        }
    },
};
