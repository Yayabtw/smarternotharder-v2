import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Erreur: GEMINI_API_KEY n'est pas définie dans l'environnement.")
else:
    genai.configure(api_key=api_key)

    print("List of models that support generateContent:\n")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
    except Exception as e:
        print(f"Erreur lors de la récupération des modèles: {e}")

