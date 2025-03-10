import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_API_KEY as string);
 
const safetySettings = [
   {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
  },
   {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
  },
   {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
  },
   {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export async function generateBlogPost(blogTitle: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" ,
  safetySettings
});

  const prompt = `Based on latest trend, Write a blog post about a ${blogTitle}.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}
