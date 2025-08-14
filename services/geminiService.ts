import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, Source, Justification } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};

export const analyzeImageForLocation = async (imageFile: File): Promise<AnalysisResult> => {
    const base64Image = await fileToBase64(imageFile);

    const prompt = `You are a world-class expert in geographic location detection from images. Your task is to analyze the provided image and determine the most probable location where it was taken. Pay close attention to subtle, non-touristic clues.

Analyze the following categories of evidence:
- **Architectural Details:** Look for unique local features in buildings, like specific window frames, balcony railings, wall textures, roof styles, or materials.
- **Street and Infrastructure Elements:** Examine the details of the road, sidewalks, curbs, manhole covers, lampposts, trash cans, and traffic signs.
- **Natural and Botanical Elements:** Identify local plant species, planter styles, and typical landscaping or tree pruning methods.
- **Cultural and Other Clues:** Find clues in signage (language, fonts, names), vehicle models, license plate formats, and any other distinctive cultural markers.

Based on your comprehensive analysis, provide the determined location, your confidence level, and a detailed justification structured by the categories of evidence.`;

    const imagePart = {
        inlineData: {
            mimeType: imageFile.type,
            data: base64Image,
        },
    };

    const textPart = {
        text: prompt,
    };

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            location: {
                type: Type.STRING,
                description: "The most probable location (City, Country) where the image was taken. If unknown, state that it could not be determined."
            },
            confidence: {
                type: Type.STRING,
                description: "A percentage value representing the confidence in the location prediction (e.g., '85%'). If confidence is low, state 'Low'."
            },
            justification: {
                type: Type.ARRAY,
                description: "A list of evidence and justifications for the determined location, categorized by type.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        category: {
                            type: Type.STRING,
                            description: "The category of the evidence (e.g., 'Architectural Details', 'Street and Infrastructure Elements')."
                        },
                        details: {
                            type: Type.ARRAY,
                            description: "A list of specific details or observations within this category.",
                            items: {
                                type: Type.STRING
                            }
                        }
                    },
                    required: ["category", "details"]
                }
            }
        },
        required: ["location", "confidence", "justification"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                temperature: 0.2,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const text = response.text;
        const parsedJson = JSON.parse(text);

        const justification: Justification = {};
        if (parsedJson.justification && Array.isArray(parsedJson.justification)) {
            parsedJson.justification.forEach((item: { category: string; details: string[] }) => {
                if (item.category && item.details && item.details.length > 0) {
                    justification[item.category] = item.details;
                }
            });
        }
        
        const finalResult: AnalysisResult = {
            location: parsedJson.location || 'Location could not be determined.',
            confidence: parsedJson.confidence || 'Not specified',
            justification: justification,
            sources: [] // Sources are not available in JSON mode
        };
        
        if (finalResult.location === 'Location could not be determined.' && Object.keys(finalResult.justification).length === 0) {
            throw new Error('The AI did not return a valid analysis result.');
        }

        return finalResult;
    } catch (error) {
        console.error("Gemini API error:", error);
        if (error instanceof SyntaxError) {
            // JSON parsing error
             throw new Error("The AI returned an invalid response format. Please try again.");
        }
        throw new Error("An error occurred during image analysis. Please try again with a different image.");
    }
};