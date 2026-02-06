module.exports = {
    // 1. Botunuzun ID'si (Application ID)
    "clientId": "YOUR_CLIENT_ID_HERE",

    // 2. Sunucu ID'si (Guild ID)
    "guildId": "YOUR_GUILD_ID_HERE",

    // 3. Ticket Kategorisi ID'si
    "ticketCategory": "YOUR_TICKET_CATEGORY_ID_HERE",

    // 4. Arşiv Kategorisi ID'si (Opsiyonel)
    "archiveCategory": "YOUR_ARCHIVE_CATEGORY_ID_HERE",

    // 5. Transkript Log Kanalı ID'si
    "transcriptChannel": "YOUR_TRANSCRIPT_CHANNEL_ID_HERE",

    // 6. Genel Log Kanalı ID'si
    "logChannel": "YOUR_LOG_CHANNEL_ID_HERE",

    // 7. Sesli Destek Kanalı ID'si
    "voiceChannelId": "YOUR_VOICE_CHANNEL_ID_HERE",

    // 8. S.S.S. (Sıkça Sorulan Sorular) Kanal ID'si
    "faqChannelId": "SS-KANAL-ID",

    // 9. Rol ID'leri
    "roles": {
        "staff": "YOUR_STAFF_ROLE_ID_HERE",
        "admin": "YOUR_ADMIN_ROLE_ID_HERE"
    },

    // 10. Ses Dosyası Yolu
    "voiceMp3": "./audio.mp3",

    // 11. Tasarım Ayarları (Renkler)
    "colors": {
        "main": 0x2b2d31, // Discord'un kendi koyu gri/saydam rengi (Embed'ler için)
        "success": 0x2b2d31, // Başarılı işlemde de gri
        "error": 0x2b2d31  // Hatada da gri
    },

    // 12. Bilet Kategorileri (Buton Ayarları)
    "ticketCategories": {
        "general": {
            "id": "create_ticket_general",
            "label": "Genel Destek / General Support",
            "emoji": "🛠️",
            "style": "Secondary", // Gri (Saydam)
            "description": "Genel konular hakkında destek."
        },
        "technical": {
            "id": "create_ticket_technical",
            "label": "Teknik Destek / Technical Support",
            "emoji": "🔧",
            "style": "Secondary", // Gri (Saydam)
            "description": "Teknik sorunlar ve hatalar."
        },
        "sales": {
            "id": "create_ticket_sales",
            "label": "Satış Öncesi / Pre-Sales",
            "emoji": "💰",
            "style": "Secondary", // Gri (Saydam)
            "description": "Satış ve ödeme konuları."
        }
    },

    // 13. Panel Mesaj Ayarları (Düzenlenebilir Metinler)
    "messages": {
        "panelTitle": "Destek Merkezi / Support Center",
        "panelDescription": `
👋 **Merhaba! / Hello!**

> Bir destek talebi oluşturmak üzeresiniz. Lütfen aşağıdan ilgili kategoriyi seçin.
> \`You are about to create a support ticket. Please select the relevant category below.\`

👍 **Lütfen Unutmayın / Please Remember:**
• Gereksiz yere ticket açmaktan kaçının. (\`Avoid opening unnecessary tickets.\`)
• Yetkilileri etiketlemeyin, en kısa sürede dönüş yapılacaktır. (\`Do not tag staff; we will respond as soon as possible.\`)

✅ **Sıkça Sorulan Sorular / FAQ:**
Lütfen önce <#{faqChannelId}> kanalına göz atın.
\`Please check the <#{faqChannelId}> channel first.\`
        `,
        "ticketWelcome": `
👋 **Hoş Geldiniz! / Welcome!**

Talebiniz alınmıştır. Yetkililer en kısa sürede size dönüş yapacaktır.
\`Your request has been received. Staff will respond as soon as possible.\`

📌 **Kategori:** {category}
        `
    }
};
