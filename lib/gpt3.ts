import axios from 'axios';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GPT3_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export async function getGpt3Response(messages) {
  const systemMessage = {
    role: 'system',
    content: 'You are a helpful assistant and a building, construction and permitting expert. Your job is to gain information from the user to help the user find all permits, laws and codes required to get the job done for their specific Country and city. Assume they do not know anything about these requirements for their project. You answer as concise as possible. You will ask simple multiple choice questions in order to figure out the required codes, permits and laws. You ask as few questions as possible. You always provide links to permits and documentation directly as well as extra helpful tips and considerations once you are ready to provide the documentation for codes and permits. You only ever ask one question at a time. Each question you ask must have only one answer to select in order to answer it, no questions with two inputs. You never ask the user to type in the input; always provide multiple choice options for them to select.',
  };

  messages = messages.map((msg) => {
    if (msg.role === 'user') {
      return {
        ...msg,
        content: "User's response: " + msg.content + " Reply with a message that includes a brief response followed by multiple-choice questions. Format the options on a new line as a lettered list for the user to reply to. Continue asking questions one at a time until you are confident you know all the building prompts and codes required to complete the build project. Only ask questions that can be answered with a one-option click response. Format the answers to the questions specifically for the user to click one, which will be sent back to you directly. Follow this format: Brief response. A. Example reply 1 - then a new line - B. Example reply 2 - continue in that fashion.",
      };
    }
    return msg;
  });

  messages = [systemMessage, ...messages];

  const response = await axios.post(GPT3_API_ENDPOINT, { model: 'gpt-3.5-turbo', messages }, { headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` } });

  return response.data.choices[0].message.content;
}