// src/app/components/AskLLM.tsx

'use client';

import React, { useState } from 'react';

interface AskLLMProps {
  documentText: string;
}

export default function AskLLM({ documentText }: AskLLMProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3001/llm/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, documentText }),
      });

      const data = await res.json();

      if (res.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer('Erro ao obter resposta.');
      }
    } catch (err) {
      console.error('Erro ao fazer pergunta:', err);
      setAnswer('Erro na conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Pergunte sobre o documento</h2>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        placeholder="Digite sua pergunta..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleAsk}
        disabled={isLoading}
      >
        {isLoading ? 'Perguntando...' : 'Perguntar'}
      </button>

      {answer && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <strong>Resposta:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
