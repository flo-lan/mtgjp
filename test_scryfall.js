const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('https://api.scryfall.com/cards/search?q=!"Lightning Bolt" lang:ja&include_multilingual=true');
    const cards = res.data.data;
    const jaCards = cards.filter(c => c.lang === 'ja');
    if (jaCards.length > 0) {
      console.log('Found JA card:', jaCards[0].name, jaCards[0].printed_name, jaCards[0].printed_text);
    } else {
      console.log('No JA card found');
    }
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}

test();
