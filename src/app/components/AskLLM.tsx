'use client';

import { useState } from 'react';

interface AskLLMProps {
  documentText: string;
}

export const AskLLM = ({  }: AskLLMProps) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/llm/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) throw new Error('Erro ao processar sua solicitação');

      const data = await res.json();
      setResponse(data.explanation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-xl font-semibold">Interaja com o LLM</h4>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Faça uma pergunta sobre o documento..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {loading ? 'Carregando...' : 'Enviar'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {response && <p className="mt-4">{response}</p>}
    </div>
  );
};
