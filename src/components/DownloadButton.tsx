import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { downloadAsTxt, downloadAsPdf } from '../utils/fileDownload';

interface DownloadButtonProps {
  content: string;
  title: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ content, title }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownload = async (format: 'txt' | 'pdf') => {
    if (!content || isDownloading) return;

    setIsDownloading(true);
    setIsOpen(false);

    try {
      if (format === 'txt') {
        await downloadAsTxt(content, title);
      } else {
        await downloadAsPdf(content, title);
      }
    } catch (error) {
      console.error(`Failed to download as ${format}:`, error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!content || isDownloading}
        className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 
                 rounded-lg font-medium transition-all duration-200 border border-purple-300
                 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Download blog post"
      >
        {isDownloading ? (
          <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span className="text-sm">Download</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 
                      min-w-48 z-10 overflow-hidden">
          <button
            onClick={() => handleDownload('txt')}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 
                     transition-colors duration-200"
          >
            <FileText className="w-4 h-4 text-gray-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Download as TXT</div>
              <div className="text-xs text-gray-500">Plain text format</div>
            </div>
          </button>
          
          <button
            onClick={() => handleDownload('pdf')}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 
                     transition-colors duration-200 border-t border-gray-100"
          >
            <FileText className="w-4 h-4 text-red-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Download as PDF</div>
              <div className="text-xs text-gray-500">Formatted document</div>
            </div>
          </button>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DownloadButton;