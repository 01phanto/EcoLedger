"""
Quick Server Test - EcoLedger
============================
"""
import time
import subprocess
import sys

def test_servers():
    print("🧪 Testing EcoLedger Servers...")
    print("=" * 40)
    
    # Test Frontend
    print("\n🌐 Testing Frontend (http://localhost:3001):")
    try:
        result = subprocess.run([
            "powershell", "-Command", 
            "try { (Invoke-WebRequest -Uri 'http://localhost:3001' -TimeoutSec 5).StatusCode } catch { 'ERROR' }"
        ], capture_output=True, text=True, timeout=10)
        
        if "200" in result.stdout:
            print("   ✅ Frontend: RESPONDING")
        else:
            print("   ❌ Frontend: NOT RESPONDING")
            print(f"   Output: {result.stdout.strip()}")
    except Exception as e:
        print(f"   ❌ Frontend: ERROR - {e}")
    
    # Test Backend
    print("\n🔧 Testing Backend (http://localhost:5000/health):")
    try:
        result = subprocess.run([
            "powershell", "-Command", 
            "try { (Invoke-WebRequest -Uri 'http://localhost:5000/health' -TimeoutSec 5).StatusCode } catch { 'ERROR' }"
        ], capture_output=True, text=True, timeout=10)
        
        if "200" in result.stdout:
            print("   ✅ Backend: RESPONDING")
        else:
            print("   ❌ Backend: NOT RESPONDING")
            print(f"   Output: {result.stdout.strip()}")
    except Exception as e:
        print(f"   ❌ Backend: ERROR - {e}")
    
    print("\n" + "=" * 40)
    print("🎯 Next Steps:")
    print("   1. Open http://localhost:3001 in your browser")
    print("   2. Navigate through the different pages:")
    print("      • / (Home)")
    print("      • /upload (Upload data)")
    print("      • /dashboard (View projects)")
    print("      • /marketplace (Carbon credits)")
    print("   3. If issues persist, check Windows Firewall")

if __name__ == "__main__":
    test_servers()