import { useState } from 'react';
import styles from './Chat.module.css';
import { Box, Button, Input, Stack, Text } from '@chakra-ui/react';
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

function isFinalResponse(response: string) {
  const regex = /^[a-zA-Z]\./gm;
  return !regex.test(response);
}

function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [inputVisible, setInputVisible] = useState(true);

  async function handleSubmit(newChatHistory) {
    setThinking(true);
    const response = await fetch('/api/gpt3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory.concat(newChatHistory) }),
    });
    const data = await response.json();
    setFadeOut(true);

    const responseObject = {
      fullResponse: data.response,
      options: data.response.split('\n').filter(line => /^[a-zA-Z]\./.test(line)),
      message: data.response.replace(/^[a-zA-Z]\..*\n?/gm, ''),
    };

    setOptions(responseObject.options.length > 0 ? responseObject.options : []);
    setChatHistory([...newChatHistory, { role: 'assistant', content: responseObject.message }]);
    setInput('');

    if (isFinalResponse(responseObject.message)) {
      setInputVisible(true);
    } else {
      setFadeOut(false);
    }

    setThinking(false);
  }

  async function handleOptionClick(option) {
    const newChatHistory = [...chatHistory, { role: 'user', content: option }];
    setChatHistory(newChatHistory);
    await handleSubmit(newChatHistory);
  }

  return (
    <Box className={styles.chatContainer}>
      <Box>
        {chatHistory.slice(-1).map((msg, index) =>
          msg.role === 'assistant' ? (
            <Box key={index} className={styles.responseBox}>
              <Text>{msg.content}</Text>
            </Box>
          ) : null
        )}
      </Box>
      {inputVisible && (
        <Box
          className={`${styles.floatingInput} ${fadeOut ? styles.fadeOut : ''} ${chatHistory.length === 0 ? styles.centeredInput : ''
            }`}
          onAnimationEnd={() => setFadeOut(false)}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit([...chatHistory, { role: 'user', content: input }]);
              setThinking(true);
              if (chatHistory.length === 0) {
                setInputVisible(false);
              }
            }}
          >
            <div className={styles.inputGlow} style={{ opacity: thinking ? 1 : 0 }}></div>
            <Stack direction="row" spacing={3}>
              <Input
                className={styles.chatInput}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
              />
              <Button type="submit">Send</Button>
            </Stack>
          </form>
        </Box>
      )}
      <Box className={styles.optionsContainer}>
        {options.map((option, index) => (
          <Option key={index} option={option} onClick={() => {
            handleOptionClick(option);
            setOptions([]);
          }} />
        ))}
      </Box>
    </Box>
  );
}

export default Chat;