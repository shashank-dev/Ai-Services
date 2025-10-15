
import { GoogleGenAI, Modality } from "@google/genai";

interface ImageState {
    file: File;
    base64: string;
}

// Ensure the API key is available from environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey });

export async function generateBlendedImage(groupPhoto: ImageState, personPhoto: ImageState): Promise<string> {
  const model = 'gemini-2.5-flash-image';

  // Extract pure base64 data by splitting the data URL
  const getPureBase64 = (dataUrl: string) => dataUrl.split(',')[1];
  
  const groupPhotoData = getPureBase64(groupPhoto.base64);
  const personPhotoData = getPureBase64(personPhoto.base64);

  const prompt = `
    You are an expert photo editor. Your task is to seamlessly and realistically add the person from the second image into the group photo from the first image.

    **Instructions:**
    1.  Identify the person in the second image.
    2.  Integrate this person into the group photo (the first image).
    3.  The final result must look like a single, original photograph.
    4.  Pay close attention to and match the following aspects:
        *   **Lighting and Shadows:** The added person's lighting and shadows must match the ambient lighting of the group photo.
        *   **Scale and Proportion:** The person should be scaled appropriately relative to the others in the group.
        *   **Color Grading and Tone:** The colors and tone of the added person must blend perfectly with the group photo.
        *   **Image Quality:** Match the grain, noise, and sharpness of the original group photo.
    5.  The final output should ONLY be the newly generated blended image.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: groupPhotoData,
              mimeType: groupPhoto.file.type,
            },
          },
          {
            inlineData: {
              data: personPhotoData,
              mimeType: personPhoto.file.type,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
    }
    
    throw new Error("No image was generated in the API response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The AI model failed to process the images. Please try again with different photos.");
  }
}
