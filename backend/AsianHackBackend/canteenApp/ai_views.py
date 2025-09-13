from rest_framework.decorators import api_view
from rest_framework.response import Response
import base64
import requests
from .models import ChatMessageUserAI, ClassroomItem
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
import json
from rest_framework.permissions import IsAuthenticated


# from rest_framework.authentication import SessionAuthentication, BasicAuthentication


HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
HF_API_KEY = "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"  # Hugging Face token yaha daal

# CHATGPT_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
# CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions"  # Replace with free/proxy API
# ELEVENLABS_API_KEY = "sk_df7d68f7bee4ffe037ee48d885b33f08274ec39a34531abd"
# ELEVENLABS_VOICE_ID = "jqcCZkN6Knx8BJ5TBdYR"

# ELEVENLABS_API_KEY = "sk_2f9e2766fb9de3f32437d8ce34bd80629ae1ec536a939248"
ELEVENLABS_API_KEY = "sk_d2045f1e1719e9bc4d97c842af2287fe0a1c4aa499312738"
ELEVENLABS_VOICE_ID = "jqcCZkN6Knx8BJ5TBdYR"

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def transcribe_and_reply_2(request):
    print("User:", request.user, "Authenticated:", request.user.is_authenticated)


    GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent"
    GEMINI_API_KEY = "AIzaSyDwmmZ4jSBG4h_xh5vY20tYB3YfpYOPnOo"  # from Google AI Studio
    GEMINI_API_KEY_QUIZ = (
        "AIzaSyBQsQTb4eHot9Xm_BfXRZQfHJk1bKPEd9c"  # from Google AI Studio
    )

    message = request.data.get("text", "")
    videoContext = request.data.get("videoContext", "")
    videoId = request.data.get("videoId", "")
    print(videoId)

    quiz_assistant_system_prompt = f"""
You are a structured quiz generator AI. 
Your task is:
1. Analyze the user message: {message}.
2. If the user is explicitly asking for a quiz, then generate a quiz [! Don't generate the quiz if the user just ask any question].
3. If the user is NOT asking for a quiz, return exactly "None".
4. Donot gnerate quiz until the user mention the "quiz" word or any word related to it.

When generating a quiz:
- Base the quiz ONLY on the provided video context: [{videoContext}].
- Create 5 questions, each with 4 options (A, B, C, D).
- Include the correct answer and a short explanation for why it’s correct.
- Output must be valid JSON in this format:

{{
  "quiz": [
    {{
      "question": "Question text",
      "options": ["Option1", "Option2", "Option3", "Option4"],
      "correct_answer": "Correct Option",
      "explanation": "Short explanation of the correct answer"
    }}
  ]
}}

If the message is not about a quiz, output "None".
"""

    system_prompt = """
                  You are Learn-Z, a friendly video-learning assistant which have the context of current active video played by the User.  
                  
                  - Always answer short, clear, and in a warm, family-like tone.  
                  - Focus all answers around the video context, like notes, summaries, timestamps, projects, or explanations learners see in the video.  
                  - Never go off-topic; always bring the answer back to the video.  
                  - we have also implemented structured quiz simulation so if user asks for a quiz then reply user that the quiz is ready and to answer the questions wisely in a family like tone.
                  
                  If learners need more help, politely ask:  
                  "Would you like me to give more details or examples from the video context?"  
                  
                  If asked about the platform, reply:  
                  "It’s Learn-Z, a platform made for Gen-Z where learners can learn in a smart way."  
                  
                  If asked to remember something, reply:  
                  "Yes, we have implemented a memory system."  
                  
                  You may provide short code snippets if asked, but only when relevant to the video.  
                  
                  If asked about your name, explain in a fun way:  
                  "My name comes from combining Gen-Z and learning — that makes me Learn-Z!"  
                  
                  Always stay friendly, engaging, and supportive — like a buddy guiding learners through the video journey.
                """

    # audio_file = request.FILES['audio']

    # # Save temporarily
    # with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
    #     for chunk in audio_file.chunks():
    #         tmp.write(chunk)
    #     tmp_path = tmp.name

    # # Convert to wav
    # wav_path = tmp_path.replace(".webm", ".wav")
    # subprocess.run(["ffmpeg", "-i", tmp_path, wav_path])

    # # Step 1: Transcribe audio → text
    # result = model.transcribe(wav_path)
    # user_text = result["text"]

    # print(f"User text: {user_text}")
    
    #get clasroomItem
    currentItem = ClassroomItem.objects.filter(id=videoId).first()
    print(f"currentItem : {currentItem}")
        

    # Save user message in DB
    ChatMessageUserAI.objects.create(role="user", content=message, user=request.user, item=currentItem)

    # Fetch last 5 messages from DB (oldest first)
    previous_messages = ChatMessageUserAI.objects.filter(user=request.user, item=currentItem).order_by("-created_at")
    previous_messages = list(reversed(previous_messages))

    conversation_history = [
        {"role": msg.role, "content": msg.content} for msg in previous_messages
    ]

    composed_system_prompts = f"[your role]: [{system_prompt}] [current video context]: [ {videoContext} ] with [conversation history]: [{conversation_history}]"

    # Build Gemini history
    gemini_contents = []

    # Inject system prompt as the first user message
    gemini_contents.append(
        {"role": "user", "parts": [{"text": f"{composed_system_prompts}"}]}
    )

    # Add conversation history
    # for msg in previous_messages:
    #     gemini_contents.append(
    #         {
    #             "role": "user" if msg.role == "user" else "model",
    #             "parts": [{"text": msg.content}],
    #         }
    #     )
    #     # print(msg)

    # Add current message
    gemini_contents.append({"role": "user", "parts": [{"text": message}]})

    gemini_quiz_contents = [
        {"role": "user", "parts": [{"text": f"{quiz_assistant_system_prompt}"}]}
    ]

    # Call Gemini
    gemini_payload = {"contents": gemini_contents}

    # for quiz-payload
    gemini_quiz_payload = {"contents": gemini_quiz_contents}

    gemini_res = requests.post(
        f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
        headers={"Content-Type": "application/json"},
        json=gemini_payload,
    )

    # for quiz
    gemini_res_quiz = requests.post(
        f"{GEMINI_API_URL}?key={GEMINI_API_KEY_QUIZ}",
        headers={"Content-Type": "application/json"},
        json=gemini_quiz_payload,
    )

    if gemini_res.status_code != 200:
        return Response(
            {"error": "Gemini API failed", "details": gemini_res.text}, status=500
        )

    #  for quiz
    if gemini_res_quiz.status_code != 200:
        return Response(
            {"error": "Gemini API failed", "details": gemini_res_quiz.text}, status=500
        )

    gemini_data = gemini_res.json()
    if gemini_data:
        print(gemini_data)
    ai_reply = gemini_data["candidates"][0]["content"]["parts"][0]["text"]

    # for quiz
    gemini_data_quiz = gemini_res_quiz.json()
    if gemini_data_quiz:
        print(gemini_data_quiz)

    ai_reply_quiz = gemini_data_quiz["candidates"][0]["content"]["parts"][0]["text"]
    print("AI Quiz Reply:", ai_reply_quiz)

    # quiz_json = None
    # if ai_reply_quiz.strip() != "None":
    #     try:
    #         quiz_parsed = json.loads(ai_reply_quiz)
    #         quiz_json = quiz_parsed.get("quiz", None)
    #     except Exception as e:
    #         print("Failed to parse quiz JSON:", e)
    #         quiz_json = None

    # Save assistant reply
    ChatMessageUserAI.objects.create(role="assistant", content=ai_reply, user=request.user, item=currentItem)

    # ElevenLabs TTS
    tts_payload = {
        "text": f"<speak><prosody rate='85%' pitch='0%' volume='100%'>{ai_reply}</prosody></speak>",
        "voice_settings": {"stability": 0.4, "similarity_boost": 0.8},
    }
    tts_res = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}",
        headers={"Content-Type": "application/json", "xi-api-key": ELEVENLABS_API_KEY},
        json=tts_payload,
    )

    audio_base64 = (
        base64.b64encode(tts_res.content).decode("utf-8")
        if tts_res.status_code == 200
        else None
    )

    return Response(
        {
            "ai_text": ai_reply,
            "ai_audio": audio_base64,
            "ai_reasoning": None,
            "ai_quiz": ai_reply_quiz,
        }
    )




# def user_ai_chat_per_video(request, id):
#     currentItem = ClassroomItem.objects.filter(id=id).first()
#     chats = ChatMessageUserAI.objects.filter(user=request.user, item=currentItem).all()
    
#     for chat_chunk in chats:
#         if chat_chunk.role == "user":
#             print(chat_chunk.content)
            
#         if chat_chunk.role == "assistant":
#             print(chat_chunk.content)
                
#     return Response({"chat": chat_chunk})                  
            
    