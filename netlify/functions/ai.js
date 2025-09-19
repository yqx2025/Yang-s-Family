const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.GPT5_API_KEY || process.env.AI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: 'Missing API key' };
    }

    const { prompt, context } = JSON.parse(event.body || '{}');
    if (!prompt) {
      return { statusCode: 400, body: 'Missing prompt' };
    }

    const payload = {
      model: 'gpt-5',
      messages: [
        { role: 'system', content: '你是一个精通传统文化的小六壬与八字解读助手，请以温和、简洁、尊重的语气提供娱乐性建议，不涉及医疗、法律、金融等严肃结论。' },
        { role: 'user', content: `${prompt}\n\n上下文: ${JSON.stringify(context || {}, null, 2)}` }
      ],
      temperature: 0.7,
      max_tokens: 600
    };

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: resp.status, body: text };
    }

    const data = await resp.json();
    const answer = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || '';

    return { statusCode: 200, body: JSON.stringify({ answer }) };
  } catch (e) {
    return { statusCode: 500, body: `Server error: ${e.message}` };
  }
};
