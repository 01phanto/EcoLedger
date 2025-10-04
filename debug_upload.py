"""
Debug Upload Issues - Test backend APIs directly
"""
import requests
import os
import time

def test_backend_status():
    """Test if backend is running and accessible"""
    try:
        response = requests.get('http://localhost:5000/health', timeout=5)
        print(f"✅ Backend Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Backend not running on localhost:5000")
        return False
    except Exception as e:
        print(f"❌ Backend error: {e}")
        return False

def test_file_upload():
    """Test file upload to backend"""
    if not test_backend_status():
        return
    
    print("\n🧪 Testing File Uploads...")
    
    # Test tree detection
    try:
        image_path = 'data/sample_uploads/mangrove_everglades.jpg'
        if os.path.exists(image_path):
            with open(image_path, 'rb') as f:
                files = {'image': f}
                response = requests.post('http://localhost:5000/treecount', files=files, timeout=30)
            
            print(f"🌳 Tree Detection: {response.status_code}")
            if response.status_code == 200:
                print(f"   ✅ Success: {response.json()}")
            else:
                print(f"   ❌ Error: {response.text}")
        else:
            print(f"❌ Image file not found: {image_path}")
            
    except Exception as e:
        print(f"❌ Tree detection failed: {e}")
    
    # Test NDVI
    try:
        ndvi_path = 'data/sample_uploads/ndvi_everglades.png'
        if os.path.exists(ndvi_path):
            with open(ndvi_path, 'rb') as f:
                files = {'image': f}
                response = requests.post('http://localhost:5000/ndvi', files=files, timeout=30)
            
            print(f"🛰️ NDVI Analysis: {response.status_code}")
            if response.status_code == 200:
                print(f"   ✅ Success: {response.json()}")
            else:
                print(f"   ❌ Error: {response.text}")
        else:
            print(f"❌ NDVI file not found: {ndvi_path}")
            
    except Exception as e:
        print(f"❌ NDVI analysis failed: {e}")
    
    # Test IoT
    try:
        iot_path = 'data/sample_uploads/iot_sample_1.csv'
        if os.path.exists(iot_path):
            with open(iot_path, 'rb') as f:
                files = {'file': f}
                response = requests.post('http://localhost:5000/iot', files=files, timeout=30)
            
            print(f"📡 IoT Processing: {response.status_code}")
            if response.status_code == 200:
                print(f"   ✅ Success: {response.json()}")
            else:
                print(f"   ❌ Error: {response.text}")
        else:
            print(f"❌ IoT file not found: {iot_path}")
            
    except Exception as e:
        print(f"❌ IoT processing failed: {e}")

def check_frontend_connection():
    """Test if frontend can connect to backend"""
    print("\n🌐 Testing Frontend Connection...")
    
    # Simulate what the frontend does
    try:
        # This is what the frontend should be doing
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
        
        response = requests.get('http://localhost:5000/health', headers=headers, timeout=5)
        print(f"✅ Frontend connection test: {response.status_code}")
        
        # Test CORS preflight
        options_response = requests.options('http://localhost:5000/treecount', timeout=5)
        print(f"✅ CORS preflight test: {options_response.status_code}")
        
    except Exception as e:
        print(f"❌ Frontend connection failed: {e}")

if __name__ == "__main__":
    print("🔍 EcoLedger Upload Debug Tool")
    print("=" * 50)
    
    test_file_upload()
    check_frontend_connection()
    
    print("\n💡 Troubleshooting Tips:")
    print("1. Make sure backend is running: python backend/main.py")
    print("2. Check frontend is on port 3001: npm run dev")
    print("3. Try refreshing the browser page")
    print("4. Check browser developer console for errors")