"""
Quick backend connectivity test
"""
import requests
import time

def test_backend():
    print("🧪 Testing Backend Connectivity...")
    
    try:
        # Test health endpoint
        response = requests.get("http://localhost:5000/health", timeout=5)
        print(f"✅ Health endpoint: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        # Test with a simple file upload simulation
        print("\n📤 Testing file upload simulation...")
        
        # Create a dummy image file for testing
        import io
        from PIL import Image
        import numpy as np
        
        # Create a simple test image
        img_array = np.zeros((100, 100, 3), dtype=np.uint8)
        img_array[:, :] = [0, 255, 0]  # Green image
        img = Image.fromarray(img_array)
        
        # Save to bytes
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        # Test upload
        files = {'image': ('test.jpg', img_bytes, 'image/jpeg')}
        response = requests.post("http://localhost:5000/treecount", files=files, timeout=30)
        
        print(f"✅ Upload test: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   Tree Count: {result.get('Tree_Count', 'N/A')}")
            print(f"   Status: {result.get('status', 'N/A')}")
        else:
            print(f"   Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running!")
        print("   Run: python backend/main.py")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_backend()