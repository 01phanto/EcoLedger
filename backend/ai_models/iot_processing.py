"""
IoT Sensor Data Processing API
Processes soil moisture, temperature, and salinity data from IoT sensors
"""

import pandas as pd
import numpy as np
import io
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class IoTProcessingAPI:
    def __init__(self):
        """Initialize IoT data processor"""
        # Define optimal ranges for mangrove growth
        self.optimal_ranges = {
            'soil_moisture': {'min': 60, 'max': 90},      # Percentage
            'temperature': {'min': 20, 'max': 35},         # Celsius
            'salinity': {'min': 10, 'max': 35},            # ppt (parts per thousand)
            'ph': {'min': 6.5, 'max': 8.5},               # pH scale
            'dissolved_oxygen': {'min': 4, 'max': 8}       # mg/L
        }
        
        # Define marginal ranges
        self.marginal_ranges = {
            'soil_moisture': {'min': 40, 'max': 95},
            'temperature': {'min': 15, 'max': 40},
            'salinity': {'min': 5, 'max': 45},
            'ph': {'min': 5.5, 'max': 9.0},
            'dissolved_oxygen': {'min': 2, 'max': 12}
        }
    
    def process_json_data(self, json_data):
        """
        Process IoT sensor data from JSON input
        
        Args:
            json_data: Dictionary with sensor readings
            
        Returns:
            dict: IoT analysis results
        """
        try:
            # Convert to DataFrame for easier processing
            if isinstance(json_data, list):
                df = pd.DataFrame(json_data)
            elif isinstance(json_data, dict):
                # Single reading
                if 'readings' in json_data:
                    df = pd.DataFrame(json_data['readings'])
                else:
                    df = pd.DataFrame([json_data])
            else:
                raise ValueError("Invalid JSON data format")
            
            return self._analyze_sensor_data(df)
            
        except Exception as e:
            logger.error(f"JSON data processing failed: {e}")
            return {
                "error": f"JSON processing failed: {str(e)}",
                "IoT_Score": 0.0,
                "parameters": {}
            }
    
    def process_csv_data(self, csv_file):
        """
        Process IoT sensor data from CSV file
        
        Args:
            csv_file: Flask uploaded CSV file
            
        Returns:
            dict: IoT analysis results
        """
        try:
            # Read CSV file
            csv_content = csv_file.read().decode('utf-8')
            df = pd.read_csv(io.StringIO(csv_content))
            
            return self._analyze_sensor_data(df)
            
        except Exception as e:
            logger.error(f"CSV data processing failed: {e}")
            return {
                "error": f"CSV processing failed: {str(e)}",
                "IoT_Score": 0.0,
                "parameters": {}
            }
    
    def _analyze_sensor_data(self, df):
        """
        Analyze sensor data and calculate IoT score
        
        Args:
            df: Pandas DataFrame with sensor readings
            
        Returns:
            dict: Analysis results
        """
        try:
            # Standardize column names (case insensitive)
            df.columns = df.columns.str.lower().str.replace(' ', '_')
            
            # Calculate parameter scores
            parameter_scores = {}
            parameter_details = {}
            
            for param in self.optimal_ranges.keys():
                if param in df.columns:
                    values = df[param].dropna()
                    if len(values) > 0:
                        score, details = self._calculate_parameter_score(param, values)
                        parameter_scores[param] = score
                        parameter_details[param] = details
            
            # If no recognized parameters, try to infer from available columns
            if not parameter_scores:
                parameter_scores, parameter_details = self._infer_parameters(df)
            
            # Calculate overall IoT score
            if parameter_scores:
                iot_score = np.mean(list(parameter_scores.values()))
            else:
                iot_score = 0.5  # Default moderate score if no data
            
            # Generate recommendations
            recommendations = self._generate_recommendations(parameter_details)
            
            # Calculate data quality metrics
            data_quality = self._assess_data_quality(df)
            
            return {
                "IoT_Score": round(iot_score, 3),
                "Parameter_Scores": {k: round(v, 3) for k, v in parameter_scores.items()},
                "Parameter_Details": parameter_details,
                "Data_Quality": data_quality,
                "Recommendations": recommendations,
                "Total_Readings": len(df),
                "status": "success"
            }
            
        except Exception as e:
            logger.error(f"Sensor data analysis failed: {e}")
            return {
                "error": f"Analysis failed: {str(e)}",
                "IoT_Score": 0.0,
                "parameters": {}
            }
    
    def _calculate_parameter_score(self, param, values):
        """
        Calculate score for a specific parameter
        
        Args:
            param: Parameter name
            values: Series of parameter values
            
        Returns:
            tuple: (score, details)
        """
        try:
            mean_value = np.mean(values)
            std_value = np.std(values)
            min_value = np.min(values)
            max_value = np.max(values)
            
            optimal = self.optimal_ranges[param]
            marginal = self.marginal_ranges[param]
            
            # Calculate score based on how many readings are in optimal/marginal ranges
            optimal_count = np.sum((values >= optimal['min']) & (values <= optimal['max']))
            marginal_count = np.sum((values >= marginal['min']) & (values <= marginal['max']))
            total_count = len(values)
            
            # Score calculation
            optimal_ratio = optimal_count / total_count
            marginal_ratio = (marginal_count - optimal_count) / total_count
            poor_ratio = 1 - (marginal_count / total_count)
            
            score = optimal_ratio * 1.0 + marginal_ratio * 0.5 + poor_ratio * 0.0
            
            # Determine status
            if optimal_ratio > 0.7:
                status = "Optimal"
            elif marginal_ratio > 0.5:
                status = "Marginal"
            else:
                status = "Poor"
            
            details = {
                "mean": round(mean_value, 2),
                "std": round(std_value, 2),
                "min": round(min_value, 2),
                "max": round(max_value, 2),
                "optimal_range": optimal,
                "optimal_ratio": round(optimal_ratio, 3),
                "marginal_ratio": round(marginal_ratio, 3),
                "status": status,
                "total_readings": total_count
            }
            
            return score, details
            
        except Exception as e:
            logger.error(f"Parameter score calculation failed for {param}: {e}")
            return 0.5, {"error": str(e)}
    
    def _infer_parameters(self, df):
        """
        Try to infer parameter types from column names and data ranges
        """
        parameter_scores = {}
        parameter_details = {}
        
        for column in df.columns:
            values = df[column].dropna()
            if len(values) == 0:
                continue
            
            mean_val = np.mean(values)
            
            # Infer parameter type based on value ranges and column names
            if 'moisture' in column.lower() or 'humidity' in column.lower():
                # Treat as soil moisture (percentage)
                if 0 <= mean_val <= 100:
                    score = self._simple_score(mean_val, 60, 90, 40, 95)
                    parameter_scores['soil_moisture'] = score
                    parameter_details['soil_moisture'] = {
                        "mean": round(mean_val, 2),
                        "inferred_from": column,
                        "status": "Inferred"
                    }
            
            elif 'temp' in column.lower():
                # Treat as temperature
                if -50 <= mean_val <= 60:
                    score = self._simple_score(mean_val, 20, 35, 15, 40)
                    parameter_scores['temperature'] = score
                    parameter_details['temperature'] = {
                        "mean": round(mean_val, 2),
                        "inferred_from": column,
                        "status": "Inferred"
                    }
            
            elif 'sal' in column.lower() or 'salt' in column.lower():
                # Treat as salinity
                if 0 <= mean_val <= 100:
                    score = self._simple_score(mean_val, 10, 35, 5, 45)
                    parameter_scores['salinity'] = score
                    parameter_details['salinity'] = {
                        "mean": round(mean_val, 2),
                        "inferred_from": column,
                        "status": "Inferred"
                    }
            
            elif 'ph' in column.lower():
                # Treat as pH
                if 0 <= mean_val <= 14:
                    score = self._simple_score(mean_val, 6.5, 8.5, 5.5, 9.0)
                    parameter_scores['ph'] = score
                    parameter_details['ph'] = {
                        "mean": round(mean_val, 2),
                        "inferred_from": column,
                        "status": "Inferred"
                    }
        
        return parameter_scores, parameter_details
    
    def _simple_score(self, value, opt_min, opt_max, marg_min, marg_max):
        """Simple scoring for single values"""
        if opt_min <= value <= opt_max:
            return 1.0
        elif marg_min <= value <= marg_max:
            return 0.5
        else:
            return 0.0
    
    def _generate_recommendations(self, parameter_details):
        """Generate recommendations based on parameter analysis"""
        recommendations = []
        
        for param, details in parameter_details.items():
            if details.get('status') == 'Poor':
                if param == 'soil_moisture':
                    if details['mean'] < 40:
                        recommendations.append("Increase irrigation to improve soil moisture")
                    else:
                        recommendations.append("Reduce irrigation to prevent waterlogging")
                
                elif param == 'temperature':
                    if details['mean'] < 15:
                        recommendations.append("Consider protection from cold temperatures")
                    else:
                        recommendations.append("Provide shade or cooling to reduce temperature stress")
                
                elif param == 'salinity':
                    if details['mean'] > 45:
                        recommendations.append("Reduce salinity through freshwater flushing")
                    else:
                        recommendations.append("Monitor salinity levels for mangrove health")
                
                elif param == 'ph':
                    if details['mean'] < 6.5:
                        recommendations.append("Consider pH buffering to reduce acidity")
                    else:
                        recommendations.append("Reduce alkalinity through organic matter addition")
        
        if not recommendations:
            recommendations.append("Environmental conditions are suitable for mangrove growth")
        
        return recommendations
    
    def _assess_data_quality(self, df):
        """Assess the quality of the sensor data"""
        total_cells = df.size
        missing_cells = df.isnull().sum().sum()
        completeness = 1 - (missing_cells / total_cells) if total_cells > 0 else 0
        
        # Check for reasonable data ranges
        outlier_ratio = 0
        for column in df.select_dtypes(include=[np.number]).columns:
            values = df[column].dropna()
            if len(values) > 0:
                Q1 = np.percentile(values, 25)
                Q3 = np.percentile(values, 75)
                IQR = Q3 - Q1
                outliers = np.sum((values < (Q1 - 1.5 * IQR)) | (values > (Q3 + 1.5 * IQR)))
                outlier_ratio += outliers / len(values)
        
        outlier_ratio = outlier_ratio / len(df.select_dtypes(include=[np.number]).columns) if len(df.select_dtypes(include=[np.number]).columns) > 0 else 0
        
        # Overall quality score
        quality_score = completeness * 0.7 + (1 - outlier_ratio) * 0.3
        
        return {
            "completeness": round(completeness, 3),
            "outlier_ratio": round(outlier_ratio, 3),
            "quality_score": round(quality_score, 3),
            "total_readings": len(df),
            "parameters_detected": len(df.columns)
        }
    
    def generate_synthetic_data(self, num_readings=100):
        """
        Generate synthetic IoT sensor data for testing
        """
        try:
            np.random.seed(42)  # For reproducible results
            
            data = []
            for i in range(num_readings):
                # Generate realistic sensor readings with some variation
                reading = {
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "soil_moisture": np.random.normal(75, 10),  # Optimal range with variation
                    "temperature": np.random.normal(27, 5),     # Good temperature
                    "salinity": np.random.normal(25, 8),        # Suitable salinity
                    "ph": np.random.normal(7.5, 0.5),          # Good pH
                    "dissolved_oxygen": np.random.normal(6, 1.5) # Good DO levels
                }
                
                # Clip values to realistic ranges
                reading["soil_moisture"] = np.clip(reading["soil_moisture"], 0, 100)
                reading["temperature"] = np.clip(reading["temperature"], 10, 45)
                reading["salinity"] = np.clip(reading["salinity"], 0, 50)
                reading["ph"] = np.clip(reading["ph"], 5, 9)
                reading["dissolved_oxygen"] = np.clip(reading["dissolved_oxygen"], 0, 15)
                
                data.append(reading)
            
            return data
            
        except Exception as e:
            logger.error(f"Synthetic data generation failed: {e}")
            return []