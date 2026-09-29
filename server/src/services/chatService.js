import { query } from '../config/db.js';
import { config } from '../config/env.js';

export async function processChatRequest(userMessage) {
  const msg = (userMessage || '').toLowerCase().trim();

  // 1. If AI Provider API Key is configured and provider is gemini/openai
  if (config.aiApiKey && config.aiApiKey.length > 10 && config.aiProvider !== 'faq') {
    try {
      if (config.aiProvider === 'gemini') {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.aiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `You are Exploria AI, a helpful tourism and adventure travel guide assistant. Answer this query concisely: ${userMessage}` }] }]
            })
          }
        );
        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return { reply, source: 'Gemini AI' };
        }
      }
    } catch (err) {
      console.warn('[ChatService] AI Provider call failed. Falling back to local tourism intelligence.');
    }
  }

  // 2. Intelligent Tourism FAQ & Database Query Engine
  if (msg.includes('weather') || msg.includes('temperature') || msg.includes('forecast')) {
    return {
      reply: "You can check live weather forecast for any destination on our dedicated Weather page! We provide temperature, humidity, wind speeds, and best travel season advice.",
      suggestedActions: ['Check Live Weather', 'View Destinations']
    };
  }

  if (msg.includes('manali') || msg.includes('himachal')) {
    return {
      reply: "Manali is best visited between October and May. Our top package is the 'Ultimate Alpine Manali Adventure & Hampta Trek' featuring paragliding, high altitude trekking, and camping!",
      suggestedActions: ['View Manali Packages', 'Match Local Guide']
    };
  }

  if (msg.includes('goa') || msg.includes('scuba') || msg.includes('beach')) {
    return {
      reply: "Goa is perfect for underwater diving and sun-soaked beaches! Check out our 'Goa Sun, Sea & Scuba Discovery Expedition' (4 Days) with certified PADI dive masters.",
      suggestedActions: ['View Goa Packages', 'View Scuba Adventures']
    };
  }

  if (msg.includes('guide') || msg.includes('hire') || msg.includes('contact a guide')) {
    return {
      reply: "You can match with verified local guides based on area expertise, language, ratings, and activities! Go to our 'Guides' tab or click 'Find Guide' on any destination page.",
      suggestedActions: ['Find a Local Guide', 'Post Guide Request']
    };
  }

  if (msg.includes('book') || msg.includes('booking') || msg.includes('reserve')) {
    return {
      reply: "Booking is simple! Select your desired package, choose travel dates and number of travelers, optional local guide, and complete the instant test checkout.",
      suggestedActions: ['Browse Adventure Packages', 'My Bookings']
    };
  }

  if (msg.includes('beginner') || msg.includes('easy')) {
    return {
      reply: "For beginners, we recommend Goa Scuba Discovery, Kerala Backwaters Cruise, or Jaisalmer Desert Camping. All include full safety gear and certified instructors.",
      suggestedActions: ['View Easy Packages', 'Filter Packages']
    };
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return {
      reply: "Hello! Welcome to Exploria – Smart Tourism & Adventure Platform. How can I assist your travel plans today?",
      suggestedActions: ['Top Destinations', 'Popular Packages', 'Find a Guide', 'Check Weather']
    };
  }

  // Fetch top 2 recommended packages dynamically from database
  const packages = await query('SELECT id, title, price, duration_days FROM packages ORDER BY rating DESC LIMIT 2');
  const pkgList = packages.map(p => `• ${p.title} (${p.duration_days} Days - $${p.price})`).join('\n');

  return {
    reply: `I can help you discover destinations, check weather, connect with certified local guides, or book adventure packages! Popular packages right now:\n\n${pkgList}`,
    suggestedActions: ['Explore Packages', 'Match Guide', 'Contact Support']
  };
}
