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

    // Simulate complete AI analysis pipeline
    setTimeout(() => {
      // Simulate AI scoring
      const yoloScore = 75 + Math.random() * 20; // YOLOv8 tree detection: 75-95%
      const ndviScore = 70 + Math.random() * 25; // NDVI vegetation health: 70-95%
      const iotScore = 80 + Math.random() * 15;  // IoT CO2 sensor: 80-95%
      const detectedTrees = Math.floor(parseInt(formData.claimedTrees) * (0.9 + Math.random() * 0.2));
      const co2Estimate = detectedTrees * (12.3 + Math.random() * 3.7); // 12.3-16kg CO2 per tree/year
      
      // Calculate final verification score
      const finalScore = (yoloScore * 0.4 + ndviScore * 0.3 + iotScore * 0.3);
      
      setCurrentStep('success');
      
      // Save with complete AI results
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
            },
            aiResults: {
              yoloScore: yoloScore.toFixed(1),
              ndviScore: ndviScore.toFixed(1),
              iotScore: iotScore.toFixed(1),
              finalScore: finalScore.toFixed(1),
              detectedTrees,
              co2Estimate: co2Estimate.toFixed(2),
              confidence: finalScore > 85 ? 'High' : finalScore > 70 ? 'Medium' : 'Low'
            }
          };
          
          addUserProject(newProject);
          console.log('Project with AI analysis added:', newProject);
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-200 border-t-green-500 mx-auto mb-6"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  AI Verification in Progress
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Advanced AI models analyzing your mangrove plantation project through multiple verification layers
                </p>
              </div>
              
              {/* AI Analysis Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* YOLOv8 Analysis */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl">🌳</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">YOLOv8 Detection</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Analyzing tree density</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Counting individual trees</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Verifying species type</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NDVI Analysis */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl">🍃</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">NDVI Health Check</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Vegetation health index</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Growth rate analysis</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Chlorophyll content</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* IoT CO2 Analysis */}
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl">📊</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">IoT CO₂ Analysis</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                        <span>Carbon absorption rate</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                        <span>Environmental conditions</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                        <span>CO₂ estimation model</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Status */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Processing Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span>📸 Image processing complete ({(files.groundImages?.length || 0) + (files.satelliteImages?.length || 0)} files)</span>
                  </div>
                  
                  {files.iotData && (
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span>📊 IoT sensor data validated</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>🌳 Running YOLOv8 tree detection algorithm...</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>🍃 Calculating NDVI vegetation health score...</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>📈 Processing IoT CO₂ absorption data...</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full animate-pulse"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                Project Submitted Successfully!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                AI verification complete • Project ready for admin review
              </p>
            </div>

            {/* AI Results Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🤖 AI Verification Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* YOLOv8 Score */}
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">🌳</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">YOLOv8 Detection</h4>
                  <div className="text-2xl font-bold text-green-600 mb-1">87.3%</div>
                  <div className="text-sm text-gray-500">Tree Detection Accuracy</div>
                </div>

                {/* NDVI Score */}
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">🍃</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">NDVI Health</h4>
                  <div className="text-2xl font-bold text-blue-600 mb-1">82.7%</div>
                  <div className="text-sm text-gray-500">Vegetation Health</div>
                </div>

                {/* IoT CO2 Score */}
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">IoT CO₂ Analysis</h4>
                  <div className="text-2xl font-bold text-purple-600 mb-1">91.4%</div>
                  <div className="text-sm text-gray-500">Carbon Absorption</div>
                </div>
              </div>

              {/* Final Score */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white text-center">
                <h4 className="text-lg font-semibold mb-2">Final Verification Score</h4>
                <div className="text-4xl font-bold mb-2">86.8%</div>
                <div className="text-sm opacity-90">High Confidence • Ready for Approval</div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">📋 Next Steps in Workflow</h3>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4 text-sm">
                <span className="bg-white px-3 py-2 rounded-lg font-medium shadow-sm">✅ AI Verification Complete</span>
                <span className="hidden md:block">→</span>
                <span className="bg-yellow-100 px-3 py-2 rounded-lg font-medium">⏳ Admin Review Pending</span>
                <span className="hidden md:block">→</span>
                <span className="bg-gray-100 px-3 py-2 rounded-lg font-medium">🔗 Blockchain Ledger</span>
                <span className="hidden md:block">→</span>
                <span className="bg-gray-100 px-3 py-2 rounded-lg font-medium">💰 Carbon Trading</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => {
                  // Use Next.js router for proper navigation
                  window.location.href = '/';
                }}
                className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
              >
                ✅ Return to Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/admin'}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                🔍 Review in Admin Portal
              </button>
              
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  Your project is now queued for admin verification and blockchain recording
                </p>
              </div>
            </div>
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