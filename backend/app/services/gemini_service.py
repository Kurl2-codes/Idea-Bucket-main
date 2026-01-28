import google.generativeai as genai
from app.core.config import settings
import json

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # Priority list of models to try
        self.model_candidates = [
            'gemini-flash-latest',
            'gemini-2.0-flash',
            'gemini-1.5-flash',
            'gemini-2.0-flash-exp',
            'gemini-1.5-flash-8b',
        ]
        self.model = None

    async def analyze_idea(self, content: str, image_datas: list = []) -> dict:
        if not self.model:
            for model_name in self.model_candidates:
                try:
                    self.model = genai.GenerativeModel(model_name)
                    print(f"Selected model: {model_name}")
                    break 
                except Exception as e:
                    print(f"Model {model_name} init failed: {e}")
            
            if not self.model:
                self.model = genai.GenerativeModel('gemini-1.5-flash')

        try:
            prompt = f"""
            You are an intelligent workspace assistant. Extract a professional title, a descriptive category, and relevant tags from the content provided. Be concise and accurate.
            
            Analyze the following user input and images to generate a title, category, and tags.
            User Input: {content}
            
            Return JSON with keys: title, category, tags.
            """
            
            parts = [prompt]
            
            if image_datas:
                 try:
                     import base64
                     for img_b64 in image_datas:
                         if "," in img_b64:
                             img_b64 = img_b64.split(",")[1]
                             
                         image_data = base64.b64decode(img_b64)
                         parts.append({
                             "mime_type": "image/png",
                             "data": image_data
                         })
                 except Exception as img_err:
                     print(f"Image processing failed: {img_err}")
            
            response = None
            last_error = None
            
            # Prioritize currently selected model, then fallback to others
            current_model_name = self.model.model_name.replace('models/', '') if self.model else self.model_candidates[0]
            attempt_order = [current_model_name] + [m for m in self.model_candidates if m != current_model_name]
            
            for model_name in attempt_order:
                try:
                    active_model = genai.GenerativeModel(model_name)
                    try:
                        response = active_model.generate_content(parts, generation_config={"response_mime_type": "application/json"})
                    except:
                        response = active_model.generate_content(parts)
                        
                    self.model = active_model
                    print(f"Generated with {model_name}")
                    break
                except Exception as e:
                    print(f"Model {model_name} failed: {e}")
                    last_error = e
            
            if not response:
                raise last_error or Exception("All models failed")

            text = response.text
            if "```json" in text:
                text = text.replace("```json", "").replace("```", "")
            elif "```" in text:
                text = text.replace("```", "")
            
            return json.loads(text)
        except Exception as e:
            print(f"Content generation error: {e}")
            fallback_title = content[:50] + "..." if len(content) > 50 else content
            return {
                "title": fallback_title,
                "category": "Uncategorized",
                "tags": []
            }

gemini_service = GeminiService()
