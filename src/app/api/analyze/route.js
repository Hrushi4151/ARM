import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'No text content provided' }, 
        { status: 400 }
      );
    }

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });
      
      const prompt = `
        As an AI requirements analyst, analyze the following document and create a detailed Software Requirements Specification (SRS). 
        Please structure your response in the following format:

        1. Executive Summary (brief overview)
        2. Functional Requirements
           - List each requirement with priority (High/Medium/Low)
           - Include acceptance criteria for each requirement
        3. Non-Functional Requirements
           - Performance requirements
           - Security requirements
           - Scalability requirements
           - Other technical constraints
        4. Constraints and Assumptions
        5. Dependencies

        separator 
        > RTM - Requirement Traceability Matrix

        separator
        > Priority - High/Medium/Low

        Please be specific and detailed in the analysis. Format the output in a clear, readable structure and use bullets.

        Document content to analyze:
        ${text}
      `.trim();

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return NextResponse.json({ analysis: response.text() });
    } catch (error) {
      console.error('Error generating analysis:', error);
      return NextResponse.json(
        { error: 'Failed to analyze document content. Please try again.' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' }, 
      { status: 500 }
    );
  }
} 