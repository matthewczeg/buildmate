import { useState } from 'react';
import styles from './Chat.module.css';
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { getGpt3Response } from '../../lib/gpt3';
import React from 'react';

function Option({ option, onClick }) {
  return (
    <Button
      size="sm"
      variant="outline"
      colorScheme="blue"
      onClick={() => onClick(option)}
      marginRight="4px"
      marginBottom="4px"
    >
      {option}
    </Button>
  );
}

function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    setChatHistory([...chatHistory, { role: 'user', content: input }]);
    try {
      const response = await fetch('/api/gpt3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatHistory, { role: 'user', content: input }] }),
      });
      const data = await response.json();
      const newOptions = data.response.split('\n').filter(line => /^[a-zA-Z]\./.test(line));
      setOptions(newOptions);
      setChatHistory([
        ...chatHistory,
        { role: 'user', content: input },
        { role: 'assistant', content: data.response.replace(/^[a-zA-Z]\..*\n?/gm, '') },
      ]);
    } catch (error) {
      console.error('Error fetching GPT-3 response:', error);
    }
    setInput('');
  }

  function handleOptionClick(option) {
    setInput(option);
    handleSubmit({ preventDefault: () => {} });
  }

  return (
    <Box className={styles.chatContainer}>
      <Stack spacing={3}>
        {chatHistory.map((msg, index) => (
          <Text
            key={index}
            className={
              msg.role === 'user'
                ? styles.userMessage
                : styles.assistantMessage
            }
          >
            {msg.content}
          </Text>
        ))}
        <Box display="flex" flexWrap="wrap">
          {options.map((option, index) => (
            <Option key={index} option={option} onClick={handleOptionClick} />
          ))}
        </Box>
        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={3}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <Button type="submit">Send</Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}

export default Chat;