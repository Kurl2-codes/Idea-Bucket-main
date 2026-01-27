import google.generativeai as genai
from app.core.config import settings
import json

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # Priority list of models to try
        self.model_candidates = [
            'gemini-2.0-flash-exp',
            'gemini-1.5-flash',
            'gemini-1.5-flash-001',
            'gemini-1.5-flash-002',
            'gemini-1.5-flash-8b',
        ]
        self.model = None

    async def analyze_idea(self, content: str, image_datas: list = []) -> dict:
        # Lazy initialization / Runtime check to find working model
        if not self.model:
            print("Attempting to find a working Gemini model...")
            for model_name in self.model_candidates:
                try:
                    # Test the model with a simple prompt
                    test_model = genai.GenerativeModel(model_name)
                    # We won't actually generate here to save latency, just bind it
                    # But if we were really paranoid we could generate a 1-token response
                    # For now, let's just set it and let the generate call below try it
                    self.model = test_model
                    print(f"Selected model alias: {model_name}")
                    break 
                except Exception as e:
                    print(f"Model alias {model_name} failed init: {e}")
            
            if not self.model:
                # Default fallback
                self.model = genai.GenerativeModel('gemini-1.5-flash')

        try:
            prompt = f"""
            You are an intelligent workspace assistant. Extract a professional title, a descriptive category, and relevant tags from the content provided. Be concise and accurate.
            
            Analyze the following user input and images to generate a title, category, and tags.
            User Input: {content}
            
            Return JSON with keys: title, category, tags.
            """
            
            parts = [prompt]
            
            # Handle Images if present (convert base64 to parts)
            if image_datas:
                 try:
                     import base64
                     for img_b64 in image_datas:
                         # Strip header if present (e.g. data:image/png;base64,...)
                         if "," in img_b64:
                             img_b64 = img_b64.split(",")[1]
                             
                         image_data = base64.b64decode(img_b64)
                         parts.append({
                             "mime_type": "image/png", # Default assumption, or detect from header
                             "data": image_data
                         })
                 except Exception as img_err:
                     print(f"Failed to process image for Gemini: {img_err}")
            
            # Try to generate content, iterating through models if 404 occurs
            response = None
            last_error = None
            
            # If we already picked a model, try it first. If it fails, try others.
            # We recreate the list starting with current choice to prioritize stability
            current_model_name = self.model.model_name.replace('models/', '') if self.model else self.model_candidates[0]
            
            # Create a dynamic list starting with our best guess
            attempt_order = [current_model_name] + [m for m in self.model_candidates if m != current_model_name]
            
            for model_name in attempt_order:
                try:
                    active_model = genai.GenerativeModel(model_name)
                    try:
                        response = active_model.generate_content(parts, generation_config={"response_mime_type": "application/json"})
                    except:
                        # Fallback: standard text generation without config
                        response = active_model.generate_content(parts)
                        
                    # If successful, save this model for next time and break
                    self.model = active_model
                    print(f"SUCCESS: Generated with {model_name}")
                    break
                except Exception as e:
                    print(f"FAIL: {model_name} error: {e}")
                    last_error = e
            
            if not response:
                raise last_error or Exception("All models failed")

            text = response.text
            # Clean up potential markdown formatting ```json ... ```
            if "```json" in text:
                text = text.replace("```json", "").replace("```", "")
            elif "```" in text:
                text = text.replace("```", "")
            
            return json.loads(text)
        except Exception as e:
            print(f"Error generating content: {e}")
            # Fallback using the user's content so it looks normal
            fallback_title = content[:50] + "..." if len(content) > 50 else content
            return {
                "title": fallback_title,
                "category": "Uncategorized",
                "tags": []
            }

gemini_service = GeminiService()
