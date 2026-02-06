# 🎫 Advanced Discord Ticket Bot (v14)

![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=for-the-badge&logo=node.js&logoColor=white)

[🇹🇷 Türkçe](#tü-türkçe-kurulum-rehberi) | [🇺🇸 English](#us-english-installation-guide)

---

## <a name="tr"></a>🇹🇷 Türkçe Kurulum Rehberi

Bu proje, Discord sunucunuz için gelişmiş, ses destekli ve kategori bazlı bir destek (ticket) botudur. Tamamen **Node.js** ve **Discord.js v14** kullanılarak yazılmıştır.

### ✨ Özellikler
*   **Kategorili Destek:** Genel, Teknik ve Satış olmak üzere 3 farklı kategori.
*   **Sesli Destek:** Ses kanalına giren kullanıcılar için otomatik bilet oluşturur.
*   **Tek Renk Tema:** Şık, minimalist, koyu gri (saydam) tasarım.
*   **HTML Transkript:** Kapatılan biletlerin dökümünü HTML dosyası olarak kaydeder.
*   **Gelişmiş Loglama:** Bilet açma, kapatma, sahiplenme ve kişi ekleme/çıkarma işlemleri loglanır.
*   **Kişi Sınırı:** Bir kullanıcının aynı anda sadece 1 açık bileti olabilir.
*   **Kolay Ayarlama:** Tüm metinler, renkler ve emojiler `config.js` üzerinden düzenlenebilir.

### 🚀 Kurulum Adımları

1.  **Projeyi İndirin:** Bu dosyaları bilgisayarınıza indirin veya klonlayın.
2.  **Modülleri Yükleyin:** Proje klasöründe bir terminal açın ve şunu yazın:
    ```bash
    npm install
    ```
3.  **Ayarları Yapın (`config.js`):**
    *   `config.js` dosyasını açın.
    *   `clientId`, `guildId`, `ticketCategory` ve Rol ID'lerinizi (`staff`, `admin`) eksiksiz doldurun.
    *   Log ve Transkript kanallarının ID'lerini girin.
4.  **Gizli Anahtarı Girin (`.env`):**
    *   `.env` dosyasını açın (yoksa oluşturun).
    *   Bot Tokeninizi şu şekilde ekleyin:
    ```env
    TOKEN=BURAYA_BOT_TOKENI_GELECEK
    ```
5.  **Ses Dosyası (Opsiyonel):**
    *   Sesli destek özelliği için proje ana dizinine `audio.mp3` adında bir ses dosyası koyun.
6.  **Botu Başlatın:**
    ```bash
    node .
    ```

### 🎮 Kullanım
*   **/setup-panel:** Destek panelini (butonları) kanala kurar.
*   **/add [kullanıcı]:** Bilete başka bir kullanıcıyı ekler.
*   **/remove [kullanıcı]:** Biletten kullanıcı çıkarır.
*   **/priority [seviye]:** Biletin aciliyet durumunu (Standart/Yüksek/Acil) değiştirir.

---

## <a name="en"></a>🇺🇸 English Installation Guide

This is an advanced, voice-supported, and category-based ticket bot for Discord servers. Written entirely in **Node.js** and **Discord.js v14**.

### ✨ Features
*   **Categorized Support:** General, Technical, and Pre-Sales categories.
*   **Voice Support:** Automatically creates a ticket when a user joins the support voice channel.
*   **Monochrome Theme:** Sleek, minimalist, dark gray (transparent) design.
*   **HTML Transcripts:** Saves closed ticket logs as HTML files.
*   **Advanced Logging:** Logs ticket creation, closure, claiming, and user management.
*   **Ticket Limit:** Users can only have 1 open ticket at a time.
*   **Easy Config:** Edit all texts, colors, and emojis via `config.js`.

### 🚀 Setup Steps

1.  **Download:** Download or clone this repository.
2.  **Install Dependencies:** Open a terminal in the project folder and run:
    ```bash
    npm install
    ```
3.  **Configuration (`config.js`):**
    *   Open `config.js`.
    *   Fill in `clientId`, `guildId`, `ticketCategory`, and Role IDs (`staff`, `admin`).
    *   Enter the Channel IDs for Logs and Transcripts.
4.  **Environment Variables (`.env`):**
    *   Open `.env` (create one if it doesn't exist).
    *   Add your Bot Token:
    ```env
    TOKEN=YOUR_BOT_TOKEN_HERE
    ```
5.  **Audio File (Optional):**
    *   Place an `audio.mp3` file in the root directory for the voice support feature.
6.  **Start the Bot:**
    ```bash
    node .
    ```

### 🎮 Commands
*   **/setup-panel:** Sets up the support panel buttons in the channel.
*   **/add [user]:** Adds a user to the ticket.
*   **/remove [user]:** Removes a user from the ticket.
*   **/priority [level]:** Changes the ticket priority level (Standard/High/Urgent).

---

### ⚠️ Requirements
*   Node.js 16.9.0 or higher
*   FFmpeg (for voice support - usually handled by `ffmpeg-static`)

---

### ⛔ LİSANS VE KULLANIM HAKLARI (LICENSE)

> [!CAUTION]
> **BU PROJE DAĞITIMA VE SATIŞA KAPALIDIR.**
> **THIS PROJECT IS NOT OPEN FOR DISTRIBUTION OR SALE.**

Bu projeyi GitHub üzerinden indiren herkes aşağıdaki şartları kabul etmiş sayılır:

✅ **Yapabilecekleriniz (You Can):**
*   Kodları inceleyebilir ve eğitim amacıyla kullanabilirsiniz.
*   Botu kendi **kişisel** Discord sunucunuzda kurup kullanabilirsiniz.
*   Kendi kullanımınız için kodlarda değişiklik yapabilirsiniz.

❌ **YAPAMAYACAKLARINIZ (You CANNOT):**
*   Bu projeyi veya kodlarını **başka bir yerde paylaşamazsınız.**
*   Bu projeyi **satamaz, kiralayamaz veya ticari bir ürünün parçası yapamazsınız.**
*   "Ben yaptım" diyerek dağıtamazsınız.

Detaylı bilgi için `LICENSE` dosyasına bakınız.
*For detailed terms, please refer to the `LICENSE` file.*
