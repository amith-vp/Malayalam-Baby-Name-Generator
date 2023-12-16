addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const apiKey = 'GEMINI-API-KEY';
  const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey;

  // Extract parameters from the URL
  const url = new URL(request.url);
  const gender = url.searchParams.get('gender');
  const theme = url.searchParams.get('theme');

  const requestBody = {
    "contents": [
      {
        "parts": [
          {
            "text": `You are an AI designed to generate Malayalam names. Your mission is to craft modern ,unique Malayalam first names tailored for ${gender} with the captivating theme of ${theme}. Generate Malayalam names that match the theme. Generated Names: (Print only names in English separated by commas)\n`
          }
        ]
      }
    ],
    "generationConfig": {
      "temperature": 0.9,
      "topK": 1,
      "topP": 1,
      "maxOutputTokens": 2048,
      "stopSequences": []
    },
    "safetySettings": [
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };
  console.log(requestBody.contents[0].parts);
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const responseData = await response.json();
  const generatedNames = responseData.candidates[0].content.parts[0].text.split(',').map(name => name.trim());
  return new Response(JSON.stringify(generatedNames), {
    statusText: "OK",
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  });
}
