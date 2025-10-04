'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [formData, setFormData] = useState({
    ngoName: '',
    projectName: '',
    location: '',
    claimedTrees: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const projectId = 'PROJECT_' + Date.now();
    const newProject = {
      id: projectId,
      ngoName: formData.ngoName,
      projectName: formData.projectName,
      location: formData.location,
      claimedTrees: parseInt(formData.claimedTrees),
      submissionDate: new Date().toISOString(),
      status: 'pending_review',
      aiResults: {
        tree_count: Math.floor(parseInt(formData.claimedTrees) * 0.9),
        ndvi_score: 0.85,
        IoT_Score: 0.88,
        final_score: 87.5
      }
    };
    
    try {
      const existing = JSON.parse(localStorage.getItem('userProjects') || '[]');
      existing.push(newProject);
      localStorage.setItem('userProjects', JSON.stringify(existing));
      
      const queue = JSON.parse(localStorage.getItem('adminReviewQueue') || '[]');
      queue.push(newProject);
      localStorage.setItem('adminReviewQueue', JSON.stringify(queue));
    } catch (error) {
      console.error('Error:', error);
    }
    
    setSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-green-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Submitted Successfully!</h1>
            <p className="text-gray-600 mb-6">Your project is now in the admin review queue</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Upload Mangrove Project</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NGO Name *</label>
              <input
                type="text"
                name="ngoName"
                value={formData.ngoName}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
                placeholder="Your organization name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
                placeholder="Project name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
                placeholder="Project location"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trees Planted *</label>
              <input
                type="number"
                name="claimedTrees"
                value={formData.claimedTrees}
                onChange={handleChange}
                required
                min="1"
                className="w-full p-3 border rounded-lg"
                placeholder="Number of trees"
              />
            </div>
          </div>
          
          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
            >
              Submit for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}