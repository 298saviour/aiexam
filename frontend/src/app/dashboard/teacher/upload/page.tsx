'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, X, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeacherSidebar } from '@/components/dashboard/TeacherSidebar';

interface UploadedFile {
  id: number;
  name: string;
  size: number;
  date: string;
  status: 'uploading' | 'processed' | 'processing' | 'failed';
  progress?: number;
}

export default function UploadNotesPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: 1, name: 'Biology Chapter 5.pdf', size: 2048000, date: '2024-11-01', status: 'processed' },
    { id: 2, name: 'Mathematics Formulas.pdf', size: 1536000, date: '2024-10-28', status: 'processing' },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
      id: uploadedFiles.length + index + 1,
      name: file.name,
      size: file.size,
      date: new Date().toISOString().split('T')[0],
      status: 'uploading',
      progress: 0,
    }));

    setUploadedFiles([...newFiles, ...uploadedFiles]);

    // Simulate upload progress
    newFiles.forEach((file, index) => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === fileId ? { ...f, progress } : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === fileId ? { ...f, status: 'processing', progress: undefined } : f
            )
          );
          setTimeout(() => {
            setUploadedFiles(prev =>
              prev.map(f =>
                f.id === fileId ? { ...f, status: 'processed' } : f
              )
            );
          }, 2000);
        }, 500);
      }
    }, 200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDeleteFile = (id: number) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <DashboardLayout sidebar={<TeacherSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Upload Lesson Notes</h1>
          <p className="text-gray-600 mt-1">Upload materials to train the AI grading system</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-500'
              }`}
            >
              <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Lesson Notes</h3>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop files here or click to browse
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
              </p>
              <Button type="button">Select Files</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No files uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-600">
                            {formatFileSize(file.size)} • {file.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            file.status === 'processed'
                              ? 'bg-green-100 text-green-800'
                              : file.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : file.status === 'uploading'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {file.status}
                        </span>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {file.status === 'uploading' && file.progress !== undefined && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{file.progress}% uploaded</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
