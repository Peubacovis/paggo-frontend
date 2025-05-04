'use client';

import { useState } from 'react';
import { askLLM } from '../services/llm';

export function AskLLM({ documentText }: { documentText: string }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const response = await askLLM(documentText, question);
      setAnswer(response);
    } catch (err) {
      setAnswer('Erro ao consultar o assistente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md mt-6">
      <h2 className="font-semibold mb-2">Pergunte sobre este documento</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Digite sua pergunta..."
        className="w-full p-2 border rounded mb-2"
        rows={4}
      />
      <button
        onClick={handleAsk}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Consultando...' : 'Perguntar'}
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
