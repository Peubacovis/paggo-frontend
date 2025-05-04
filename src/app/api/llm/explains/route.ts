// app/api/llm/explain/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text } = await req.json();
  
  // Aqui você colocaria a chamada à sua LLM ou lógica de resposta
  const fakeResponse = `Explicando: ${text.slice(0, 50)}...`;

  return NextResponse.json({ message: fakeResponse });
}
