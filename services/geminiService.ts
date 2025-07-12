
import { GoogleGenAI } from "@google/genai";
import { BannerSettings } from '../types';
import { PREDEFINED_EMAIL } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real deployed environment,
  // the key should be set. We'll proceed with a mock response if no key is found.
  console.warn("API_KEY environment variable not set. Gemini API calls will be mocked.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const sendEmailConfirmation = async (userEmail: string, settings: BannerSettings): Promise<string> => {
  if (!ai) {
    return Promise.resolve(`
      **Email Simulation (No API Key)**
      
      **To User (${userEmail}):**
      Subject: Your Banner Preview
      
      Hi,
      
      Thank you for using the Banner Generator! Your preview is attached.
      The final PDF and SVG files have been sent to our design team for processing.
      
      Best regards,
      The Banner Generator Team
      
      **To Developer (${PREDEFINED_EMAIL}):**
      Subject: New Banner Request
      
      A new banner has been generated with the following settings:
      - Dimensions: ${settings.width}mm x ${settings.height}mm
      - Background: ${settings.backgroundColor.name}
      - Text Color: ${settings.textColor.name}
      - Font: ${settings.font.name}
      - Text: "${settings.textLines.join(' | ')}"
    `);
  }

  const { width, height, backgroundColor, textColor, font, textLines } = settings;
  
  const prompt = `
    You are an automated notification system for a "PDF/SVG Banner Generator" web app.
    A user has just created a banner and requested an email confirmation.
    The user's email is "${userEmail}".
    The banner details are:
    - Dimensions: ${width}mm x ${height}mm
    - Background Color: ${backgroundColor.name}
    - Text Color: ${textColor.name}
    - Font: ${font.name}
    - Text Lines: ${textLines.map(line => `"${line}"`).join(', ')}

    Your task is to generate a concise, friendly, and professional plain text confirmation message that would be sent to the user.
    The message should confirm that their preview has been "sent" and that the final PDF/SVG files have been forwarded to the developer at "${PREDEFINED_EMAIL}".
    Do not add any preamble like "Here is the confirmation message:". Just generate the text of the email body.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate email confirmation from AI.");
  }
};
