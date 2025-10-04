"""
EcoLedger Server Status Checker and Restart Script
==================================================
"""
import subprocess
import time
import sys
import os

def check_port_status(port):
    """Check if a port is in use"""
    try:
        result = subprocess.run(
            ["netstat", "-an"], 
            capture_output=True, 
            text=True, 
            shell=True
        )
        return f":{port}" in result.stdout
    except:
        return False

def start_backend():
    """Start the Flask backend server"""
    print("🔧 Starting Flask Backend Server...")
    
    backend_dir = r"c:\Users\Sohel Ali\OneDrive\Desktop\EcoLedger\backend"
    venv_python = r"c:\Users\Sohel Ali\OneDrive\Desktop\EcoLedger\.venv\Scripts\python.exe"
    
    os.chdir(backend_dir)
    
    try:
        # Start backend process
        process = subprocess.Popen(
            [venv_python, "main.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        print(f"✅ Backend started with PID: {process.pid}")
        print("   Backend URL: http://localhost:5000")
        return process
        
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        return None

def start_frontend():
    """Start the Next.js frontend server"""
    print("🌐 Starting Next.js Frontend Server...")
    
    frontend_dir = r"c:\Users\Sohel Ali\OneDrive\Desktop\EcoLedger\frontend"
    os.chdir(frontend_dir)
    
    try:
        # Start frontend process
        process = subprocess.Popen(
            ["npm", "run", "dev"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=True
        )
        
        print(f"✅ Frontend started with PID: {process.pid}")
        print("   Frontend URL: http://localhost:3001")
        return process
        
    except Exception as e:
        print(f"❌ Failed to start frontend: {e}")
        return None

def main():
    """Main function to check and start servers"""
    
    print("🌱 EcoLedger Server Manager")
    print("=" * 40)
    
    # Check current port status
    print("\n📊 Checking Port Status:")
    port_5000 = check_port_status(5000)
    port_3001 = check_port_status(3001)
    
    print(f"   Port 5000 (Backend):  {'🟢 IN USE' if port_5000 else '🔴 FREE'}")
    print(f"   Port 3001 (Frontend): {'🟢 IN USE' if port_3001 else '🔴 FREE'}")
    
    print("\n🚀 Server Status:")
    
    if not port_5000:
        print("   Backend: Not running - Starting...")
        backend_process = start_backend()
        if backend_process:
            time.sleep(5)  # Wait for backend to start
    else:
        print("   Backend: Already running ✅")
    
    if not port_3001:
        print("   Frontend: Not running - Starting...")
        frontend_process = start_frontend()
        if frontend_process:
            time.sleep(3)  # Wait for frontend to start
    else:
        print("   Frontend: Already running ✅")
    
    print("\n" + "=" * 40)
    print("🎉 EcoLedger Servers Ready!")
    print("=" * 40)
    print()
    print("🌐 Access URLs:")
    print("   Frontend: http://localhost:3001")
    print("   Backend:  http://localhost:5000")
    print()
    print("📱 Pages to try:")
    print("   • http://localhost:3001/ (Landing page)")
    print("   • http://localhost:3001/upload (Upload data)")
    print("   • http://localhost:3001/dashboard (Project tracking)")
    print("   • http://localhost:3001/marketplace (Carbon credits)")
    print()
    print("🔌 API Endpoints:")
    print("   • http://localhost:5000/health (Health check)")
    print("   • See Postman collection for full API testing")
    print()
    print("💡 If servers don't respond:")
    print("   1. Check Windows Firewall settings")
    print("   2. Try 127.0.0.1 instead of localhost")
    print("   3. Restart this script")
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n⏹️  Server manager stopped by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")