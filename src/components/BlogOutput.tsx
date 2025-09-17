import React from 'react';
import { FileText, Clock, BarChart3, Trash2 } from 'lucide-react';
import { BlogContent } from '../types/blog';
import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';

interface BlogOutputProps {
  content: BlogContent | null;
  isGenerating: boolean;
  onClear: () => void;
}

const BlogOutput: React.FC<BlogOutputProps> = ({ content, isGenerating, onClear }) => {
  // Calculate reading time (average 200 words per minute)
  const calculateReadingTime = (wordCount: number): string => {
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  // Generate formatted blog content as string for copying/downloading
  const getFormattedContent = (): string => {
    if (!content) return '';
    
    let formatted = `${content.title}\n\n`;
    formatted += `${content.introduction}\n\n`;
    
    content.sections.forEach((section, index) => {
      formatted += `${section.heading}\n\n`;
      section.paragraphs.forEach(paragraph => {
        formatted += `${paragraph}\n\n`;
      });
      if (section.bulletPoints && section.bulletPoints.length > 0) {
        section.bulletPoints.forEach(point => {
          formatted += `• ${point}\n`;
        });
        formatted += '\n';
      }
    });
    
    formatted += `${content.conclusion}`;
    return formatted;
  };

  // Loading state
  if (isGenerating) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
        <div className="text-center py-16">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Creating Your Blog Post</h3>
          <p className="text-gray-600">Our AI is crafting engaging content tailored to your topic...</p>
          
          {/* Progress indicators */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Analyzing your topic
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-200"></div>
              Structuring content
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-400"></div>
              Optimizing for readability
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!content) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready to Create</h3>
          <p className="text-gray-500">Enter a topic and click generate to see your AI-powered blog post appear here.</p>
        </div>
      </div>
    );
  }

  // Main content display
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl overflow-hidden">
      {/* Header with stats and actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              <span>{content.wordCount} words</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{calculateReadingTime(content.wordCount)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CopyButton content={getFormattedContent()} />
            <DownloadButton content={getFormattedContent()} title={content.title} />
            <button
              onClick={onClear}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Clear content"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Blog content */}
      <div className="p-8 max-h-[70vh] overflow-y-auto">
        <article className="prose prose-lg max-w-none">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
            {content.title}
          </h1>

          {/* Introduction */}
          <div className="text-lg text-gray-700 leading-relaxed mb-8 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
            {content.introduction}
          </div>

          {/* Sections */}
          {content.sections.map((section, index) => (
            <section key={index} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                {section.heading}
              </h2>
              
              {section.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
              
              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="list-none space-y-2 mb-4">
                  {section.bulletPoints.map((point, bIndex) => (
                    <li key={bIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Conclusion */}
          <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-l-4 border-green-400">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Conclusion</h2>
            <p className="text-gray-700 leading-relaxed">{content.conclusion}</p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogOutput;