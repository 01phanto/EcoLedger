"""
Sample Data Generator for EcoLedger Testing
Generates synthetic IoT sensor data and test images
"""

import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os

def generate_sample_iot_data():
    """Generate sample IoT sensor data CSV"""
    np.random.seed(42)  # For reproducible results
    
    # Generate 30 days of hourly readings
    start_date = datetime.now() - timedelta(days=30)
    timestamps = [start_date + timedelta(hours=i) for i in range(30 * 24)]
    
    data = []
    for timestamp in timestamps:
        # Generate realistic sensor readings with daily and seasonal patterns
        hour = timestamp.hour
        day_of_year = timestamp.timetuple().tm_yday
        
        # Soil moisture (60-90% optimal, with daily variation)
        base_moisture = 75 + 10 * np.sin(2 * np.pi * day_of_year / 365)  # Seasonal variation
        daily_moisture_var = 5 * np.sin(2 * np.pi * hour / 24)  # Daily variation
        soil_moisture = base_moisture + daily_moisture_var + np.random.normal(0, 3)
        soil_moisture = np.clip(soil_moisture, 30, 95)
        
        # Temperature (20-35°C optimal, with daily cycle)
        base_temp = 27 + 3 * np.sin(2 * np.pi * day_of_year / 365)  # Seasonal
        daily_temp_var = 8 * np.sin(2 * np.pi * (hour - 6) / 24)  # Peak at 2 PM
        temperature = base_temp + daily_temp_var + np.random.normal(0, 2)
        temperature = np.clip(temperature, 15, 40)
        
        # Salinity (10-35 ppt optimal, more stable)
        salinity = 25 + np.sin(2 * np.pi * day_of_year / 365) + np.random.normal(0, 2)
        salinity = np.clip(salinity, 5, 45)
        
        # pH (6.5-8.5 optimal, stable with small variations)
        ph = 7.5 + 0.5 * np.sin(2 * np.pi * day_of_year / 365) + np.random.normal(0, 0.2)
        ph = np.clip(ph, 6.0, 9.0)
        
        # Dissolved Oxygen (4-8 mg/L optimal)
        dissolved_oxygen = 6 + 1.5 * np.sin(2 * np.pi * hour / 24) + np.random.normal(0, 0.5)
        dissolved_oxygen = np.clip(dissolved_oxygen, 2, 12)
        
        data.append({
            "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "soil_moisture": round(soil_moisture, 1),
            "temperature": round(temperature, 1),
            "salinity": round(salinity, 1),
            "ph": round(ph, 2),
            "dissolved_oxygen": round(dissolved_oxygen, 1)
        })
    
    return data

def generate_test_scenarios():
    """Generate various test scenarios for API testing"""
    scenarios = {
        "excellent_conditions": {
            "description": "Optimal environmental conditions",
            "tree_count": 150,
            "claimed_trees": 160,
            "ndvi_score": 0.85,
            "iot_data": [
                {"soil_moisture": 75, "temperature": 27, "salinity": 25, "ph": 7.5, "dissolved_oxygen": 6},
                {"soil_moisture": 78, "temperature": 26, "salinity": 23, "ph": 7.4, "dissolved_oxygen": 6.2},
                {"soil_moisture": 72, "temperature": 28, "salinity": 27, "ph": 7.6, "dissolved_oxygen": 5.8}
            ]
        },
        
        "good_conditions": {
            "description": "Good environmental conditions with minor issues",
            "tree_count": 120,
            "claimed_trees": 140,
            "ndvi_score": 0.72,
            "iot_data": [
                {"soil_moisture": 65, "temperature": 32, "salinity": 30, "ph": 7.2, "dissolved_oxygen": 5.5},
                {"soil_moisture": 68, "temperature": 31, "salinity": 28, "ph": 7.3, "dissolved_oxygen": 5.8},
                {"soil_moisture": 62, "temperature": 33, "salinity": 32, "ph": 7.1, "dissolved_oxygen": 5.2}
            ]
        },
        
        "moderate_conditions": {
            "description": "Moderate conditions requiring attention",
            "tree_count": 90,
            "claimed_trees": 130,
            "ndvi_score": 0.58,
            "iot_data": [
                {"soil_moisture": 45, "temperature": 38, "salinity": 40, "ph": 6.8, "dissolved_oxygen": 4.2},
                {"soil_moisture": 48, "temperature": 37, "salinity": 38, "ph": 6.9, "dissolved_oxygen": 4.5},
                {"soil_moisture": 42, "temperature": 39, "salinity": 42, "ph": 6.7, "dissolved_oxygen": 4.0}
            ]
        },
        
        "poor_conditions": {
            "description": "Poor conditions with multiple issues",
            "tree_count": 60,
            "claimed_trees": 150,
            "ndvi_score": 0.35,
            "iot_data": [
                {"soil_moisture": 25, "temperature": 45, "salinity": 50, "ph": 6.2, "dissolved_oxygen": 2.5},
                {"soil_moisture": 28, "temperature": 44, "salinity": 48, "ph": 6.1, "dissolved_oxygen": 2.8},
                {"soil_moisture": 22, "temperature": 46, "salinity": 52, "ph": 6.0, "dissolved_oxygen": 2.2}
            ]
        }
    }
    
    return scenarios

def save_sample_data():
    """Save sample data to files"""
    # Create data directory
    data_dir = "../data"
    os.makedirs(data_dir, exist_ok=True)
    
    # Generate and save IoT sensor data
    iot_data = generate_sample_iot_data()
    
    # Save as CSV
    df = pd.DataFrame(iot_data)
    df.to_csv(os.path.join(data_dir, "sample_iot_sensors.csv"), index=False)
    
    # Save as JSON
    with open(os.path.join(data_dir, "sample_iot_sensors.json"), 'w') as f:
        json.dump(iot_data, f, indent=2)
    
    # Generate and save test scenarios
    scenarios = generate_test_scenarios()
    with open(os.path.join(data_dir, "test_scenarios.json"), 'w') as f:
        json.dump(scenarios, f, indent=2)
    
    print(f"Sample data saved to {data_dir}/")
    print(f"- IoT sensor data: {len(iot_data)} readings")
    print(f"- Test scenarios: {len(scenarios)} scenarios")

if __name__ == "__main__":
    save_sample_data()