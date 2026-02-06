const { Events, ActivityType, REST, Routes } = require('discord.js');

module.exports = {
    name: Events.ClientReady, // Dinlenecek Olay: ClientReady (Bot Hazır Olduğunda)
    once: true, // Bu olay sadece bot açıldığında 1 kere çalışsın
    async execute(client) {
        // Konsola botun hazır olduğunu yazdır
        console.log(`✅ Hazır! Bot giriş yaptı: ${client.user.tag}`);

        // --- Bot Durumunu (Presence) Ayarlama ---
        client.user.setPresence({
            activities: [{
                name: 'Half Studio Ticket', // Durum Mesajı
                type: ActivityType.Playing // Durum Tipi: Oynuyor (Playing), İzliyor (Watching) vb.
            }],
            status: 'online', // Çevrimiçi (online), Rahatsız Etmeyin (dnd), Boşta (idle)
        });

        // --- Slash (/) Komutlarını Kaydetme ---
        // Komutları JSON formatına çevir
        const commands = client.commands.map(cmd => cmd.data.toJSON());
        // REST API aracılığıyla komutları Discord'a gönder
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        try {
            console.log('⏳ Uygulama (/) komutları yenileniyor...');

            if (client.config.guildId) {
                // Eğer config.json'da Guild ID (Sunucu ID) varsa, komutları sadece o sunucuya yükle.
                // Bu geliştirme aşamasında daha hızlıdır (anında güncellenir).
                await rest.put(
                    Routes.applicationGuildCommands(client.config.clientId, client.config.guildId),
                    { body: commands },
                );
                console.log('✅ Komutlar sunucuya özel olarak yüklendi.');
            } else {
                // Guild ID yoksa global olarak yükle (Tüm sunucularda çalışır ama güncellenmesi 1 saati bulabilir)
                console.log('[UYARI] Guild ID ayarlanmamış, komutlar global olarak yüklenemedi.');
            }
        } catch (error) {
            console.error('❌ Komut yüklenirken hata oluştu:', error);
        }
    },
};
