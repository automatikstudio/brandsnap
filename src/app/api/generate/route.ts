import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, industry, description, style } = body;

    if (!businessName || !description) {
      return NextResponse.json(
        { error: "Business name and description are required" },
        { status: 400 }
      );
    }

    const prompt = `You are a world-class brand identity designer. Generate a complete brand identity kit for the following business.

Business Name: ${businessName}
Industry: ${industry || "Not specified"}
Description: ${description}
Style Preference: ${style || "Modern"}

Generate a comprehensive brand kit and respond ONLY with valid JSON (no markdown, no code blocks) in this exact structure:

{
  "colors": [
    {
      "name": "Color name (e.g., 'Deep Ocean')",
      "hex": "#HEXCODE",
      "usage": "Brief usage description (e.g., 'Primary brand color for headers and CTAs')"
    }
  ],
  "fonts": {
    "heading": {
      "name": "Font name from Google Fonts",
      "weight": "e.g., Bold (700)",
      "style": "e.g., Sans-serif, modern and clean"
    },
    "body": {
      "name": "Font name from Google Fonts",
      "weight": "e.g., Regular (400)",
      "style": "e.g., Sans-serif, highly readable"
    },
    "reasoning": "Why these fonts pair well together and suit this brand"
  },
  "brandVoice": {
    "tone": "2-4 word tone description (e.g., 'Warm, Professional, Inviting')",
    "taglines": ["tagline1", "tagline2", "tagline3"],
    "description": "2-3 sentence description of the brand voice and how to use it"
  },
  "logoDirection": {
    "concept": "Detailed description of the logo concept",
    "style": "Description of the visual style (geometric, organic, typographic, etc.)",
    "elements": ["element1", "element2", "element3", "element4"]
  },
  "socialMedia": {
    "profileGuidelines": "How to apply the brand to profile images",
    "coverGuidelines": "How to apply the brand to cover/banner images",
    "colorApplications": [
      "Specific color application tip 1",
      "Specific color application tip 2",
      "Specific color application tip 3"
    ],
    "platforms": [
      { "name": "Instagram", "profileSize": "320x320px", "coverSize": "1080x1080px (feed)" },
      { "name": "Twitter/X", "profileSize": "400x400px", "coverSize": "1500x500px" },
      { "name": "LinkedIn", "profileSize": "400x400px", "coverSize": "1584x396px" },
      { "name": "Facebook", "profileSize": "170x170px", "coverSize": "820x312px" }
    ]
  }
}

Requirements:
- Generate exactly 5 colors that work harmoniously together
- Include a primary, secondary, accent, background/neutral, and text color
- All hex codes must be valid 6-digit hex colors
- Font names must be real Google Fonts
- Taglines should be creative and memorable
- Logo direction should be detailed enough for a designer to work from
- Tailor everything to the specific business and industry`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from AI");
    }

    // Parse the JSON response
    let brandKit;
    try {
      // Try to extract JSON from the response (in case it's wrapped in markdown)
      let jsonText = textContent.text.trim();
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
      brandKit = JSON.parse(jsonText);
    } catch {
      throw new Error("Failed to parse AI response as JSON");
    }

    return NextResponse.json(brandKit);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate brand kit. Please try again." },
      { status: 500 }
    );
  }
}
