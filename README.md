# BuildMate.co

BuildMate.co is a web application designed to help users determine the necessary codes and permits for their construction projects. The app uses OpenAI's GPT-3.5 Turbo or GPT-4 to interact with the user through a chat interface, asking multiple-choice questions to gather information about the user's project and location. Once the app has enough information, it provides the user with links to permits, documentation, and additional helpful tips.

## Features

- Chat interface for user interaction
- GPT-3.5 Turbo or GPT-4 powered assistant
- Multiple-choice questions for easy user input
- Provides links to permits, documentation, and helpful tips

## Technologies Used

- Next.js
- TypeScript
- Chakra UI
- OpenAI API

## Project Structure

- `components`: Contains the Chat and Layout components
- `lib`: Contains the GPT-3 API integration
- `pages`: Contains the main page (index.tsx) and the API route for GPT-3 (api/gpt3.ts)
- `styles`: Contains global CSS styles
- `public`: Contains the favicon

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your `.env.local` file with your OpenAI API key
4. Run the development server: `npm run dev`
5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Type your construction project query in the chat input field
2. The assistant will ask multiple-choice questions to gather information about your project and location
3. Click on the appropriate option to answer the questions
4. Once the assistant has enough information, it will provide you with links to permits, documentation, and helpful tips
```

If you have any further questions or need clarification on any aspect of the project, please let me know.