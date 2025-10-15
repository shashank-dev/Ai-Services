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

export async function generateBlendedImage(
  groupPhoto: ImageState,
  personPhoto: ImageState,
  resolution: string,
  aspectRatio: string
): Promise<string> {
  const model = 'gemini-2.5-flash-image';

  // Extract pure base64 data by splitting the data URL
  const getPureBase64 = (dataUrl: string) => dataUrl.split(',')[1];
  
  const groupPhotoData = getPureBase64(groupPhoto.base64);
  const personPhotoData = getPureBase64(personPhoto.base64);

  const resolutionMap: { [key: string]: string } = {
    'standard': 'Generate the final image at a standard resolution (approximately 1024x1024 pixels). This is suitable for web and social media.',
    'hd': 'Generate the final image at a High Definition (HD) resolution (approximately 2048x2048 pixels). This is good for high-quality viewing and small prints.',
    'ultra_hd': 'Generate the final image at an Ultra High Definition (Ultra HD/4K) resolution (approximately 4096x4096 pixels) for maximum detail. This is best for large prints and high-resolution displays.'
  };

  const resolutionInstruction = resolutionMap[resolution] || resolutionMap['standard'];

  const aspectRatioMap: { [key: string]: string } = {
    'Auto': 'Determine the most appropriate aspect ratio automatically based on the group photo and the composition to ensure the most natural result.',
    'Square': 'Generate the final image with a square aspect ratio (1:1).',
    'Portrait': 'Generate the final image with a portrait aspect ratio (3:4).',
    'Landscape': 'Generate the final image with a landscape aspect ratio (4:3).'
  };

  const aspectRatioInstruction = aspectRatioMap[aspectRatio] || aspectRatioMap['Auto'];

  const prompt = `
    You are an expert photo editor with a keen eye for realism and composition. Your task is to seamlessly and realistically add the person from the second image into the group photo from the first image, making it look like they were there from the beginning.

    **Instructions:**
    1.  **Identify the Person:** Isolate the main person from the second image, using their appearance as a reference.
    2.  **Find a Natural Placement:** Analyze the composition of the group photo and find the most natural, believable position to add the person. They should fit into the group's arrangement logically.
    3.  **Generate a Context-Aware Pose:** This is crucial. Analyze the group's activity and posture. Instead of just pasting the person, you must **generate** them with a new pose that fits the scene perfectly. For example, if the group is sitting, render the added person in a natural sitting position. If the group is celebrating, render them with a celebratory pose. The goal is for them to look like they are a participant, not just an addition.
    4.  **Intelligent Placement (Do Not Obscure):** You MUST place the person in a plausible empty space. Avoid covering up the faces or key features of anyone already in the photo. A small, natural overlap (like a shoulder behind another person) is acceptable if it enhances realism, but do not obscure any person's face or body in a significant way.
    5.  **Integrate Realistically:** The final result must look like a single, original photograph. To achieve this, you must meticulously match the following aspects:
        *   **Lighting and Shadows:** The added person's lighting direction, intensity, and color must perfectly match the ambient lighting of the group photo. Cast realistic shadows on the person and from the person onto the environment.
        *   **Scale and Proportion:** The person must be scaled to the correct size relative to the other people and objects in the group photo. Consider perspective.
        *   **Color Grading and Tone:** The color temperature, saturation, and contrast of the added person must blend flawlessly with the overall tone of the group photo.
        *   **Image Quality and Focus:** Match the grain, noise, sharpness, and depth of field of the original group photo. If the background is blurry, the added person should have a matching level of focus.
    6.  **Output Resolution:** ${resolutionInstruction}
    7.  **Output Aspect Ratio:** ${aspectRatioInstruction}
    8.  **Final Output:** The output should ONLY be the newly generated blended image, with no text or borders.
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
    throw new Error("The AI failed to process the images. This can happen due to poor image quality, network issues, or content restrictions. Please try again with different photos.");
  }
}