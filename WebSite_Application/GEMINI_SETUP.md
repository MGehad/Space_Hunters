# Google Gemini API Integration Setup

This document provides instructions for setting up the Google Gemini API integration in the NASA Space Biology App.

## Prerequisites

1. **Google AI Studio Account**: You need access to Google AI Studio to get an API key
2. **Node.js**: Ensure you have Node.js installed (version 16 or higher)
3. **npm or pnpm**: Package manager for installing dependencies

## Setup Instructions

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

1. Create a `.env.local` file in the root directory of your project:

   ```bash
   touch .env.local
   ```

2. Add your Gemini API key to the `.env.local` file:

   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```

   **Important**: Replace `your_actual_api_key_here` with your actual API key from Google AI Studio.

### 3. Install Dependencies

The Gemini SDK has already been installed. If you need to reinstall:

```bash
npm install @google/generative-ai
```

### 4. Verify Setup

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Test the following features:
   - **Publications Page**: Search and filter publications
   - **Publication Details**: View detailed information about a publication
   - **Chat Feature**: Ask questions about publications
   - **Knowledge Gaps**: View AI-identified research gaps
   - **Data Integrations**: See available data sources

## Features Powered by Gemini API

### 1. Dynamic Publications

- **Search**: Intelligent search across space biology publications
- **Filtering**: Category-based filtering with relevant results
- **Details**: Complete publication information including abstracts, authors, and metadata

### 2. AI Chat Assistant

- **Publication Discussion**: Ask questions about specific publications
- **Context-Aware**: Understands the publication context
- **Research Insights**: Provides insights on methodology, findings, and implications

### 3. Knowledge Gap Analysis

- **Gap Identification**: AI identifies current research gaps in space biology
- **Priority Assessment**: Categorizes gaps by research priority
- **Research Suggestions**: Provides recommendations for future research

### 4. Data Integration Management

- **Source Discovery**: Identifies relevant data sources
- **Status Monitoring**: Tracks integration status and data availability
- **API Endpoints**: Provides connection information for data sources

## Fallback Behavior

If no API key is provided or the API is unavailable, the application will:

- Use mock data for all features
- Display the same UI with static content
- Maintain full functionality for testing and development

## API Usage and Limits

- **Free Tier**: Google AI Studio provides a generous free tier
- **Rate Limits**: Be aware of API rate limits for production use
- **Caching**: The app implements intelligent caching to minimize API calls
- **Error Handling**: Robust error handling ensures the app remains functional

## Troubleshooting

### Common Issues

1. **API Key Not Working**

   - Verify the API key is correct
   - Check that the `.env.local` file is in the root directory
   - Ensure the environment variable name is exactly `NEXT_PUBLIC_GEMINI_API_KEY`

2. **No Data Loading**

   - Check browser console for error messages
   - Verify internet connection
   - Confirm API key has proper permissions

3. **Slow Response Times**
   - This is normal for AI-generated content
   - The app shows loading states during API calls
   - Consider upgrading to a paid plan for faster responses

### Debug Mode

To enable debug logging, add this to your `.env.local`:

```env
NEXT_PUBLIC_DEBUG=true
```

## Security Notes

- **Environment Variables**: Never commit your `.env.local` file to version control
- **API Key Protection**: The API key is exposed in the client-side code (required for Gemini SDK)
- **Production Deployment**: Consider using server-side API routes for production to protect your API key

## Production Deployment

For production deployment:

1. Set the environment variable in your hosting platform
2. Consider implementing server-side API routes to protect your API key
3. Monitor API usage and costs
4. Implement additional rate limiting if needed

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key is valid and has proper permissions
3. Review the Google AI Studio documentation
4. Check the application logs for detailed error information
