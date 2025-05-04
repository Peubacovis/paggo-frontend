export async function askLLM(text: string): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  console.log('URL:', apiUrl);

  const res = await fetch(`${apiUrl}/llm/ask`, {  // Corrigido para /explain
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
