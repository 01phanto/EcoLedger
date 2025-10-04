"""
EcoLedger Data Usage Guide
==========================

This guide shows how to use the generated datasets with your EcoLedger APIs.
"""

import json
import requests
import base64
from pathlib import Path

def load_sample_data():
    """Load a sample from each dataset type"""
    
    # Load tree detection sample
    with open("data/tree_detection/image_MANGROVE_001.json", "r") as f:
        tree_sample = json.load(f)
    
    # Load NDVI sample
    with open("data/ndvi_data/ndvi_NDVI_001.json", "r") as f:
        ndvi_sample = json.load(f)
    
    # Load IoT sample
    with open("data/iot_sensors/iot_IOT_001.json", "r") as f:
        iot_sample = json.load(f)
    
    # Load complete project
    with open("data/sample_projects/project_ECO_PROJECT_001.json", "r") as f:
        project_sample = json.load(f)
    
    return tree_sample, ndvi_sample, iot_sample, project_sample

def test_tree_detection_api():
    """Test tree detection API with sample data"""
    print("🌳 Testing Tree Detection API...")
    
    tree_sample, _, _, _ = load_sample_data()
    
    # Prepare API request
    api_data = {
        "image_base64": tree_sample["image_base64"],
        "project_id": tree_sample["project_id"],
        "location": tree_sample["location"]
    }
    
    try:
        response = requests.post(
            "http://localhost:5000/treecount",
            json=api_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ API Response: {result}")
            print(f"   Detected Trees: {result.get('tree_count', 'N/A')}")
            print(f"   Confidence: {result.get('confidence', 'N/A')}")
        else:
            print(f"❌ API Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        print("   Make sure backend is running on http://localhost:5000")

def test_ndvi_api():
    """Test NDVI analysis API with sample data"""
    print("\n🛰️ Testing NDVI Analysis API...")
    
    _, ndvi_sample, _, _ = load_sample_data()
    
    # Prepare API request
    api_data = {
        "ndvi_data": ndvi_sample["ndvi_grid"],
        "project_id": ndvi_sample["project_id"],
        "date_captured": ndvi_sample["date_captured"]
    }
    
    try:
        response = requests.post(
            "http://localhost:5000/ndvi",
            json=api_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ API Response: {result}")
            print(f"   Health Score: {result.get('health_score', 'N/A')}")
            print(f"   Average NDVI: {result.get('avg_ndvi', 'N/A')}")
        else:
            print(f"❌ API Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")

def test_iot_api():
    """Test IoT processing API with sample data"""
    print("\n📡 Testing IoT Processing API...")
    
    _, _, iot_sample, _ = load_sample_data()
    
    # Get latest reading
    latest_reading = iot_sample["readings"][-1]["parameters"]
    
    # Prepare API request
    api_data = {
        "soil_moisture": latest_reading["soil_moisture_percent"],
        "temperature": latest_reading["temperature_celsius"],
        "salinity": latest_reading["salinity_ppt"],
        "ph_level": latest_reading["ph_level"],
        "project_id": iot_sample["project_id"]
    }
    
    try:
        response = requests.post(
            "http://localhost:5000/iot",
            json=api_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ API Response: {result}")
            print(f"   IoT Score: {result.get('iot_score', 'N/A')}")
            print(f"   Environmental Status: {result.get('status', 'N/A')}")
        else:
            print(f"❌ API Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")

def test_complete_workflow():
    """Test complete verification workflow"""
    print("\n🔄 Testing Complete Workflow...")
    
    tree_sample, ndvi_sample, iot_sample, project_sample = load_sample_data()
    
    # Step 1: Tree Detection
    tree_count = 150  # Simulated result
    
    # Step 2: NDVI Analysis  
    health_score = 78.5  # Simulated result
    
    # Step 3: IoT Processing
    iot_score = 82.1  # Simulated result
    
    # Step 4: CO2 Calculation
    try:
        co2_response = requests.post(
            "http://localhost:5000/co2",
            json={"tree_count": tree_count},
            timeout=10
        )
        
        if co2_response.status_code == 200:
            co2_result = co2_response.json()
            co2_absorbed = co2_result.get("co2_absorbed", tree_count * 12.3)
        else:
            co2_absorbed = tree_count * 12.3
            
    except:
        co2_absorbed = tree_count * 12.3
    
    # Step 5: Final Score
    try:
        final_response = requests.post(
            "http://localhost:5000/finalscore",
            json={
                "ai_score": 85,
                "ndvi_score": health_score,
                "iot_score": iot_score,
                "audit_score": 90
            },
            timeout=10
        )
        
        if final_response.status_code == 200:
            final_result = final_response.json()
            final_score = final_result.get("final_score", 83.7)
        else:
            final_score = 83.7
            
    except:
        final_score = 83.7
    
    # Step 6: Blockchain Submission
    try:
        blockchain_response = requests.post(
            "http://localhost:5000/ledger/submit",
            json={
                "project_id": project_sample["project_info"]["project_id"],
                "ngo_name": project_sample["project_info"]["ngo_name"],
                "location": project_sample["project_info"]["location"],
                "tree_count": tree_count,
                "final_score": final_score,
                "co2_absorbed": co2_absorbed
            },
            timeout=10
        )
        
        if blockchain_response.status_code == 200:
            blockchain_result = blockchain_response.json()
            print(f"✅ Blockchain Submission: {blockchain_result}")
        else:
            print(f"❌ Blockchain Error: {blockchain_response.status_code}")
            
    except Exception as e:
        print(f"❌ Blockchain Connection Error: {e}")
    
    print(f"\n📊 Workflow Summary:")
    print(f"   🌳 Trees Detected: {tree_count}")
    print(f"   🛰️ Health Score: {health_score}")
    print(f"   📡 IoT Score: {iot_score}")
    print(f"   💨 CO₂ Absorbed: {co2_absorbed:.1f} kg/year")
    print(f"   🎯 Final Score: {final_score}")

def show_data_examples():
    """Show examples of the generated data"""
    print("\n📋 Generated Data Examples:")
    print("=" * 50)
    
    tree_sample, ndvi_sample, iot_sample, project_sample = load_sample_data()
    
    print("\n🌳 Tree Detection Sample:")
    print(f"   Project: {tree_sample['project_id']}")
    print(f"   Location: {tree_sample['location']}")
    print(f"   Expected Trees: {tree_sample['expected_tree_count']}")
    print(f"   AI Detected: {tree_sample['ai_detected_count']}")
    print(f"   Confidence: {tree_sample['confidence_score']}")
    
    print("\n🛰️ NDVI Data Sample:")
    print(f"   Project: {ndvi_sample['project_id']}")
    print(f"   Satellite: {ndvi_sample['satellite']}")
    print(f"   Grid Size: {ndvi_sample['grid_dimensions']}")
    print(f"   Health Score: {ndvi_sample['statistics']['health_score']}")
    print(f"   Avg NDVI: {ndvi_sample['statistics']['avg_ndvi']}")
    
    print("\n📡 IoT Sensor Sample:")
    print(f"   Project: {iot_sample['project_id']}")
    print(f"   Total Readings: {iot_sample['data_period']['total_readings']}")
    print(f"   Avg Soil Moisture: {iot_sample['aggregated_metrics']['avg_soil_moisture']}%")
    print(f"   Avg Temperature: {iot_sample['aggregated_metrics']['avg_temperature']}°C")
    print(f"   IoT Score: {iot_sample['aggregated_metrics']['iot_score']}")
    
    print("\n🗂️ Complete Project Sample:")
    project_info = project_sample['project_info']
    print(f"   Project: {project_info['name']}")
    print(f"   NGO: {project_info['ngo_name']}")
    print(f"   Location: {project_info['location']}")
    print(f"   Area: {project_info['area_hectares']} hectares")
    print(f"   Status: {project_info['project_status']}")

def main():
    """Main function to demonstrate data usage"""
    print("🌱 EcoLedger Data Usage Guide")
    print("=" * 50)
    
    # Show data examples
    show_data_examples()
    
    # Test individual APIs
    test_tree_detection_api()
    test_ndvi_api()
    test_iot_api()
    
    # Test complete workflow
    test_complete_workflow()
    
    print("\n" + "=" * 50)
    print("📖 How to Use This Data:")
    print("=" * 50)
    print()
    print("1. 🌳 Tree Detection:")
    print("   • Use image_base64 field for API testing")
    print("   • Real data: Upload drone/satellite images")
    print("   • API: POST /treecount")
    print()
    print("2. 🛰️ NDVI Analysis:")
    print("   • Use ndvi_grid for vegetation health")
    print("   • Real data: Process satellite multispectral bands")
    print("   • API: POST /ndvi")
    print()
    print("3. 📡 IoT Sensors:")
    print("   • Use latest readings for environmental data")
    print("   • Real data: Deploy sensor networks")
    print("   • API: POST /iot")
    print()
    print("4. 🔗 Complete Workflow:")
    print("   • Combine all data types for verification")
    print("   • Submit to blockchain for carbon credits")
    print("   • APIs: POST /finalscore, POST /ledger/submit")
    print()
    print("📁 Dataset Files Created:")
    print("   • data/tree_detection/ - Drone imagery samples")
    print("   • data/ndvi_data/ - Satellite vegetation data")
    print("   • data/iot_sensors/ - Environmental sensor data")
    print("   • data/sample_projects/ - Complete project examples")
    print("   • data/DATA_SOURCES_GUIDE.json - Real-world data sources")
    print()
    print("🚀 Next Steps:")
    print("   1. Start backend: cd backend && python main.py")
    print("   2. Use Postman collection for API testing")
    print("   3. Upload sample data through frontend")
    print("   4. Monitor verification workflow")

if __name__ == "__main__":
    main()