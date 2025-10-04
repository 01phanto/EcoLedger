"""
NDVI Analysis API
Calculates Normalized Difference Vegetation Index from satellite/drone images
"""

import numpy as np
import cv2
from PIL import Image
import io
import os
import matplotlib.pyplot as plt
import logging

logger = logging.getLogger(__name__)

class NDVIAnalysisAPI:
    def __init__(self):
        """Initialize NDVI analyzer"""
        self.output_dir = "outputs/ndvi"
        os.makedirs(self.output_dir, exist_ok=True)
    
    def calculate_ndvi(self, image_file):
        """
        Calculate NDVI from uploaded image
        NDVI = (NIR - RED) / (NIR + RED)
        
        Args:
            image_file: Flask uploaded file object
            
        Returns:
            dict: NDVI analysis results
        """
        try:
            # Read image
            image_bytes = image_file.read()
            image = Image.open(io.BytesIO(image_bytes))
            image_np = np.array(image)
            
            # For demo purposes, we'll simulate NIR and RED bands
            # In real application, you'd have multispectral images
            if len(image_np.shape) == 3:
                # RGB image - simulate NIR and RED extraction
                red_band, nir_band = self._simulate_multispectral(image_np)
            else:
                # Grayscale - create synthetic bands
                red_band = image_np
                nir_band = image_np * 1.2  # Simulate higher NIR reflectance
            
            # Calculate NDVI
            ndvi_map = self._compute_ndvi(nir_band, red_band)
            
            # Calculate statistics
            mean_ndvi = np.mean(ndvi_map)
            max_ndvi = np.max(ndvi_map)
            min_ndvi = np.min(ndvi_map)
            std_ndvi = np.std(ndvi_map)
            
            # Normalize to 0-1 score (NDVI ranges from -1 to 1)
            ndvi_score = (mean_ndvi + 1) / 2  # Convert from [-1,1] to [0,1]
            ndvi_score = max(0, min(1, ndvi_score))  # Clamp to [0,1]
            
            # Generate NDVI visualization
            ndvi_map_url = self._save_ndvi_visualization(ndvi_map, image_file.filename)
            
            # Calculate vegetation coverage
            vegetation_pixels = np.sum(ndvi_map > 0.2)  # NDVI > 0.2 indicates vegetation
            total_pixels = ndvi_map.size
            vegetation_coverage = vegetation_pixels / total_pixels
            
            # Health classification
            health_status = self._classify_vegetation_health(mean_ndvi)
            
            return {
                "NDVI_Score": round(ndvi_score, 3),
                "Mean_NDVI": round(mean_ndvi, 3),
                "Max_NDVI": round(max_ndvi, 3),
                "Min_NDVI": round(min_ndvi, 3),
                "Std_NDVI": round(std_ndvi, 3),
                "Vegetation_Coverage": round(vegetation_coverage, 3),
                "Health_Status": health_status,
                "NDVI_Map_URL": ndvi_map_url,
                "status": "success"
            }
            
        except Exception as e:
            logger.error(f"NDVI calculation failed: {e}")
            return {
                "error": f"NDVI calculation failed: {str(e)}",
                "NDVI_Score": 0.0,
                "Mean_NDVI": 0.0,
                "NDVI_Map_URL": None
            }
    
    def _simulate_multispectral(self, rgb_image):
        """
        Simulate NIR and RED bands from RGB image
        In real applications, you'd have actual multispectral data
        """
        try:
            # Extract RGB channels
            red = rgb_image[:, :, 0].astype(np.float64)
            green = rgb_image[:, :, 1].astype(np.float64)
            blue = rgb_image[:, :, 2].astype(np.float64)
            
            # Simulate NIR band based on green areas
            # Areas with high green values likely have high NIR reflectance
            nir_simulated = green * 1.5 + red * 0.3
            
            # Use red channel as RED band
            red_band = red
            
            # Normalize to 0-255
            nir_simulated = np.clip(nir_simulated, 0, 255)
            
            return red_band, nir_simulated
            
        except Exception as e:
            logger.error(f"Multispectral simulation failed: {e}")
            # Fallback to grayscale
            gray = cv2.cvtColor(rgb_image, cv2.COLOR_RGB2GRAY)
            return gray, gray * 1.3
    
    def _compute_ndvi(self, nir, red):
        """
        Compute NDVI from NIR and RED bands
        NDVI = (NIR - RED) / (NIR + RED)
        """
        try:
            # Convert to float to avoid division issues
            nir = nir.astype(np.float64)
            red = red.astype(np.float64)
            
            # Calculate NDVI
            numerator = nir - red
            denominator = nir + red
            
            # Avoid division by zero
            denominator[denominator == 0] = 1
            
            ndvi = numerator / denominator
            
            # Clip values to valid NDVI range [-1, 1]
            ndvi = np.clip(ndvi, -1, 1)
            
            return ndvi
            
        except Exception as e:
            logger.error(f"NDVI computation failed: {e}")
            return np.zeros_like(nir)
    
    def _classify_vegetation_health(self, mean_ndvi):
        """
        Classify vegetation health based on mean NDVI
        """
        if mean_ndvi > 0.6:
            return "Excellent"
        elif mean_ndvi > 0.4:
            return "Good"
        elif mean_ndvi > 0.2:
            return "Moderate"
        elif mean_ndvi > 0:
            return "Poor"
        else:
            return "Very Poor"
    
    def _save_ndvi_visualization(self, ndvi_map, original_filename):
        """
        Create and save NDVI visualization
        """
        try:
            # Create visualization
            plt.figure(figsize=(12, 5))
            
            # NDVI map
            plt.subplot(1, 2, 1)
            im1 = plt.imshow(ndvi_map, cmap='RdYlGn', vmin=-1, vmax=1)
            plt.title('NDVI Map')
            plt.colorbar(im1, label='NDVI Value')
            plt.axis('off')
            
            # NDVI histogram
            plt.subplot(1, 2, 2)
            plt.hist(ndvi_map.flatten(), bins=50, alpha=0.7, color='green')
            plt.xlabel('NDVI Value')
            plt.ylabel('Frequency')
            plt.title('NDVI Distribution')
            plt.grid(True, alpha=0.3)
            
            # Save visualization
            output_filename = f"ndvi_{original_filename.split('.')[0]}.png"
            output_path = os.path.join(self.output_dir, output_filename)
            plt.tight_layout()
            plt.savefig(output_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            return output_path
            
        except Exception as e:
            logger.error(f"Failed to save NDVI visualization: {e}")
            return None
    
    def analyze_temporal_changes(self, image_files, timestamps):
        """
        Analyze NDVI changes over time (for multiple images)
        """
        try:
            ndvi_history = []
            
            for i, image_file in enumerate(image_files):
                result = self.calculate_ndvi(image_file)
                ndvi_history.append({
                    "timestamp": timestamps[i],
                    "mean_ndvi": result.get("Mean_NDVI", 0),
                    "ndvi_score": result.get("NDVI_Score", 0),
                    "vegetation_coverage": result.get("Vegetation_Coverage", 0)
                })
            
            # Calculate trends
            if len(ndvi_history) > 1:
                ndvi_values = [entry["mean_ndvi"] for entry in ndvi_history]
                trend = "Improving" if ndvi_values[-1] > ndvi_values[0] else "Declining"
                change_rate = (ndvi_values[-1] - ndvi_values[0]) / len(ndvi_values)
            else:
                trend = "Insufficient data"
                change_rate = 0
            
            return {
                "ndvi_history": ndvi_history,
                "trend": trend,
                "change_rate": round(change_rate, 4),
                "status": "success"
            }
            
        except Exception as e:
            logger.error(f"Temporal analysis failed: {e}")
            return {
                "error": f"Temporal analysis failed: {str(e)}",
                "ndvi_history": [],
                "trend": "Unknown"
            }