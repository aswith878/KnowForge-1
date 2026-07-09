import { supabase } from "./supabase";
import { askGemini } from "./geminiService";

/* -----------------------------
   Intent Detection
--------------------------------*/

function detectIntent(question) {
  const q = question.toLowerCase();

  if (
    q.includes("sop") ||
    q.includes("procedure") ||
    q.includes("operating procedure")
  ) {
    return "sop";
  }

  if (
    q.includes("safety") ||
    q.includes("precaution") ||
    q.includes("ppe")
  ) {
    return "safety";
  }

  if (
    q.includes("maintenance") ||
    q.includes("repair") ||
    q.includes("fix")
  ) {
    return "maintenance";
  }

  if (
    q.includes("summary") ||
    q.includes("summarize") ||
    q.includes("overview")
  ) {
    return "summary";
  }

  return "general";
}

/* -----------------------------
   Smart Ranking
--------------------------------*/

function rankDocuments(question, docs) {
  const words = question
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const ranked = docs.map((doc) => {
    const text = `
      ${doc.title || ""}
      ${doc.category || ""}
      ${doc.description || ""}
    `.toLowerCase();

    let score = 0;

    words.forEach((word) => {
      if (doc.title?.toLowerCase().includes(word)) score += 10;
      if (doc.category?.toLowerCase().includes(word)) score += 5;
      if (doc.description?.toLowerCase().includes(word)) score += 2;
      if (text.includes(word)) score += 1;
    });

    return {
      score,
      document: doc,
    };
  });

  ranked.sort((a, b) => b.score - a.score);

  return ranked.filter((d) => d.score > 0);
}

/* -----------------------------
   Main AI
--------------------------------*/

export async function askAI(question) {

  const intent = detectIntent(question);

  const { data, error } = await supabase
    .from("knowledge_library")
    .select("*");

  if (error) {
    return `
      <h3>❌ Error</h3>
      <p>Unable to search the knowledge library.</p>
    `;
  }

  const ranked = rankDocuments(question, data);

  let context = "";

  ranked.slice(0, 3).forEach((item) => {

    context += `
Title:
${item.document.title}

Category:
${item.document.category}

Description:
${item.document.description}

------------------------
`;

  });

  let prompt = `
You are KnowForge AI.

You are an Industrial Knowledge Assistant.

Answer professionally.

Use ONLY the company knowledge below.

If information is not available, clearly say:

"I couldn't find complete information inside the company knowledge library."

Employee Question:

${question}

Intent:

${intent}

Company Knowledge:

${context}
`;

  const aiAnswer = await askGemini(prompt);

  let html = `
<h2>🤖 KnowForge AI</h2>

<div style="
background:#172554;
padding:18px;
border-radius:12px;
margin-bottom:20px;
">

${aiAnswer.replace(/\n/g,"<br>")}

</div>
`;

  if (ranked.length > 0) {

    html += `
<hr>

<h3>📚 Related Documents</h3>
`;

    ranked.slice(0,5).forEach((item)=>{

      html += `
<div style="
background:#1E293B;
border:1px solid #334155;
padding:18px;
border-radius:12px;
margin-bottom:15px;
">

<h3>${item.document.title}</h3>

<p>

<b>Category:</b>

${item.document.category}

</p>

<p>

${item.document.description}

</p>

<a
href="${item.document.file_url}"
target="_blank"
style="
display:inline-block;
padding:10px 16px;
background:#2563EB;
color:white;
text-decoration:none;
border-radius:8px;
margin-top:10px;
"
>

📂 Open File

</a>

</div>
`;

    });

  }

  return html;
}