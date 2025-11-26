const API_URL = "http://localhost:8001";

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json();
}

export async function analyzeContent(text: string, language: string = "en") {
  const response = await fetch(`${API_URL}/ai/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, language }),
  });

  if (!response.ok) {
    throw new Error("Analysis failed");
  }

  return response.json();
}

export async function generateQuiz(text: string, language: string = "en") {
  const response = await fetch(`${API_URL}/ai/quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, language }),
  });

  if (!response.ok) {
    throw new Error("Quiz generation failed");
  }

  return response.json();
}

export async function chatWithAI(context: string, message: string, history: any[], language: string = "en") {
  const response = await fetch(`${API_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ context, message, history, language }),
  });

  if (!response.ok) {
    throw new Error("Chat failed");
  }

  return response.json();
}

export async function generateStudyPlan(topics: string[], examDate: string, hoursPerDay: number, language: string = "en") {
  const response = await fetch(`${API_URL}/ai/plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topics, exam_date: examDate, hours_per_day: hoursPerDay, language }),
  });

  if (!response.ok) {
    throw new Error("Planning failed");
  }

  return response.json();
}

export async function generateFlashcards(text: string, numCards: number, language: string = "en") {
  const response = await fetch(`${API_URL}/ai/flashcards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, num_cards: numCards, language }),
  });

  if (!response.ok) {
    throw new Error("Flashcards failed");
  }

  return response.json();
}
