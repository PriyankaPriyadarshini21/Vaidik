import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import * as ollama from 'ollama';
import 'dotenv/config';

// Define the generic response structure for legal document analysis
interface LegalAnalysis {
  keyClauses: Array<{ title: string; content: string; type: 'neutral' | 'positive' | 'negative' }>;
  strengths: string[];
  risks: string[];
  recommendations: string[];
  summary: string;
}

// OpenAI client initialization
const initOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }
  return new OpenAI({ apiKey });
};

// Anthropic client initialization
const initAnthropic = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key is required');
  }
  return new Anthropic({ apiKey });
};

// Analyze with OpenAI
const analyzeWithOpenAI = async (documentContent: string): Promise<LegalAnalysis> => {
  const openai = initOpenAI();
  
  const prompt = `
  You are a legal expert AI assistant. Analyze the following legal document and provide:
  
  1. A list of key clauses with their content and classification as positive, negative, or neutral
  2. Strengths of the document
  3. Potential risks or weaknesses
  4. Specific recommendations for improvement
  5. A brief summary
  
  Document to analyze:
  ${documentContent}
  
  Please structure your response in JSON format with the following schema:
  {
    "keyClauses": [
      { "title": "Clause Title", "content": "Brief description", "type": "positive/negative/neutral" }
    ],
    "strengths": ["strength1", "strength2", ...],
    "risks": ["risk1", "risk2", ...],
    "recommendations": ["recommendation1", "recommendation2", ...],
    "summary": "Brief overall summary"
  }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message.content;
    if (!content) {
      throw new Error('No content in response from OpenAI');
    }

    return JSON.parse(content) as LegalAnalysis;
  } catch (error: any) {
    console.error('OpenAI analysis error:', error);
    throw new Error(`OpenAI analysis failed: ${error.message}`);
  }
};

// Analyze with Anthropic Claude
const analyzeWithClaude = async (documentContent: string): Promise<LegalAnalysis> => {
  const anthropic = initAnthropic();
  
  const prompt = `
  You are a legal expert AI assistant. Analyze the following legal document and provide:
  
  1. A list of key clauses with their content and classification as positive, negative, or neutral
  2. Strengths of the document
  3. Potential risks or weaknesses
  4. Specific recommendations for improvement
  5. A brief summary
  
  Document to analyze:
  ${documentContent}
  
  Please structure your response in JSON format with the following schema:
  {
    "keyClauses": [
      { "title": "Clause Title", "content": "Brief description", "type": "positive/negative/neutral" }
    ],
    "strengths": ["strength1", "strength2", ...],
    "risks": ["risk1", "risk2", ...],
    "recommendations": ["recommendation1", "recommendation2", ...],
    "summary": "Brief overall summary"
  }
  
  Return only valid JSON without any other text.
  `;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      system: "You are a helpful legal expert AI assistant that always provides output as valid JSON.",
      messages: [{ role: 'user', content: prompt }],
    });

    // Get content from the first message and ensure it exists
    const contentBlock = message.content[0];
    if (!contentBlock || typeof contentBlock !== 'object' || !('text' in contentBlock)) {
      throw new Error('No valid content in response from Claude');
    }
    const content = contentBlock.text;

    return JSON.parse(content) as LegalAnalysis;
  } catch (error: any) {
    console.error('Claude analysis error:', error);
    throw new Error(`Claude analysis failed: ${error.message}`);
  }
};

// Analyze with Ollama (local)
const analyzeWithOllama = async (documentContent: string): Promise<LegalAnalysis> => {
  const ollamaEndpoint = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
  
  const prompt = `
  You are a legal expert AI assistant. Analyze the following legal document and provide:
  
  1. A list of key clauses with their content and classification as positive, negative, or neutral
  2. Strengths of the document
  3. Potential risks or weaknesses
  4. Specific recommendations for improvement
  5. A brief summary
  
  Document to analyze:
  ${documentContent}
  
  Please structure your response in JSON format with the following schema:
  {
    "keyClauses": [
      { "title": "Clause Title", "content": "Brief description", "type": "positive/negative/neutral" }
    ],
    "strengths": ["strength1", "strength2", ...],
    "risks": ["risk1", "risk2", ...],
    "recommendations": ["recommendation1", "recommendation2", ...],
    "summary": "Brief overall summary"
  }
  
  Return only valid JSON without any other text.
  `;

  try {
    // Use direct fetch to the Ollama API 
    const response = await fetch(`${ollamaEndpoint}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        messages: [{ role: 'user', content: prompt }],
      }),
    }).then(res => res.json());
    
    // Process API response
    if (response && response.message && response.message.content) {
      const content = response.message.content;
      
      // Extract JSON from the response if it's not properly formatted
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from Ollama response');
      }
      
      return JSON.parse(jsonMatch[0]) as LegalAnalysis;
    } else {
      throw new Error('Invalid response structure from Ollama API');
    }
  } catch (error: any) {
    console.error('Ollama analysis error:', error);
    
    // Provide a properly structured error response when API fails
    throw new Error(`Ollama analysis failed: ${error.message}`);
  }
};

// Main analysis function that selects the appropriate model
export const analyzeLegalDocument = async (
  documentContent: string, 
  model: 'openai' | 'claude' | 'ollama' = 'openai'
): Promise<LegalAnalysis> => {
  switch (model) {
    case 'openai':
      return await analyzeWithOpenAI(documentContent);
    case 'claude':
      return await analyzeWithClaude(documentContent);
    case 'ollama':
      return await analyzeWithOllama(documentContent);
    default:
      return await analyzeWithOpenAI(documentContent);
  }
};

// Function to extract text from PDF files (basic implementation)
export const extractTextFromPDF = async (filePath: string): Promise<string> => {
  try {
    // In a production environment, we would use a PDF parsing library like pdf-parse
    // For now, we're using a simple approach to handle the PDF content
    
    // Read the file as a string
    const fs = require('fs');
    const buffer = fs.readFileSync(filePath);
    
    // Basic extraction of text content from PDF buffer
    // This is a simplified approach and won't handle complex PDFs well
    let content = buffer.toString();
    
    // Try to extract text content between PDF markers
    // Remove binary content and PDF syntax as much as possible
    content = content.replace(/^\%PDF\-\d+\.\d+/, '');
    content = content.replace(/\%\%EOF.*$/s, '');
    
    // Extract text that looks like actual content (simplified)
    const textMatches = content.match(/\(([^\)]+)\)/g) || [];
    const extractedText = textMatches
      .map(match => match.slice(1, -1))
      .join(' ')
      .replace(/\\r|\\n/g, '\n')
      .replace(/\\\\/g, '\\')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')');
    
    if (extractedText.trim().length > 0) {
      return extractedText;
    }
    
    // If we couldn't parse meaningful content, return a simplified message
    // with the document name
    const fileName = filePath.split('/').pop() || '';
    return `Document: ${fileName}\n\nThis appears to be a PDF document that our system couldn't fully extract. The analysis will be based on available metadata and partial content.`;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return "Could not extract text from the PDF document.";
  }
};