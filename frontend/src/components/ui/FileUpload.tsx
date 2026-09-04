import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import api from '../../api/axios';

interface FileUploadProps {
  onUploadSuccess: (fileUrl: string) => void;
  label?: string;
  acceptedTypes?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadSuccess, 
  label = "Unggah Dokumen / Foto",
  acceptedTypes = "image/*,application/pdf"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Ukuran file maksimal adalah 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      // Kita langsung memanggil ke endpoint attachment catalog-service (lewat gateway)
      const res = await api.post('/attachments/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const fileUrl = res.data.data; // e.g. /api/attachments/download/xxxx-xxxx.jpg
      setUploadedFileName(file.name);
      onUploadSuccess(fileUrl);
      toast.success('File berhasil diunggah');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengunggah file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearFile = () => {
    setUploadedFileName(null);
    onUploadSuccess('');
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      
      {uploadedFileName ? (
        <div className="flex items-center justify-between p-3 border border-emerald-200 bg-emerald-50 rounded-lg">
          <div className="flex items-center gap-3 overflow-hidden">
            <File className="text-emerald-500 shrink-0" size={20} />
            <span className="text-sm text-emerald-800 font-medium truncate">{uploadedFileName}</span>
          </div>
          <button 
            type="button" 
            onClick={clearFile}
            className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div 
          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
            isDragging ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 hover:bg-slate-50 hover:border-slate-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept={acceptedTypes}
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin text-emerald-500 mb-2" size={28} />
              <span className="text-sm text-slate-500">Mengunggah...</span>
            </div>
          ) : (
            <>
              <UploadCloud className="text-slate-400 mb-3" size={32} />
              <p className="text-sm font-medium text-slate-700 mb-1">
                Klik untuk memilih atau tarik file ke sini
              </p>
              <p className="text-xs text-slate-500">
                JPG, PNG, atau PDF (Maks. 5MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
