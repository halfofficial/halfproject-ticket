const { EmbedBuilder } = require('discord.js');

/**
 * Log Gönderme Fonksiyonu
 * @param {object} client - Bot istemcisi
 * @param {object} guild - Sunucu nesnesi
 * @param {string} type - Log tipi (TICKET_CREATE, USER_ADD vs.)
 * @param {object} data - Loglanacak veriler
 */
async function logEvent(client, guild, type, data) {
    // Log tipine göre doğru kanalı seç
    let targetChannelId = client.config.logChannel;
    if (type === 'TRANSCRIPT') {
        targetChannelId = client.config.transcriptChannel;
    }

    if (!targetChannelId) return; // Ayarlanmamışsa çık

    // Kanalı bul
    const logChannel = guild.channels.cache.get(targetChannelId);
    if (!logChannel) return; // Kanal yoksa çık

    // Log Embed'ini Hazırla
    let embed = new EmbedBuilder().setTimestamp();

    // Log Tipine Göre İçeriği Doldur
    switch (type) {
        case 'TICKET_CREATE': // 1. Bilet Oluşturma Logu
            embed.setTitle('🆕 Bilet Oluşturuldu / Ticket Created')
                .setColor(client.config.colors.main) // Gri
                .addFields(
                    { name: 'Kullanıcı', value: `${data.user.tag} (${data.user.id})`, inline: true },
                    { name: 'Kanal', value: `${data.channel.name}`, inline: true },
                    { name: 'Sorun (Issue)', value: data.issue.substring(0, 1024) || 'Yok' },
                    { name: 'Hizmet (Service)', value: data.service || 'Yok' }
                );
            break;

        case 'TICKET_CLOSE': // 2. Bilet Kapatma Logu
            embed.setTitle('🗑️ Bilet Kapatıldı / Ticket Closed')
                .setColor(client.config.colors.main) // Gri
                .addFields(
                    { name: 'Kapatan', value: `${data.user.tag} (${data.user.id})`, inline: true },
                    { name: 'Kanal Adı', value: `${data.channelName}`, inline: true }
                );
            break;

        case 'TICKET_CLAIM': // 3. Bilet Sahiplenme Logu
            embed.setTitle('🙋‍♂️ Bilet Sahiplenildi / Ticket Claimed')
                .setColor(client.config.colors.main) // Gri
                .addFields(
                    { name: 'Yetkili', value: `${data.user.tag}`, inline: true },
                    { name: 'Kanal', value: `${data.channel.name}`, inline: true }
                );
            break;

        case 'USER_ADD': // 4. Kullanıcı Ekleme Logu
            embed.setTitle('➕ Kullanıcı Eklendi / User Added')
                .setColor(client.config.colors.main) // Gri
                .addFields(
                    { name: 'Eklenen Kişi', value: `${data.target.tag}`, inline: true },
                    { name: 'Ekleyen Yetkili', value: `${data.executor.tag}`, inline: true },
                    { name: 'Kanal', value: `${data.channel.name}`, inline: true }
                );
            break;

        case 'USER_REMOVE': // 5. Kullanıcı Çıkarma Logu
            embed.setTitle('➖ Kullanıcı Çıkarıldı / User Removed')
                .setColor(client.config.colors.main) // Gri
                .addFields(
                    { name: 'Çıkarılan Kişi', value: `${data.target.tag}`, inline: true },
                    { name: 'Çıkaran Yetkili', value: `${data.executor.tag}`, inline: true },
                    { name: 'Kanal', value: `${data.channel.name}`, inline: true }
                );
            break;

        case 'TRANSCRIPT': // 6. Transkript (Dosya) Logu
            embed.setTitle('📄 Transkript Oluşturuldu / Transcript Generated')
                .setColor(client.config.colors.main) // Gri
                .setDescription(`**${data.channelName}** bileti ${data.user.tag} tarafından kapatıldı ve dökümü alındı.`);
            break;
    }

    // Embed'i ve varsa dosyayı (transkript) gönder
    const payload = { embeds: [embed] };
    if (data.files) payload.files = data.files;

    await logChannel.send(payload);
}

module.exports = { logEvent };
