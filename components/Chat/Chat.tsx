import { useState } from 'react';
import styles from './Chat.module.css';
import { Box, Button, Input, Stack, Text } from '@chakra-ui/react';
import { getGpt3Response } from '../../lib/gpt3';
import React from 'react';

function Option({ option, onClick }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    onClick(option);
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
  };

  return (
    <Button
      size="sm"
      variant="outline"
      colorScheme="blue"
      onClick={handleClick}
      marginRight="4px"
      marginBottom="4px"
      className={clicked ? styles.optionClicked : ''}
    >
      {option}
    </Button>
  );
}

function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [hasMessageSent, setHasMessageSent] = useState(false);

  async function handleSubmit(newChatHistory) {
    setThinking(true);
    setFadeOut(false);
    try {
      const response = await fetch('/api/gpt3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory.concat(newChatHistory) }),
      });
      const data = await response.json();
      const responseObject = {
        fullResponse: data.response,
        options: data.response.split('\n').filter(line => /^[a-zA-Z]\./.test(line)),
        message: data.response.replace(/^[a-zA-Z]\..*\n?/gm, ''),
      };
      setOptions(responseObject.options.length > 0 ? responseObject.options : []);
      setChatHistory([...newChatHistory, { role: 'assistant', content: responseObject.message }]);
      if (responseObject.options.length === 0) {
        setInput('');
      }
    } catch (error) {
      console.error('Error fetching GPT-3 response:', error);
    }
    if (!hasMessageSent) {
      setHasMessageSent(true);
    } else {
      setInput('');
    }
    setThinking(false);
    setFadeOut(true);
  }

  async function handleOptionClick(option) {
    const newChatHistory = [...chatHistory, { role: 'user', content: option }];
    setChatHistory(newChatHistory);
    await handleSubmit(newChatHistory);
  }

  return (
    <Box className={styles.chatContainer}>
      {hasMessageSent ? (
        <>
          {chatHistory.length > 0 &&
            chatHistory.slice(-1).map((msg, index) => (
              <Box key={index} className={styles.responseBox}>
                <Text>{msg.content}</Text>
                <Box className={styles.optionsContainer}>
                  {options.map((option, index) => (
                    <Option
                      key={index}
                      option={option}
                      onClick={() => {
                        handleOptionClick(option);
                        setOptions([]);
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
        </>
      ) : null}
      <Box className={`${styles.floatingInput} ${thinking || options.length > 0 ? styles.fadeOut : ''} ${
          chatHistory.length === 0 ? styles.centeredInput : ''
        }`}
        onAnimationEnd={() => setFadeOut(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit([...chatHistory, { role: 'user', content: input }]);
          }}
        >
          <Stack direction="row" spacing={3}>
          <Input className={styles.chatInput} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..."/>
            <Button type="submit">Send</Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}

export default Chat;