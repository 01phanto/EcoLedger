"""
EcoLedger Dataset Generator
===========================

This script generates realistic sample datasets for:
1. Tree Detection Images (simulated drone/satellite imagery)
2. NDVI Satellite Data (vegetation health indices)
3. IoT Sensor Data (environmental monitoring)
"""

import os
import json
import random
import numpy as np
from datetime import datetime, timedelta
import base64

def create_directories():
    """Create necessary directories for datasets"""
    directories = [
        "data/tree_detection",
        "data/ndvi_data", 
        "data/iot_sensors",
        "data/sample_projects"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created directory: {directory}")

def generate_tree_detection_data():
    """Generate sample tree detection dataset"""
    print("\n🌳 Generating Tree Detection Dataset...")
    
    # Sample base64 encoded "image" data (placeholder for real drone images)
    sample_images = []
    
    for i in range(10):
        # Simulate different mangrove plantation scenarios
        project_id = f"MANGROVE_{i+1:03d}"
        location = random.choice([
            "Sundarbans, Bangladesh",
            "Everglades, USA", 
            "Amazon Delta, Brazil",
            "Niger Delta, Nigeria",
            "Mekong Delta, Vietnam"
        ])
        
        # Generate realistic tree counts
        tree_count = random.randint(50, 300)
        confidence = round(random.uniform(0.85, 0.98), 3)
        
        # Create sample "image" metadata
        image_data = {
            "project_id": project_id,
            "location": location,
            "date_captured": (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat(),
            "image_type": "drone_rgb",
            "resolution": "4096x3072",
            "gps_coordinates": {
                "latitude": round(random.uniform(-90, 90), 6),
                "longitude": round(random.uniform(-180, 180), 6)
            },
            "area_hectares": round(random.uniform(10, 100), 2),
            "expected_tree_count": tree_count,
            "ai_detected_count": tree_count + random.randint(-10, 10),
            "confidence_score": confidence,
            "weather_conditions": random.choice(["Clear", "Partly Cloudy", "Overcast"]),
            "image_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",  # 1x1 pixel placeholder
            "annotations": [
                {
                    "tree_id": j+1,
                    "x": random.randint(0, 4096),
                    "y": random.randint(0, 3072),
                    "species": random.choice(["Rhizophora mangle", "Avicennia germinans", "Laguncularia racemosa"])
                }
                for j in range(min(20, tree_count))  # Sample annotations
            ]
        }
        
        sample_images.append(image_data)
        
        # Save individual image data
        with open(f"data/tree_detection/image_{project_id}.json", "w") as f:
            json.dump(image_data, f, indent=2)
    
    # Save combined dataset
    with open("data/tree_detection/dataset.json", "w") as f:
        json.dump({
            "description": "Mangrove Tree Detection Dataset",
            "total_images": len(sample_images),
            "data_format": "drone_rgb_imagery",
            "images": sample_images
        }, f, indent=2)
    
    print(f"✅ Generated {len(sample_images)} tree detection samples")
    return sample_images

def generate_ndvi_data():
    """Generate sample NDVI satellite data"""
    print("\n🛰️ Generating NDVI Satellite Dataset...")
    
    ndvi_datasets = []
    
    for i in range(15):
        project_id = f"NDVI_{i+1:03d}"
        
        # Generate realistic NDVI grid (simulating satellite pixels)
        grid_size = random.choice([(20, 20), (30, 30), (25, 25)])
        rows, cols = grid_size
        
        # NDVI values range from -1 to 1, healthy vegetation typically 0.3-0.8
        base_health = random.uniform(0.4, 0.7)
        ndvi_grid = []
        
        for row in range(rows):
            ndvi_row = []
            for col in range(cols):
                # Add some spatial variation
                variation = random.uniform(-0.15, 0.15)
                ndvi_value = max(-1, min(1, base_health + variation))
                ndvi_row.append(round(ndvi_value, 3))
            ndvi_grid.append(ndvi_row)
        
        # Calculate statistics
        flat_values = [val for row in ndvi_grid for val in row]
        avg_ndvi = round(np.mean(flat_values), 3)
        health_score = round((avg_ndvi + 1) * 50, 1)  # Convert to 0-100 scale
        
        ndvi_data = {
            "project_id": project_id,
            "satellite": random.choice(["Landsat-8", "Sentinel-2", "MODIS"]),
            "date_captured": (datetime.now() - timedelta(days=random.randint(1, 180))).isoformat(),
            "coordinates": {
                "top_left": [random.uniform(-90, 90), random.uniform(-180, 180)],
                "bottom_right": [random.uniform(-90, 90), random.uniform(-180, 180)]
            },
            "resolution_meters": random.choice([10, 20, 30]),
            "grid_dimensions": {"rows": rows, "cols": cols},
            "ndvi_grid": ndvi_grid,
            "statistics": {
                "min_ndvi": round(min(flat_values), 3),
                "max_ndvi": round(max(flat_values), 3),
                "avg_ndvi": avg_ndvi,
                "std_dev": round(np.std(flat_values), 3),
                "health_score": health_score
            },
            "cloud_cover_percent": random.randint(0, 25),
            "quality_flags": {
                "atmospheric_correction": True,
                "cloud_masked": True,
                "shadow_masked": True
            }
        }
        
        ndvi_datasets.append(ndvi_data)
        
        # Save individual NDVI data
        with open(f"data/ndvi_data/ndvi_{project_id}.json", "w") as f:
            json.dump(ndvi_data, f, indent=2)
    
    # Save combined dataset
    with open("data/ndvi_data/dataset.json", "w") as f:
        json.dump({
            "description": "NDVI Vegetation Health Dataset",
            "total_datasets": len(ndvi_datasets),
            "data_format": "satellite_ndvi",
            "datasets": ndvi_datasets
        }, f, indent=2)
    
    print(f"✅ Generated {len(ndvi_datasets)} NDVI datasets")
    return ndvi_datasets

def generate_iot_sensor_data():
    """Generate sample IoT sensor data"""
    print("\n📡 Generating IoT Sensor Dataset...")
    
    iot_datasets = []
    
    for i in range(20):
        project_id = f"IOT_{i+1:03d}"
        
        # Generate time series data for past 30 days
        start_date = datetime.now() - timedelta(days=30)
        readings = []
        
        for day in range(30):
            current_date = start_date + timedelta(days=day)
            
            # Generate realistic daily readings (4 readings per day)
            for reading_num in range(4):
                reading_time = current_date + timedelta(hours=reading_num * 6)
                
                # Realistic mangrove environment parameters
                soil_moisture = random.uniform(45, 85)  # High moisture in mangroves
                temperature = random.uniform(20, 35)    # Tropical temperatures
                salinity = random.uniform(5, 25)        # Brackish water salinity
                ph_level = random.uniform(6.5, 8.0)     # Slightly alkaline
                dissolved_oxygen = random.uniform(3, 8) # mg/L
                turbidity = random.uniform(10, 100)     # NTU
                
                reading = {
                    "timestamp": reading_time.isoformat(),
                    "sensor_id": f"SENSOR_{i+1:03d}_{reading_num+1:02d}",
                    "parameters": {
                        "soil_moisture_percent": round(soil_moisture, 1),
                        "temperature_celsius": round(temperature, 1),
                        "salinity_ppt": round(salinity, 1),
                        "ph_level": round(ph_level, 2),
                        "dissolved_oxygen_mg_l": round(dissolved_oxygen, 1),
                        "turbidity_ntu": round(turbidity, 1),
                        "water_level_cm": round(random.uniform(20, 200), 1)
                    },
                    "location": {
                        "latitude": round(random.uniform(-30, 30), 6),
                        "longitude": round(random.uniform(-180, 180), 6)
                    },
                    "battery_level": random.randint(20, 100),
                    "signal_strength": random.randint(-100, -30)
                }
                readings.append(reading)
        
        # Calculate aggregated metrics
        soil_moistures = [r["parameters"]["soil_moisture_percent"] for r in readings]
        temperatures = [r["parameters"]["temperature_celsius"] for r in readings]
        salinities = [r["parameters"]["salinity_ppt"] for r in readings]
        
        iot_score = calculate_iot_score(
            np.mean(soil_moistures),
            np.mean(temperatures),
            np.mean(salinities)
        )
        
        iot_data = {
            "project_id": project_id,
            "deployment_date": (datetime.now() - timedelta(days=random.randint(30, 365))).isoformat(),
            "sensor_network": {
                "total_sensors": random.randint(5, 20),
                "active_sensors": random.randint(4, 18),
                "sensor_types": ["soil", "water", "weather", "air_quality"]
            },
            "data_period": {
                "start_date": start_date.isoformat(),
                "end_date": datetime.now().isoformat(),
                "total_readings": len(readings)
            },
            "readings": readings,
            "aggregated_metrics": {
                "avg_soil_moisture": round(np.mean(soil_moistures), 1),
                "avg_temperature": round(np.mean(temperatures), 1),
                "avg_salinity": round(np.mean(salinities), 1),
                "iot_score": iot_score
            },
            "alerts": generate_alerts(readings)
        }
        
        iot_datasets.append(iot_data)
        
        # Save individual IoT data
        with open(f"data/iot_sensors/iot_{project_id}.json", "w") as f:
            json.dump(iot_data, f, indent=2)
    
    # Save combined dataset
    with open("data/iot_sensors/dataset.json", "w") as f:
        json.dump({
            "description": "IoT Environmental Sensor Dataset",
            "total_deployments": len(iot_datasets),
            "data_format": "iot_timeseries",
            "deployments": iot_datasets
        }, f, indent=2)
    
    print(f"✅ Generated {len(iot_datasets)} IoT sensor datasets")
    return iot_datasets

def calculate_iot_score(soil_moisture, temperature, salinity):
    """Calculate IoT environmental score"""
    # Optimal ranges for mangrove ecosystems
    optimal_moisture = 65  # %
    optimal_temp = 27      # °C
    optimal_salinity = 15  # ppt
    
    # Calculate deviation scores
    moisture_score = max(0, 100 - abs(soil_moisture - optimal_moisture) * 2)
    temp_score = max(0, 100 - abs(temperature - optimal_temp) * 3)
    salinity_score = max(0, 100 - abs(salinity - optimal_salinity) * 2)
    
    # Weighted average
    total_score = (moisture_score * 0.4 + temp_score * 0.3 + salinity_score * 0.3)
    return round(total_score, 1)

def generate_alerts(readings):
    """Generate environmental alerts from sensor readings"""
    alerts = []
    
    for reading in readings[-10:]:  # Check last 10 readings
        params = reading["parameters"]
        
        if params["soil_moisture_percent"] < 30:
            alerts.append({
                "timestamp": reading["timestamp"],
                "type": "WARNING",
                "message": "Low soil moisture detected",
                "value": params["soil_moisture_percent"]
            })
        
        if params["temperature_celsius"] > 35:
            alerts.append({
                "timestamp": reading["timestamp"],
                "type": "ALERT",
                "message": "High temperature detected",
                "value": params["temperature_celsius"]
            })
    
    return alerts

def create_sample_projects():
    """Create complete sample projects combining all data types"""
    print("\n🗂️ Creating Sample Complete Projects...")
    
    projects = []
    
    for i in range(5):
        project_id = f"ECO_PROJECT_{i+1:03d}"
        
        project = {
            "project_info": {
                "project_id": project_id,
                "name": f"Mangrove Restoration Project {i+1}",
                "ngo_name": random.choice([
                    "Green Earth Foundation",
                    "Ocean Conservation Alliance", 
                    "Mangrove Restoration Initiative",
                    "Coastal Ecosystem Trust",
                    "Blue Carbon Project"
                ]),
                "location": random.choice([
                    "Sundarbans, Bangladesh",
                    "Everglades, USA",
                    "Amazon Delta, Brazil", 
                    "Niger Delta, Nigeria",
                    "Mekong Delta, Vietnam"
                ]),
                "start_date": (datetime.now() - timedelta(days=random.randint(30, 730))).isoformat(),
                "area_hectares": round(random.uniform(25, 150), 1),
                "target_trees": random.randint(500, 2000),
                "project_status": random.choice(["Active", "Monitoring", "Completed"])
            },
            "tree_detection": {
                "total_images": random.randint(5, 15),
                "detected_trees": random.randint(400, 1800),
                "confidence_avg": round(random.uniform(0.85, 0.95), 3),
                "last_survey": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat()
            },
            "ndvi_analysis": {
                "latest_health_score": round(random.uniform(65, 90), 1),
                "trend": random.choice(["Improving", "Stable", "Declining"]),
                "last_capture": (datetime.now() - timedelta(days=random.randint(1, 14))).isoformat()
            },
            "iot_monitoring": {
                "active_sensors": random.randint(8, 25),
                "current_iot_score": round(random.uniform(70, 95), 1),
                "last_reading": (datetime.now() - timedelta(hours=random.randint(1, 12))).isoformat()
            },
            "carbon_credits": {
                "estimated_co2_annual": round(random.randint(400, 1800) * 12.3, 1),
                "credits_issued": random.randint(5, 22),
                "credits_available": random.randint(2, 15),
                "market_value_usd": round(random.uniform(15, 35), 2)
            },
            "verification_status": {
                "final_score": round(random.uniform(75, 95), 1),
                "verification_date": (datetime.now() - timedelta(days=random.randint(1, 60))).isoformat(),
                "blockchain_hash": f"0x{random.randint(100000000000, 999999999999):x}",
                "status": random.choice(["Verified", "Under Review", "Approved"])
            }
        }
        
        projects.append(project)
        
        # Save individual project
        with open(f"data/sample_projects/project_{project_id}.json", "w") as f:
            json.dump(project, f, indent=2)
    
    # Save all projects
    with open("data/sample_projects/all_projects.json", "w") as f:
        json.dump({
            "description": "Complete EcoLedger Sample Projects",
            "total_projects": len(projects),
            "projects": projects
        }, f, indent=2)
    
    print(f"✅ Generated {len(projects)} complete sample projects")
    return projects

def create_data_sources_guide():
    """Create a guide for obtaining real-world data"""
    guide = {
        "data_sources_guide": {
            "tree_detection_images": {
                "description": "High-resolution drone or satellite imagery for AI tree detection",
                "real_world_sources": [
                    {
                        "source": "Google Earth Engine",
                        "url": "https://earthengine.google.com/",
                        "data_type": "Satellite imagery (Landsat, Sentinel)",
                        "access": "Free with registration",
                        "resolution": "10m-30m per pixel"
                    },
                    {
                        "source": "Planet Labs",
                        "url": "https://www.planet.com/",
                        "data_type": "Daily satellite imagery",
                        "access": "Commercial/Research licenses",
                        "resolution": "3m-5m per pixel"
                    },
                    {
                        "source": "DJI Drone Data",
                        "url": "https://www.dji.com/",
                        "data_type": "High-res drone imagery",
                        "access": "Direct capture",
                        "resolution": "Sub-meter accuracy"
                    },
                    {
                        "source": "USGS Earth Explorer",
                        "url": "https://earthexplorer.usgs.gov/",
                        "data_type": "Landsat/Sentinel data",
                        "access": "Free",
                        "resolution": "15m-30m per pixel"
                    }
                ],
                "recommended_formats": ["GeoTIFF", "JPEG with GPS", "PNG with metadata"],
                "preprocessing": "Orthorectification, atmospheric correction, geometric correction"
            },
            "ndvi_satellite_data": {
                "description": "Normalized Difference Vegetation Index from satellite sensors",
                "real_world_sources": [
                    {
                        "source": "Sentinel-2 MSI",
                        "url": "https://scihub.copernicus.eu/",
                        "data_type": "Multispectral satellite data",
                        "access": "Free",
                        "bands": "Red (Band 4), NIR (Band 8)",
                        "resolution": "10m per pixel"
                    },
                    {
                        "source": "Landsat 8 OLI",
                        "url": "https://landsat.gsfc.nasa.gov/",
                        "data_type": "Multispectral satellite data", 
                        "access": "Free",
                        "bands": "Red (Band 4), NIR (Band 5)",
                        "resolution": "30m per pixel"
                    },
                    {
                        "source": "MODIS Terra/Aqua",
                        "url": "https://modis.gsfc.nasa.gov/",
                        "data_type": "Daily global NDVI products",
                        "access": "Free",
                        "resolution": "250m-1km per pixel"
                    }
                ],
                "calculation": "NDVI = (NIR - Red) / (NIR + Red)",
                "interpretation": {
                    "bare_soil": "-0.1 to 0.1",
                    "sparse_vegetation": "0.1 to 0.3", 
                    "healthy_vegetation": "0.3 to 0.8",
                    "very_healthy_vegetation": "0.8 to 1.0"
                }
            },
            "iot_sensor_data": {
                "description": "Environmental monitoring sensors for mangrove ecosystems",
                "sensor_types": [
                    {
                        "parameter": "Soil Moisture",
                        "sensors": ["TDR probes", "Capacitive sensors"],
                        "range": "0-100%",
                        "optimal_mangrove": "60-80%"
                    },
                    {
                        "parameter": "Temperature",
                        "sensors": ["RTD", "Thermocouples", "DHT22"],
                        "range": "0-50°C",
                        "optimal_mangrove": "25-30°C"
                    },
                    {
                        "parameter": "Salinity",
                        "sensors": ["Conductivity probes", "EC sensors"],
                        "range": "0-50 ppt",
                        "optimal_mangrove": "10-20 ppt"
                    },
                    {
                        "parameter": "pH Level",
                        "sensors": ["pH electrodes", "Ion-selective sensors"],
                        "range": "0-14",
                        "optimal_mangrove": "7.0-8.5"
                    },
                    {
                        "parameter": "Dissolved Oxygen",
                        "sensors": ["Optical DO sensors", "Electrochemical sensors"],
                        "range": "0-20 mg/L",
                        "optimal_mangrove": "4-8 mg/L"
                    }
                ],
                "commercial_platforms": [
                    {
                        "platform": "Arduino + Sensors",
                        "cost": "$50-200 per node",
                        "connectivity": "WiFi/LoRaWAN",
                        "battery_life": "6-12 months"
                    },
                    {
                        "platform": "Campbell Scientific",
                        "cost": "$1000-5000 per station",
                        "connectivity": "Cellular/Satellite",
                        "battery_life": "1-2 years"
                    }
                ]
            }
        },
        "data_collection_workflow": {
            "planning": [
                "Define survey area boundaries",
                "Determine data collection frequency",
                "Select appropriate sensors/imagery",
                "Plan deployment logistics"
            ],
            "collection": [
                "Capture drone/satellite imagery",
                "Deploy IoT sensor networks",
                "Configure data transmission",
                "Validate data quality"
            ],
            "processing": [
                "Preprocess imagery (atmospheric correction)",
                "Calculate NDVI from multispectral bands",
                "Clean and validate sensor data",
                "Synchronize temporal datasets"
            ],
            "integration": [
                "Upload to EcoLedger platform",
                "Run AI analysis pipeline",
                "Generate verification reports",
                "Submit to blockchain"
            ]
        }
    }
    
    with open("data/DATA_SOURCES_GUIDE.json", "w") as f:
        json.dump(guide, f, indent=2)
    
    print("✅ Created comprehensive data sources guide")

def main():
    """Main function to generate all datasets"""
    print("🌱 EcoLedger Dataset Generator")
    print("=" * 50)
    
    # Create directory structure
    create_directories()
    
    # Generate all datasets
    tree_data = generate_tree_detection_data()
    ndvi_data = generate_ndvi_data()
    iot_data = generate_iot_sensor_data()
    projects = create_sample_projects()
    
    # Create data sources guide
    create_data_sources_guide()
    
    print("\n" + "=" * 50)
    print("🎉 Dataset Generation Complete!")
    print("=" * 50)
    print(f"📁 Generated Files:")
    print(f"   • Tree Detection: {len(tree_data)} samples")
    print(f"   • NDVI Data: {len(ndvi_data)} datasets") 
    print(f"   • IoT Sensors: {len(iot_data)} deployments")
    print(f"   • Sample Projects: {len(projects)} complete projects")
    print(f"   • Data Sources Guide: 1 comprehensive guide")
    print()
    print("📋 Directory Structure:")
    print("   data/")
    print("   ├── tree_detection/")
    print("   ├── ndvi_data/")
    print("   ├── iot_sensors/") 
    print("   ├── sample_projects/")
    print("   └── DATA_SOURCES_GUIDE.json")
    print()
    print("🚀 Ready for EcoLedger Testing!")
    print("   Use these datasets to test your AI models and APIs")

if __name__ == "__main__":
    main()