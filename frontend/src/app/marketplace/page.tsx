 'use client';

import { useState, useEffect } from 'react';
import useSocket from '../../lib/useSocket';
import Toast from '../../components/Toast';
import { Search, MapPin, TreePine, Award, ShoppingCart, CheckCircle, Heart, X, TrendingUp, Leaf, Thermometer } from 'lucide-react';

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [ngoFilter, setNgoFilter] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Initialize socket to listen for CREDIT_ISSUED events
  useSocket((event: string, payload: any) => {
    if (event === 'CREDIT_ISSUED') {
      setToastMessage(`🎉 New credits issued: ${payload.credits_issued} credits (ID: ${payload.credit_id?.slice(0, 8)}...)`);
      setToastOpen(true);
      // TODO: update marketplace state by fetching latest credits from API
    }
  });
  
  const projects = [
    {
      id: '1',
      name: 'Sundarbans Restoration Phase 1',
      ngo: 'Mangrove Trust',
      location: 'Sundarbans, Bangladesh',
      region: 'Asia',
      score: 91,
      credits: 150,
      price: 12.50,
      trees: 950,
      ndviScore: 0.8,
      iotScore: 0.9,
      co2Absorbed: 475,
      area: 25,
      description: 'Large-scale mangrove restoration project in the Sundarbans delta, protecting coastal communities while sequestering carbon.',
      featured: true
    },
    {
      id: '2',
      name: 'Coastal Mangrove Shield',
      ngo: 'Green Earth Foundation',
      location: 'Kerala, India',
      region: 'Asia',
      score: 88,
      credits: 200,
      price: 10.75,
      trees: 1200,
      ndviScore: 0.75,
      iotScore: 0.85,
      co2Absorbed: 600,
      area: 32,
      description: 'Coastal mangrove restoration providing natural barriers against storm surge and tsunami protection.',
      featured: false
    },
    {
      id: '3',
      name: 'Coral Reef Mangrove Buffer',
      ngo: 'Ocean Guardian NGO',
      location: 'Palawan, Philippines',
      region: 'Asia',
      score: 85,
      credits: 125,
      price: 11.25,
      trees: 800,
      ndviScore: 0.72,
      iotScore: 0.88,
      co2Absorbed: 400,
      area: 20,
      description: 'Protecting coral reefs through strategic mangrove buffer zones, enhancing marine biodiversity.',
      featured: true
    },
    {
      id: '4',
      name: 'Island Mangrove Restoration',
      ngo: 'Pacific Reef Foundation',
      location: 'Fiji Islands',
      region: 'Pacific',
      score: 87,
      credits: 80,
      price: 14.00,
      trees: 500,
      ndviScore: 0.78,
      iotScore: 0.86,
      co2Absorbed: 250,
      area: 12,
      description: 'Island mangrove restoration protecting against sea level rise and preserving traditional fishing grounds.',
      featured: false
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.ngo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !regionFilter || project.region === regionFilter;
    const matchesNgo = !ngoFilter || project.ngo === ngoFilter;
    const matchesScore = project.score >= minScore;
    
    return matchesSearch && matchesRegion && matchesNgo && matchesScore;
  });

  const regions = [...new Set(projects.map(p => p.region))];
  const ngos = [...new Set(projects.map(p => p.ngo))];
  const totalCredits = filteredProjects.reduce((sum, p) => sum + p.credits, 0);
  const avgPrice = filteredProjects.length > 0 ? filteredProjects.reduce((sum, p) => sum + p.price, 0) / filteredProjects.length : 0;

  const openProjectDetail = (project: any) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handlePurchase = () => {
    if (!selectedProject || !purchaseAmount) return;
    
    const quantity = parseFloat(purchaseAmount);
    const totalCost = quantity * selectedProject.price;
    
    alert(`Successfully purchased ${quantity} carbon credits for $${totalCost.toFixed(2)}!`);
    setShowModal(false);
    setPurchaseAmount('');
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ECF39E] to-emerald-50">
      <Toast message={toastMessage} open={toastOpen} onClose={() => setToastOpen(false)} />
      {/* Header */}
      <div className="bg-gradient-to-r from-[#132A13] via-[#31572C] to-[#4F772D] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#ECF39E] to-[#90A955] bg-clip-text text-transparent">
            Carbon Credit Marketplace
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-4">
            Trade verified carbon credits from mangrove restoration projects worldwide
          </p>
          <p className="text-lg text-green-200 mb-8 max-w-3xl mx-auto">
            Support coastal communities while investing in proven climate solutions. 
            Every credit represents real trees planted and verified through AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-[#90A955] bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#ECF39E]">{totalCredits}</div>
              <div className="text-sm text-green-200">Credits Available</div>
            </div>
            <div className="bg-[#90A955] bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#ECF39E]">${avgPrice.toFixed(2)}</div>
              <div className="text-sm text-green-200">Average Price</div>
            </div>
            <div className="bg-[#90A955] bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#ECF39E]">{filteredProjects.length}</div>
              <div className="text-sm text-green-200">Active Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search projects, NGOs, or locations..."
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200 placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                className="px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                <option value="" className="text-gray-900">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region} className="text-gray-900">{region}</option>
                ))}
              </select>

              <select
                className="px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
                value={ngoFilter}
                onChange={(e) => setNgoFilter(e.target.value)}
              >
                <option value="" className="text-gray-900">All NGOs</option>
                {ngos.map(ngo => (
                  <option key={ngo} value={ngo} className="text-gray-900">{ngo}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-900 whitespace-nowrap">Min Score:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-20"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                />
                <span className="text-sm text-gray-900 w-8 font-medium">{minScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredProjects.length} Project{filteredProjects.length !== 1 ? 's' : ''} Available
          </h2>
          <div className="text-sm text-gray-700 font-medium">
            {totalCredits} total credits • ${avgPrice.toFixed(2)} avg price
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-[#4F772D] to-[#90A955] overflow-hidden">
                {project.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-gradient-to-r from-[#ECF39E] to-[#90A955] text-[#132A13] px-3 py-1 rounded-full text-xs font-bold">
                      ⭐ FEATURED
                    </span>
                  </div>
                )}
                
                <button className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all">
                  <Heart className="h-5 w-5 text-white" />
                </button>

                <div className="absolute inset-0 flex items-center justify-center">
                  <TreePine className="h-16 w-16 text-white opacity-50" />
                </div>

                <div className="absolute bottom-4 right-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    {project.score}%
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#4F772D] transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">{project.ngo}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {project.location}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div className="bg-green-50 rounded-lg p-3">
                    <TreePine className="h-5 w-5 text-[#4F772D] mx-auto mb-1" />
                    <div className="text-sm font-bold text-gray-900">{project.trees.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Trees</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <Leaf className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm font-bold text-gray-900">{(project.ndviScore * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-600">NDVI</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <Thermometer className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <div className="text-sm font-bold text-gray-900">{(project.iotScore * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-600">IoT</div>
                  </div>
                </div>

                {/* Credits and Price */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-2xl font-bold text-[#132A13]">${project.price}</div>
                      <div className="text-sm text-gray-600">per credit</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#4F772D]">{project.credits}</div>
                      <div className="text-sm text-gray-600">available</div>
                    </div>
                  </div>

                  <button
                    onClick={() => openProjectDetail(project)}
                    className="w-full bg-gradient-to-r from-[#4F772D] to-[#90A955] text-white py-3 rounded-lg font-semibold hover:from-[#31572C] hover:to-[#4F772D] transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    View Details & Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <TreePine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#132A13] to-[#4F772D] text-white p-6">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="pr-16">
                <h2 className="text-3xl font-bold mb-2">{selectedProject.name}</h2>
                <p className="text-green-200 text-lg">{selectedProject.ngo}</p>
                <div className="flex items-center text-green-100 mt-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  {selectedProject.location}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Project Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <TreePine className="h-8 w-8 text-[#4F772D] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{selectedProject.trees.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Trees Planted</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{selectedProject.score}%</div>
                  <div className="text-sm text-gray-600">Verified Score</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{selectedProject.co2Absorbed}</div>
                  <div className="text-sm text-gray-600">Tons CO₂ Absorbed</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <Leaf className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{selectedProject.area}</div>
                  <div className="text-sm text-gray-600">Hectares</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Project Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Purchase Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Purchase Carbon Credits</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Number of Credits
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={selectedProject.credits}
                          className="w-32 px-3 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200 placeholder:text-gray-400"
                          value={purchaseAmount}
                          onChange={(e) => setPurchaseAmount(e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="text-gray-700 font-medium">
                        × ${selectedProject.price} per credit
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      {selectedProject.credits} credits available
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Total Cost</div>
                      <div className="text-3xl font-bold text-[#132A13]">
                        ${((parseFloat(purchaseAmount) || 0) * selectedProject.price).toFixed(2)}
                      </div>
                      
                      <button
                        onClick={handlePurchase}
                        disabled={!purchaseAmount || parseFloat(purchaseAmount) <= 0}
                        className="w-full mt-4 bg-gradient-to-r from-[#4F772D] to-[#90A955] text-white py-3 rounded-lg font-semibold hover:from-[#31572C] hover:to-[#4F772D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        Purchase Credits
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}