import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  Search,
  Trash2,
  Eye,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  BookOpen,
  Zap,
  ArrowRight,
  Database,
  Filter,
} from 'lucide-react';
import type { KnowledgeDocument, DocumentChunk } from '../types';
import { soundManager } from '../utils/audio';

interface RagSearchResult {
  chunkId: string;
  documentId: string;
  documentName: string;
  text: string;
  pageNumber: number;
  similarityScore: number;
}

export const KnowledgeBasePage: React.FC = () => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);
  const [docChunks, setDocChunks] = useState<DocumentChunk[]>([]);
  const [activeModalTab, setActiveModalTab] = useState<'text' | 'chunks'>('chunks');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Semantic RAG Query Testbench state
  const [ragQuery, setRagQuery] = useState('What are the SLA response times for critical outages?');
  const [ragResults, setRagResults] = useState<RagSearchResult[]>([]);
  const [isQueryingRag, setIsQueryingRag] = useState(false);
  const [activeView, setActiveView] = useState<'repository' | 'testbench'>('repository');

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    soundManager.playAgentPulse();

    try {
      const textContent = await file.text();

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || 'text/plain',
          fileSize: file.size,
          textContent,
        }),
      });

      if (!res.ok) {
        throw new Error('Upload failed on server.');
      }

      soundManager.playSuccess();
      await fetchDocuments();
    } catch (err: any) {
      console.error('Document upload error:', err);
      setUploadError(err.message || 'Failed to upload and process document.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleOpenDoc = async (doc: KnowledgeDocument) => {
    setSelectedDoc(doc);
    setActiveModalTab('chunks');
    soundManager.playClick();
    try {
      const res = await fetch(`/api/documents/${doc.documentId}/chunks`);
      const data = await res.json();
      setDocChunks(data.chunks || []);
    } catch (e) {
      console.error('Error fetching document chunks:', e);
    }
  };

  const handleDelete = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this document from semantic memory?')) return;

    try {
      await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
      soundManager.playClick();
      setDocuments((prev) => prev.filter((d) => d.documentId !== docId));
      if (selectedDoc?.documentId === docId) setSelectedDoc(null);
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  const handleRunRagQuery = async () => {
    if (!ragQuery.trim()) return;
    setIsQueryingRag(true);
    soundManager.playAgentPulse();

    try {
      const res = await fetch('/api/documents/query-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: ragQuery }),
      });
      const data = await res.json();
      setRagResults(data.results || []);
      soundManager.playClick();
    } catch (e) {
      console.error('Failed to query RAG index:', e);
    } finally {
      setIsQueryingRag(false);
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.contentSnippet && doc.contentSnippet.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Enterprise Knowledge Base & Vector RAG</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              {documents.length} Indexed
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Ingest corporate operating guidelines, SLA agreements, and refund policies. Ground multi-agent responses with verifiable citations.
          </p>
        </div>

        {/* View Switcher & Upload */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="p-1 rounded-xl bg-[#111827] border border-[#1e293b] flex items-center gap-1">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveView('repository');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'repository'
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Document Vault
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveView('testbench');
                if (ragResults.length === 0) handleRunRagQuery();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'testbench'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-300" />
              <span>RAG Testbench</span>
            </button>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{uploading ? 'Chunking...' : 'Upload File'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.docx,.md"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>

      {uploadError && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Main Tab 1: Document Vault */}
      {activeView === 'repository' && (
        <div className="space-y-6">
          {/* Drag & Drop Hero Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className="p-8 rounded-3xl bg-[#111827] border-2 border-dashed border-[#1e293b] hover:border-violet-500/50 transition-all cursor-pointer text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600/20 via-cyan-500/10 to-transparent border border-violet-500/30 mx-auto mb-4 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Drag & drop policy documents or click to browse
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
              Supports PDF contracts, DOCX manuals, and TXT operating procedures up to 10MB.
            </p>
            <div className="inline-flex items-center gap-4 text-[11px] text-slate-500 font-mono">
              <span>&bull; Automated Text Extraction</span>
              <span>&bull; 500-Character Overlapping Chunks</span>
              <span>&bull; Instant Cosine Vector Indexing</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents by policy name or keyword..."
                className="w-full bg-[#111827] text-xs text-slate-200 placeholder-slate-500 pl-9 pr-4 py-2.5 rounded-xl border border-[#1e293b] focus:outline-none focus:border-violet-500"
              />
            </div>
            <span className="text-xs text-slate-500">{filteredDocs.length} documents indexed</span>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <div
                key={doc.documentId}
                onClick={() => handleOpenDoc(doc)}
                className="p-6 rounded-3xl bg-[#111827] border border-[#1e293b] hover:border-violet-500/40 transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        Vector Ready
                      </span>
                      <button
                        onClick={(e) => handleDelete(doc.documentId, e)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mb-1 truncate group-hover:text-cyan-400 transition-colors">
                    {doc.fileName}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {doc.contentSnippet || 'Document content extracted and chunked in vector memory.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{doc.chunkCount || 3} Semantic Chunks</span>
                  </span>
                  <span>{(doc.fileSize / 1024).toFixed(0)} KB</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Tab 2: Interactive Vector RAG Testbench */}
      {activeView === 'testbench' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#111827] border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Semantic Cosine Similarity Testbench</h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">
                Agent 02 &bull; Knowledge Intelligence
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Enter any query or policy question to simulate how Agent 2 retrieves, scores, and cites chunks for the response generator.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunRagQuery()}
                placeholder="Ask about refund policies, SLA guarantee, quota limits..."
                className="flex-1 bg-[#0b0f19] text-xs text-slate-200 placeholder-slate-500 px-4 py-2.5 sm:py-3 rounded-xl border border-[#1e293b] focus:border-cyan-500 outline-none font-sans"
              />
              <button
                onClick={handleRunRagQuery}
                disabled={isQueryingRag}
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                <Zap className="w-4 h-4 text-cyan-200" />
                <span>{isQueryingRag ? 'Searching...' : 'Run Query'}</span>
              </button>
            </div>
          </div>

          {/* Results Stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Top Retrieved Semantic Chunks ({ragResults.length})</span>
              <span className="font-mono text-cyan-400">Cosine Similarity Ranked</span>
            </div>

            {ragResults.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 bg-[#111827] rounded-3xl border border-[#1e293b]">
                No matching chunks found. Try queries like "refund", "outage", "credit memo", or "SLA".
              </div>
            ) : (
              ragResults.map((result, idx) => {
                const matchPct = Math.round(result.similarityScore * 100);
                return (
                  <div
                    key={result.chunkId || idx}
                    className="p-5 rounded-2xl bg-[#111827] border border-[#1e293b] hover:border-cyan-500/40 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-slate-200">
                          {result.documentName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          (Chunk #{result.pageNumber || idx + 1})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">Cosine Score:</span>
                        <span
                          className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full border ${
                            matchPct > 50
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                              : 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30'
                          }`}
                        >
                          {(result.similarityScore || 0).toFixed(3)} ({matchPct}%)
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#080b14] border border-[#1e293b] text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {result.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Document Inspector Modal with Chunks Visualizer */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1e293b] rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#1e293b] flex items-center justify-between bg-[#0a0e1a]">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedDoc.fileName}</h3>
                  <span className="text-[11px] text-slate-500">
                    ID: {selectedDoc.documentId} &bull; {docChunks.length} Vector Chunks Created
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#111827] p-1 rounded-lg border border-[#1e293b] text-xs">
                  <button
                    onClick={() => setActiveModalTab('chunks')}
                    className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                      activeModalTab === 'chunks'
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Vector Chunks ({docChunks.length})
                  </button>
                  <button
                    onClick={() => setActiveModalTab('text')}
                    className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                      activeModalTab === 'text'
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Full Text
                  </button>
                </div>

                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-slate-400 hover:text-white p-1 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {activeModalTab === 'chunks' ? (
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Individual Semantic Vector Chunks</span>
                    <span className="font-mono text-slate-500">500-char overlapping windows</span>
                  </div>

                  {docChunks.map((chunk, idx) => (
                    <div
                      key={chunk.chunkId || idx}
                      className="p-4 rounded-xl bg-[#080b14] border border-[#1e293b] space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-mono text-cyan-400">
                          Chunk #{idx + 1} &bull; {chunk.chunkId}
                        </span>
                        <span>{chunk.text.length} chars</span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                        {chunk.text}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#080b14] border border-[#1e293b] text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
                  {selectedDoc.content || selectedDoc.contentSnippet}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#1e293b] bg-[#0d121f] flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
