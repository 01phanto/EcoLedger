"""
Test the EcoLedger upload functionality with actual files
"""
import requests
import json
import time

def test_upload_endpoints():
    """Test all upload endpoints with sample files"""
    
    base_url = "http://localhost:5000"
    
    print("🧪 Testing EcoLedger Upload Endpoints")
    print("=" * 50)
    
    # Wait for server to be ready
    print("⏳ Waiting for server...")
    time.sleep(3)
    
    # Test health endpoint first
    try:
        health_response = requests.get(f"{base_url}/health", timeout=5)
        print(f"✅ Backend Health: {health_response.status_code}")
        print(f"   Response: {health_response.json()}")
    except Exception as e:
        print(f"❌ Backend not accessible: {e}")
        print("   Make sure backend is running on http://localhost:5000")
        return
    
    print("\n🌳 Testing Tree Detection Upload...")
    try:
        # Test with sample image
        with open('data/sample_uploads/mangrove_everglades.jpg', 'rb') as f:
            files = {'image': f}
            tree_response = requests.post(f"{base_url}/treecount", files=files, timeout=30)
            
        print(f"   Status: {tree_response.status_code}")
        if tree_response.status_code == 200:
            result = tree_response.json()
            print(f"   ✅ Tree Count: {result.get('tree_count', 'N/A')}")
            print(f"   ✅ Confidence: {result.get('confidence', 'N/A')}")
        else:
            print(f"   ❌ Error: {tree_response.text}")
            
    except Exception as e:
        print(f"   ❌ Upload failed: {e}")
    
    print("\n🛰️ Testing NDVI Image Upload...")
    try:
        # Test with NDVI image
        with open('data/sample_uploads/ndvi_everglades.png', 'rb') as f:
            files = {'image': f}
            ndvi_response = requests.post(f"{base_url}/ndvi", files=files, timeout=30)
            
        print(f"   Status: {ndvi_response.status_code}")
        if ndvi_response.status_code == 200:
            result = ndvi_response.json()
            print(f"   ✅ Health Score: {result.get('health_score', 'N/A')}")
            print(f"   ✅ Avg NDVI: {result.get('avg_ndvi', 'N/A')}")
        else:
            print(f"   ❌ Error: {ndvi_response.text}")
            
    except Exception as e:
        print(f"   ❌ Upload failed: {e}")
    
    print("\n📡 Testing IoT CSV Upload...")
    try:
        # Test with CSV file
        with open('data/sample_uploads/iot_sample_1.csv', 'rb') as f:
            files = {'file': f}
            iot_response = requests.post(f"{base_url}/iot", files=files, timeout=30)
            
        print(f"   Status: {iot_response.status_code}")
        if iot_response.status_code == 200:
            result = iot_response.json()
            print(f"   ✅ IoT Score: {result.get('iot_score', 'N/A')}")
            print(f"   ✅ Status: {result.get('status', 'N/A')}")
        else:
            print(f"   ❌ Error: {iot_response.text}")
            
    except Exception as e:
        print(f"   ❌ Upload failed: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Upload Test Summary:")
    print("If all tests show ✅, your upload functionality works!")
    print("If you see ❌, check the backend logs for detailed error messages.")

if __name__ == "__main__":
    test_upload_endpoints()