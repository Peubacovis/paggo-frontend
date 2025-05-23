export async function askLLM(text: string): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://paggo-backend-a0hc.onrender.com';
  console.log('URL:', apiUrl);

  const res = await fetch(`${apiUrl}/llm/explain`, {  // Corrigido para /explain
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),  // Corrigido para só enviar "text"
  });

  if (!res.ok) {
    throw new Error('Erro ao consultar o LLM');
  }

  const data = await res.json();
  return data.explanation; // O backend retorna { explanation: ... }
}
