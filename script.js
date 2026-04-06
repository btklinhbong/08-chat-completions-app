// Get references to the DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

// Keep the full conversation so each API call includes previous messages
const conversationHistory = [
  {
    role: 'system',
    content: `You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination.

If a user's query is unrelated to budget travel, respond by stating that you do not know.
`
  }
];

async function main() {
  // Send a POST request to the OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', // We are POST-ing data to the API
    headers: {
      'Content-Type': 'application/json', // Set the content type to JSON
      'Authorization': `Bearer ${apiKey}` // Include the API key for authorization
    },
    // Send model details and system message
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: conversationHistory
    })
  });
  // Parse and store the response data
  const result = await response.json();
  const assistantMessage = result.choices[0].message.content;

  // Save the assistant's reply so future requests include it
  conversationHistory.push({ role: 'assistant', content: assistantMessage });

  // Show the AI response in the page
  responseContainer.textContent = assistantMessage;
}

// Run when the user submits the form
chatForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  
  const prompt = userInput.value.trim();

  // Avoid sending empty prompts
  if (!prompt) {
    responseContainer.textContent = 'Please enter a travel question first.';
    return;
  }

  // Save the user message before sending the request
  conversationHistory.push({ role: 'user', content: prompt });

  // Clear the input right after submit
  userInput.value = '';

  responseContainer.textContent = 'Thinking...';
  await main();
});