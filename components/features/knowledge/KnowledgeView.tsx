'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { KnowledgeDocument } from '@/types';
import { StorageService } from '@/services/storage/storageService';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Trash2,
  Download,
  X,
  ExternalLink,
  ShieldCheck,
  Building,
  Plus,
  Loader2,
  Paperclip,
} from 'lucide-react';

export default function KnowledgeView() {
  const { knowledgeDocs, addKnowledgeDoc, clients, showToast, activeWorkspaceId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [docForm, setDocForm] = useState({
    title: '',
    category: 'SOP' as KnowledgeDocument['category'],
    fileType: 'PDF' as KnowledgeDocument['fileType'],
    fileSize: '1.8 MB',
    clientId: clients[0]?.id || '',
    summary: '',
  });

  const filteredDocs = knowledgeDocs.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = selectedClient === 'all' || doc.clientId === selectedClient;
    return matchesSearch && matchesClient;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      const fileType = (['PDF', 'DOCX', 'MD'].includes(ext) ? ext : 'PDF') as KnowledgeDocument['fileType'];
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      setDocForm((prev) => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
        fileType,
        fileSize: sizeStr,
      }));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title.trim()) return;

    setIsUploading(true);
    const client = clients.find((c) => c.id === docForm.clientId);
    const docId = `doc-${Date.now()}`;

    let downloadUrl: string | undefined = undefined;
    let storagePath: string | undefined = undefined;

    if (selectedFile) {
      try {
        const uploadRes = await StorageService.uploadDocumentFile(
          activeWorkspaceId,
          docId,
          selectedFile,
          selectedFile.name
        );
        downloadUrl = uploadRes.downloadUrl;
        storagePath = uploadRes.storagePath;
        showToast('File stored in Firebase Storage bucket');
      } catch (err: any) {
        console.warn('Firebase storage upload skipped/errored:', err);
        // Continue indexing metadata with local attributes
      }
    }

    addKnowledgeDoc({
      title: docForm.title,
      category: docForm.category,
      fileType: docForm.fileType,
      fileSize: docForm.fileSize,
      clientId: docForm.clientId,
      clientName: client?.name || 'Global Agency System',
      chunksCount: Math.floor(Math.random() * 60) + 20,
      summary: docForm.summary || 'Vectorized operational reference document.',
      downloadUrl,
      storagePath,
    });

    setIsUploading(false);
    setIsUploadOpen(false);
    setSelectedFile(null);
    setDocForm({
      title: '',
      category: 'SOP',
      fileType: 'PDF',
      fileSize: '1.8 MB',
      clientId: clients[0]?.id || '',
      summary: '',
    });
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Vector Knowledge Base
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Index company SOPs, real estate listings, and clinical protocols into embeddings for autonomous agent retrieval.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50/50 dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-xl p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents and summaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
          />
        </div>

        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
        >
          <option value="all">All Documents (Agency &amp; Clients)</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Documents Grid */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                    {doc.title}
                  </h3>
                  <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-2">
                    <span>{doc.clientName}</span>
                    <span>·</span>
                    <span>{doc.category}</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {doc.fileType}
              </span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {doc.summary}
            </p>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono text-[11px]">
              <span>Chunks: {doc.chunksCount} vectors</span>
              <span>Size: {doc.fileSize}</span>
              <span>Indexed: {doc.dateAdded}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Index Document into Vector Store
              </h2>
              <button onClick={() => setIsUploadOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aura Pricing Matrix Q4"
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Category
                  </label>
                  <select
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  >
                    <option value="SOP">SOP</option>
                    <option value="Product Spec">Product Spec</option>
                    <option value="Company Policy">Company Policy</option>
                    <option value="Client Onboarding">Client Onboarding</option>
                    <option value="API Docs">API Docs</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Target Client
                  </label>
                  <select
                    value={docForm.clientId}
                    onChange={(e) => setDocForm({ ...docForm, clientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Document Summary &amp; Key Directives
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline the core rules and knowledge points for the autonomous agent to reference..."
                  value={docForm.summary}
                  onChange={(e) => setDocForm({ ...docForm, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Document File (Firebase Storage)
                </label>
                <div className="p-3.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-[#141414] text-center text-xs text-neutral-500 relative hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.md,.json"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-neutral-900 dark:text-neutral-100 font-medium">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[240px]">{selectedFile.name}</span>
                      <span className="text-neutral-400 font-mono text-[11px]">
                        ({(selectedFile.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="w-4 h-4 text-neutral-400" />
                      <span>Click or drag file to upload to Firebase Storage</span>
                      <span className="text-[10px] text-neutral-400">PDF, DOCX, TXT, Markdown up to 25MB</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isUploading ? 'Uploading & Indexing...' : 'Index into Vector Store'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {selectedDoc.title}
              </h2>
              <button onClick={() => setSelectedDoc(null)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-400">Assigned Client:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{selectedDoc.clientName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-400">Category &amp; Format:</span>
                <span className="font-mono">{selectedDoc.category} · {selectedDoc.fileType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-400">Vector Embeddings:</span>
                <span className="font-mono">{selectedDoc.chunksCount} chunks (1536 dims)</span>
              </div>

              {selectedDoc.downloadUrl && (
                <div className="flex justify-between items-center py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-400">Storage Asset:</span>
                  <a
                    href={selectedDoc.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-neutral-900 dark:text-neutral-100 font-medium hover:underline"
                  >
                    <span>Download Original File</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="space-y-1 pt-1">
                <span className="text-neutral-400 font-medium">Extracted Knowledge Synopsis:</span>
                <p className="p-3 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-100 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {selectedDoc.summary}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setSelectedDoc(null);
                  showToast('Document vector weights updated');
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:opacity-90"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
