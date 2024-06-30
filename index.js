const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
        executablePath: 'C:/Users/david/AppData/Local/Google/Chrome/Application/chrome.exe',
    }
});

client.once('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.initialize();

client.on('message_create', async (message) => {
  if (message.body === '#sticker') {
      if (message.hasMedia) {
          const mediaData = await message.downloadMedia();
          if (mediaData) {
              await client.sendMessage(message.from, mediaData, {
                  sendMediaAsSticker: true,
              });
              console.log('Sticker sent successfully!');
          } else {
              console.log('Error downloading media.');
          }
      } else if (message.hasQuotedMsg) {
          const quotedMessage = await message.getQuotedMessage();
          if (quotedMessage.hasMedia) {
              const quotedMediaData = await quotedMessage.downloadMedia();
              if (quotedMediaData) {
                  await client.sendMessage(message.from, quotedMediaData, {
                      sendMediaAsSticker: true,
                  });
                  console.log('Sticker sent successfully!');
              } else {
                  console.log('Error downloading quoted media.');
              }
          } else {
              console.log('No media found in the quoted message.');
          }
      } else {
          console.log('No media found in the message.');
      }
  }
});
