import React, { useState, useCallback } from 'react';
import { PenTool, Sparkles } from 'lucide-react';
import BlogInput from './BlogInput';
import BlogOutput from './BlogOutput';
import { generateBlogContent } from '../utils/blogGenerator';
import { BlogContent } from '../types/blog';

const BlogGenerator: React.FC = () => {
  const [blogContent, setBlogContent] = useState<BlogContent | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Handle blog generation
  const handleGenerateBlog = useCallback(async (topic: string) => {
    if (!topic.trim()) {
      setError('Please enter a topic or keyword');
      return;
    }

    setIsGenerating(true);
    setError('');
    setBlogContent(null);

    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      const generatedContent = generateBlogContent(topic.trim());
      setBlogContent(generatedContent);
    } catch (err) {
      setError('Failed to generate blog content. Please try again.');
      console.error('Blog generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Clear current blog content
  const handleClearContent = useCallback(() => {
    setBlogContent(null);
    setError('');
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <PenTool className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            AI Blog Generator
          </h1>
          <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Transform your ideas into compelling, well-structured blog posts instantly. 
          Enter any topic and watch AI create professional content that engages your audience.
        </p>
      </header>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <BlogInput 
            onGenerate={handleGenerateBlog}
            isGenerating={isGenerating}
            error={error}
          />
          
          {/* Quick Topic Suggestions */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Popular Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Digital Marketing', 'Web Development', 'AI Technology', 
                'Productivity Tips', 'Health & Wellness', 'Sustainable Living'
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleGenerateBlog(topic)}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 
                           text-sm font-medium text-gray-700 rounded-full transition-all duration-200 
                           hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-blue-100"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <BlogOutput 
            content={blogContent}
            isGenerating={isGenerating}
            onClear={handleClearContent}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Powered by advanced AI technology • Create unlimited blog content instantly
        </p>
      </footer>
    </div>
  );
};

export default BlogGenerator;