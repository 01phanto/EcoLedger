"""
Backend Connection Tester - Keep trying until backend responds
"""
import requests
import time
import sys

def test_backend_connection():
    max_attempts = 10
    for attempt in range(max_attempts):
        try:
            print(f"Attempt {attempt + 1}/{max_attempts}: Testing backend...")
            response = requests.get("http://localhost:5000/health", timeout=5)
            
            if response.status_code == 200:
                print("✅ Backend is running!")
                print(f"Response: {response.json()}")
                return True
            else:
                print(f"❌ Backend responded with status: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print(f"❌ Attempt {attempt + 1}: Connection refused")
        except Exception as e:
            print(f"❌ Attempt {attempt + 1}: Error - {e}")
        
        if attempt < max_attempts - 1:
            print("   Waiting 3 seconds before retry...")
            time.sleep(3)
    
    print("❌ Backend is not accessible after all attempts")
    return False

if __name__ == "__main__":
    print("🔍 Testing Backend Connection...")
    print("=" * 40)
    
    if test_backend_connection():
        print("\n🎉 Backend is ready!")
        print("✅ You can now try uploading files in the frontend")
        print("✅ Frontend: http://localhost:3001/upload")
        print("✅ Backend: http://localhost:5000")
    else:
        print("\n❌ Backend connection failed")
        print("💡 Try:")
        print("   1. Check if backend terminal shows 'Running on http://127.0.0.1:5000'")
        print("   2. Restart backend: python backend/main.py")
        print("   3. Check for port conflicts")