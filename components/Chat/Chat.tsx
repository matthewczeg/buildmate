import { useState, useEffect } from 'react';
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

function AssistantMessage({ message }) {
  return (
    <Box className={styles.responseBox}>
      <Text>{message}</Text>
    </Box>
  );
}

function isFinalResponse(response) {
  const regex = /^[a-zA-Z]\./gm;
  return !regex.test(response);
}

function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [inputVisible, setInputVisible] = useState(true);

  useEffect(() => {
    setInputVisible(chatHistory.length === 0);
  }, [chatHistory]);

  async function handleSubmit(newChatHistory) {
    setThinking(true);
    setInputVisible(false);
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
    setInput('');
    setInputVisible(true);
    setThinking(false);
  }

  interface OptionProps {
    option: string;
    onClick: (option: string) => void;
  }

  function Option({ option, onClick }: OptionProps) {
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

  async function handleOptionClick(option) {
    const newChatHistory = [...chatHistory, { role: 'user', content: option }];
    setChatHistory(newChatHistory);
    await handleSubmit(newChatHistory);
  }

  return (
    <Box className={styles.chatContainer}>
      <Box>
        {chatHistory.slice(-1).map((msg, index) => msg.role === 'assistant' && <AssistantMessage key={index} message={msg.content} />)}
      </Box>
      <Box
        className={`${styles.floatingInput} ${chatHistory.length === 0 ? '' : styles.chatInputNotCentered}`}
        onAnimationEnd={() => setThinking(false)}
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit([...chatHistory, { role: 'user', content: input }]);
            setThinking(true);
          }}
        >
          <div className={styles.inputGlow} style={{ opacity: thinking ? 1 : 0 }}></div>
          <Stack direction="row" spacing={3}>
            <Input
              className={styles.chatInput}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              isDisabled={!inputVisible}
            />
            <Button type="submit" isDisabled={!inputVisible}>
              Send
            </Button>
          </Stack>
        </form>
      </Box>
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