'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Document {
  id: string;
  filename: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'documents'>('upload');
  const [documents, setDocuments] = useState<Document[]>([]);

  // Estado para login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Função de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Credenciais inválidas');

      const data = await res.json();
      console.log('Resposta do login:', data);

      const token = data.accessToken || data.token || data.jwt;

      if (!token) throw new Error('Token não encontrado na resposta');

      localStorage.setItem('token', token);
      console.log('Token armazenado:', token);

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  // Carregar documentos
  useEffect(() => {
    const fetchDocuments = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Verifique se existe
      try {
        if (!token) return;

        const response = await fetch('http://localhost:3001/documents?userId=1234', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        console.log('Resposta da API:', data);
        setDocuments(Array.isArray(data.data) ? data.data : data.documents || []); // Ajuste aqui
      } catch (err) {
        console.error('Erro ao carregar documentos:', err);
      }
    };

    if (activeTab === 'documents') {
      fetchDocuments();
    }
  }, [activeTab]);

  // Função de upload
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const formData = new FormData();
      formData.append('file', file); // <- Aqui o nome 'file' deve bater com o @UploadedFile('file')

      const response = await fetch('http://localhost:3001/documents/upload', {
        method: 'POST', // Alterado para POST
        headers: {
          Authorization: `Bearer ${token}`, // <- sem Content-Type, o fetch cuida disso com FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro no upload');
      }

      setFile(null);
      setActiveTab('documents'); // Mostra a lista após upload
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long', // Dia da semana, como "segunda-feira"
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Função para baixar o texto extraído
  const downloadDocument = async (filename: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`http://localhost:3001/documents/download-text/${filename}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha no download');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.txt`; // Usa o nome do arquivo para download
      link.click();
    } catch (error) {
      console.error('Erro ao baixar o documento', error);
    }
  };

  // Componente para exibir a lista de documentos
  const DocumentList = ({ documents }: { documents: Document[] }) => {
    return (
      <div>
        {documents.map((document) => (
          <div key={document.id}>
            <h3>{document.filename}</h3>
            <button onClick={() => downloadDocument(document.filename)}>Baixar</button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex space-x-8">
              <h1 className="text-xl font-bold">Dashboard</h1>
              <button
                className={`${activeTab === 'upload' ? 'text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('upload')}
              >
                Upload
              </button>
              <button
                className={`${activeTab === 'documents' ? 'text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('documents')}
              >
                Documentos ({documents.length})
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'upload' ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                id="file-upload"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md inline-block hover:bg-blue-600"
              >
                {file ? file.name : 'Selecionar Arquivo'}
              </label>

              {file && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400 block mx-auto"
                >
                  {isUploading ? 'Enviando...' : 'Enviar Arquivo'}
                </button>
              )}
              {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            {documents.length === 0 ? (
              <p className="text-center text-gray-500">Nenhum documento encontrado</p>
            ) : (
              <DocumentList documents={documents} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
