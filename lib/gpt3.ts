import axios from 'axios';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GPT3_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export async function getGpt3Response(messages) {
  const systemMessage = {
    role: 'system',
    content:
      'You are a helpful assistant. You are a building and permitting expert and your job is to help users know any and all permits or codes required to get the job done for their specific country and city. You answer as concise as possible. You will ask simple multiple choice questons in order to figure out the required codes and permits. You ask as little questions as possible. You always provide extra helpful tips and considerations once you are ready to provide the documentation for codes and permits.',
  };

  messages = [systemMessage, ...messages];
  
  // Add the custom instruction to the first user message
  if (messages.length > 1 && messages[1].role === 'user') {
    messages[1].content =
      "Reply with a multiple choice questions the options to choose from should each be on a new line and a lettered list for the user to reply to, continue ding this one question at a time until you are confident you know all the building prompts and codes required to complete the build project. You always format the answers to the questions specifically for the user to click one which will be sent back to you directly and following this format: A. Example reply 1 - then a new line - B. Example reply 2 - cont in that fashion " +
      messages[1].content;
  }

  const response = await axios.post(
    GPT3_API_ENDPOINT,
    { model: 'gpt-4', messages },
    { headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` } }
  );
  return response.data.choices[0].message.content;
}