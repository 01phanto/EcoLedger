import requests
import json
import sys

def test_ecoledger_api():
    """Test the complete EcoLedger API workflow"""
    base_url = "http://localhost:5000"
    
    print("🌱 Testing EcoLedger API Workflow")
    print("=" * 50)
    
    # Test 1: Health Check
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health Check: PASSED")
        else:
            print("❌ Health Check: FAILED")
            return False
    except Exception as e:
        print(f"❌ Health Check: FAILED - {e}")
        return False
    
    # Test 2: Tree Count API
    try:
        response = requests.post(f"{base_url}/treecount", 
                               json={"image_base64": "test_image"}, 
                               timeout=10)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Tree Count API: PASSED - {result['tree_count']} trees detected")
        else:
            print("❌ Tree Count API: FAILED")
    except Exception as e:
        print(f"❌ Tree Count API: FAILED - {e}")
    
    # Test 3: NDVI Analysis API
    try:
        response = requests.post(f"{base_url}/ndvi", 
                               json={"ndvi_data": [[0.5, 0.6], [0.7, 0.8]]}, 
                               timeout=10)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ NDVI Analysis API: PASSED - Health Score: {result['health_score']}")
        else:
            print("❌ NDVI Analysis API: FAILED")
    except Exception as e:
        print(f"❌ NDVI Analysis API: FAILED - {e}")
    
    # Test 4: IoT Processing API
    try:
        response = requests.post(f"{base_url}/iot", 
                               json={
                                   "soil_moisture": 65,
                                   "temperature": 28,
                                   "salinity": 15
                               }, 
                               timeout=10)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ IoT Processing API: PASSED - IoT Score: {result['iot_score']}")
        else:
            print("❌ IoT Processing API: FAILED")
    except Exception as e:
        print(f"❌ IoT Processing API: FAILED - {e}")
    
    # Test 5: CO2 Estimation API
    try:
        response = requests.post(f"{base_url}/co2", 
                               json={"tree_count": 150}, 
                               timeout=10)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ CO2 Estimation API: PASSED - {result['co2_absorbed']} kg CO2/year")
        else:
            print("❌ CO2 Estimation API: FAILED")
    except Exception as e:
        print(f"❌ CO2 Estimation API: FAILED - {e}")
    
    # Test 6: Final Score API
    try:
        response = requests.post(f"{base_url}/finalscore", 
                               json={
                                   "ai_score": 85,
                                   "ndvi_score": 78,
                                   "iot_score": 82,
                                   "audit_score": 90
                               }, 
                               timeout=10)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Final Score API: PASSED - Final Score: {result['final_score']}")
        else:
            print("❌ Final Score API: FAILED")
    except Exception as e:
        print(f"❌ Final Score API: FAILED - {e}")
    
    # Test 7: Blockchain Ledger API
    try:
        response = requests.post(f"{base_url}/ledger/submit", 
                               json={
                                   "project_id": "test_project_001",
                                   "ngo_name": "Test NGO",
                                   "location": "Test Location",
                                   "tree_count": 150,
                                   "final_score": 82,
                                   "co2_absorbed": 1845
                               }, 
                               timeout=10)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Blockchain Submit API: PASSED - Report ID: {result['report_id']}")
        else:
            print("❌ Blockchain Submit API: FAILED")
    except Exception as e:
        print(f"❌ Blockchain Submit API: FAILED - {e}")
    
    print("\n🎉 EcoLedger API Test Complete!")
    print("Frontend is available at: http://localhost:3001")
    print("Backend is available at: http://localhost:5000")
    
    return True

if __name__ == "__main__":
    test_ecoledger_api()