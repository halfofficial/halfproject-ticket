// --- Gerekli Kütüphanelerin Dahil Edilmesi ---
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js'); // Discord.js kütüphanesini alıyoruz
const fs = require('fs'); // Dosya işlemleri için fs (File System) kütüphanesi
const path = require('path'); // Dosya yollarını yönetmek için path kütüphanesi
require('dotenv').config(); // .env dosyasındaki gizli verileri (Token) belleğe yükler

// --- Bot İstemcisinin (Client) Oluşturulması ---
const client = new Client({
    // Botun hangi "niyetlere" (intents) sahip olacağını belirtiyoruz.
    // Bu izinler botun hangi olayları görebileceğini belirler.
    intents: [
        GatewayIntentBits.Guilds, // Sunucu (Guild) ile ilgili temel olaylar
        GatewayIntentBits.GuildMessages, // Mesajları görme ve yönetme
        GatewayIntentBits.MessageContent, // Mesajların içeriğini okuma (Önemli!)
        GatewayIntentBits.GuildVoiceStates, // Ses kanallarındaki giriş/çıkışları takip etme
        GatewayIntentBits.GuildMembers // Üye katılımlarını görme
    ],
    // "Partials" eksik verileri tamamlamak için kullanılır (örneğin eski mesajlara tepki verilmesi).
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// --- Komut ve Ayar Yönetimi ---
client.commands = new Collection(); // Komutları hafızada tutmak için bir Discord Koleksiyonu oluştur
client.config = require('./config.js'); // config.js dosyasındaki ayarları yükle

// --- Yükleyici (Handler) Fonksiyonu ---
// Bu fonksiyon komutları ve olay dosyalarını otomatik olarak yükler.
const loadHandlers = () => {

    // 1. ADIM: Komutları (commands klasörü) Yükle
    const commandsPath = path.join(__dirname, 'commands'); // 'commands' klasörünün tam yolunu bul
    // Klasördeki sadece .js uzantılı dosyaları listele
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        // Her bir komut dosyasını tek tek oku
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        // Komut dosyasının içinde 'data' ve 'execute' kısımları var mı kontrol et
        if ('data' in command && 'execute' in command) {
            // Varsa komutu koleksiyona ekle
            client.commands.set(command.data.name, command);
            console.log(`[KOMUT] ${command.data.name} başarıyla yüklendi.`);
        } else {
            console.log(`[UYARI] ${filePath} dosyasında 'data' veya 'execute' eksik!`);
        }
    }

    // 2. ADIM: Olayları (events klasörü) Yükle
    const eventsPath = path.join(__dirname, 'events'); // 'events' klasörünün tam yolunu bul
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        // Her bir olay dosyasını oku
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        // Olay 'once' (bir kere) mi yoksa 'on' (her zaman) mı çalışacak?
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
        console.log(`[OLAY] ${event.name} olayı dinleniyor.`);
    }
};

// Fonksiyonu çalıştırarak yüklemeyi başlat
loadHandlers();

// --- Botu Başlatma ---
// .env dosyasındaki TOKEN ile Discord'a giriş yap
client.login(process.env.TOKEN);
