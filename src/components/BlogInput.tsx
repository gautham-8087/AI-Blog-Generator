import React, { useState, useRef } from 'react';
import { Search, Wand2, AlertCircle } from 'lucide-react';

interface BlogInputProps {
  onGenerate: (topic: string) => void;
  isGenerating: boolean;
  error: string;
}

const BlogInput: React.FC<BlogInputProps> = ({ onGenerate, isGenerating, error }) => {
  const [topic, setTopic] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(500);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isGenerating) {
      onGenerate(topic);
    }
  };

  // Handle topic input change
  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Search className="w-6 h-6 text-blue-500" />
        Generate Your Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input */}
        <div>
          <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-2">
            Blog Topic or Keyword
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="topic"
              type="text"
              value={topic}
              onChange={handleTopicChange}
              placeholder="e.g., Machine Learning in Healthcare, Digital Marketing Trends, etc."
              className="w-full px-4 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm
                       placeholder-gray-400"
              disabled={isGenerating}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {topic && (
            <p className="mt-2 text-sm text-gray-500">
              {topic.length} characters • {topic.trim().split(/\s+/).length} words
            </p>
          )}
        </div>

        {/* Word Count Selector */}
        <div>
          <label htmlFor="wordCount" className="block text-sm font-semibold text-gray-700 mb-2">
            Target Word Count
          </label>
          <select
            id="wordCount"
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
            disabled={isGenerating}
          >
            <option value={300}>300 words (Quick Read)</option>
            <option value={500}>500 words (Standard)</option>
            <option value={750}>750 words (Detailed)</option>
            <option value={1000}>1000 words (Comprehensive)</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Generate Button */}
        <button
          type="submit"
          disabled={!topic.trim() || isGenerating}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                   text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center 
                   justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Amazing Content...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Blog Post ({wordCount} words)
            </>
          )}
        </button>
      </form>

      {/* Generation Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Tips for Better Results</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Be specific with your topic (e.g., "Social Media Marketing for Small Businesses")</li>
          <li>• Include keywords you want to target</li>
          <li>• Mention your target audience if relevant</li>
        </ul>
      </div>
    </div>
  );
};

export default BlogInput;