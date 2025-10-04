'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [formData, setFormData] = useState({
    ngoName: '',
    projectName: '',
    location: '',
    claimedTrees: '',
    description: ''
  });
  
  const [files, setFiles] = useState<{
    groundImages: FileList | null;
    satelliteImages: FileList | null; 
    iotData: File | null;
  }>({
    groundImages: null,
    satelliteImages: null,
    iotData: null
  });
  
  const [currentStep, setCurrentStep] = useState('form');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting AI verification with data:', formData);
    console.log('Files:', files);
    
    setCurrentStep('processing');

    // Simulate AI processing
    setTimeout(() => {
      setCurrentStep('success');
      
      // Save to dynamic data manager
      if (typeof window !== 'undefined') {
        try {
          const { addUserProject } = require('../../utils/dynamicDataManager');
          
          const newProject = {
            id: Date.now().toString(),
            ngoName: formData.ngoName,
            projectName: formData.projectName,
            location: formData.location,
            claimedTrees: parseInt(formData.claimedTrees),
            description: formData.description,
            status: 'Pending Verification',
            submissionDate: new Date().toISOString(),
            files: {
              groundImages: files.groundImages?.length || 0,
              satelliteImages: files.satelliteImages?.length || 0,
              iotData: files.iotData ? 'uploaded' : 'none'
            }
          };
          
          addUserProject(newProject);
          console.log('Project added successfully:', newProject);
        } catch (error) {
          console.error('Error adding project:', error);
        }
      }
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'file') {
      const inputElement = e.target as HTMLInputElement;
      const selectedFiles = inputElement.files;
      
      if (inputElement.name === 'iotData') {
        setFiles(prev => ({
          ...prev,
          iotData: selectedFiles ? selectedFiles[0] : null
        }));
      } else {
        setFiles(prev => ({
          ...prev,
          [inputElement.name]: selectedFiles
        }));
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };
  
  const resetForm = () => {
    setFormData({
      ngoName: '',
      projectName: '',
      location: '',
      claimedTrees: '',
      description: ''
    });
    setFiles({
      groundImages: null,
      satelliteImages: null,
      iotData: null
    });
    setCurrentStep('form');
    setSubmitted(false);
  };

  if (currentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🤖 AI Verification in Progress</h2>
                <p className="text-gray-600 mb-6">
                  Our advanced AI models are analyzing your mangrove plantation project...
                </p>
                
                <div className="space-y-4 text-left bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span>📸 Processing images ({(files.groundImages?.length || 0) + (files.satelliteImages?.length || 0)} files)</span>
                  </div>
                  
                  {files.iotData && (
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span>📊 Processing IoT sensor data (CSV file)</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>🌳 Running YOLO tree detection...</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>🍃 Calculating NDVI vegetation health...</span>
                  </div>
                  
                  {files.iotData && (
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>🌊 Analyzing environmental conditions...</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>⚡ Computing final verification score...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'success' || submitted) {
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-3 border rounded-lg"
                placeholder="Describe your mangrove plantation project"
              />
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📸 Upload Supporting Evidence</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ground-level Images
                </label>
                <input
                  type="file"
                  name="groundImages"
                  onChange={handleChange}
                  multiple
                  accept="image/*"
                  className="w-full p-3 border rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-1">Upload photos taken at ground level showing mangroves</p>
                {files.groundImages && files.groundImages.length > 0 && (
                  <p className="text-sm text-green-600 mt-1">✓ {files.groundImages.length} files selected</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Satellite/Aerial Images
                </label>
                <input
                  type="file"
                  name="satelliteImages"
                  onChange={handleChange}
                  multiple
                  accept="image/*"
                  className="w-full p-3 border rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-1">Upload satellite or drone imagery of the plantation area</p>
                {files.satelliteImages && files.satelliteImages.length > 0 && (
                  <p className="text-sm text-green-600 mt-1">✓ {files.satelliteImages.length} files selected</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IoT Sensor Data (CSV) - Optional
                </label>
                <input
                  type="file"
                  name="iotData"
                  onChange={handleChange}
                  accept=".csv"
                  className="w-full p-3 border rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload CSV file with IoT sensor data (timestamp, soil_moisture, temperature, salinity, ph, dissolved_oxygen)
                </p>
                {files.iotData && (
                  <p className="text-sm text-green-600 mt-1">✓ CSV file selected: {files.iotData.name}</p>
                )}
              </div>
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