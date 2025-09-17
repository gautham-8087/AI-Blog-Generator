import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  content: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ content }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCopy = async () => {
    if (!content || isLoading) return;

    setIsLoading(true);
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy content:', error);
      
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      
      document.body.removeChild(textArea);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!content || isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 
                 ${copied 
                   ? 'bg-green-100 text-green-700 border border-green-300' 
                   : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300'
                 } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      ) : copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
      <span className="text-sm">
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  );
};

export default CopyButton;