#!/usr/bin/env python3
"""
Backend API Testing for ATARAXIA TECH LAB
Tests all API endpoints using the public URL
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class AtaraxiaAPITester:
    def __init__(self, base_url: str = "https://personal-brand-hub-11.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: Dict[str, Any] = None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            
        result = {
            "test": name,
            "success": success,
            "timestamp": datetime.now().isoformat(),
            "details": details or {}
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}")
        if details and not success:
            print(f"   Details: {details}")

    def test_health_check(self):
        """Test basic API health check"""
        try:
            response = requests.get(f"{self.api_base}/health", timeout=10)
            success = response.status_code == 200
            details = {
                "status_code": response.status_code,
                "response": response.json() if success else response.text
            }
            self.log_test("Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("Health Check", False, {"error": str(e)})
            return False

    def test_root_endpoint(self):
        """Test root API endpoint"""
        try:
            response = requests.get(f"{self.api_base}/", timeout=10)
            success = response.status_code == 200
            details = {
                "status_code": response.status_code,
                "response": response.json() if success else response.text
            }
            self.log_test("Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Root Endpoint", False, {"error": str(e)})
            return False

    def test_services_endpoint(self):
        """Test GET /api/services endpoint"""
        try:
            response = requests.get(f"{self.api_base}/services", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                # Verify structure
                has_divisions = "divisions" in data
                if has_divisions:
                    divisions = data["divisions"]
                    has_three_divisions = len(divisions) == 3
                    division_ids = [d.get("id") for d in divisions]
                    expected_ids = ["systems", "experience", "academy"]
                    has_correct_ids = all(div_id in division_ids for div_id in expected_ids)
                    
                    success = has_three_divisions and has_correct_ids
                    details = {
                        "status_code": response.status_code,
                        "divisions_count": len(divisions),
                        "division_ids": division_ids,
                        "has_correct_structure": success
                    }
                else:
                    success = False
                    details = {
                        "status_code": response.status_code,
                        "error": "Missing 'divisions' key in response"
                    }
            else:
                details = {
                    "status_code": response.status_code,
                    "response": response.text
                }
                
            self.log_test("Services Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Services Endpoint", False, {"error": str(e)})
            return False

    def test_contact_post(self):
        """Test POST /api/contact endpoint"""
        test_contact = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": "test@ataraxia.tech",
            "phone": "+52 555 123 4567",
            "service": "systems",
            "message": "This is a test message from automated testing."
        }
        
        try:
            response = requests.post(
                f"{self.api_base}/contact",
                json=test_contact,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            success = response.status_code in [200, 201]
            
            if success:
                data = response.json()
                # Verify response contains expected fields
                has_id = "id" in data
                has_created_at = "created_at" in data
                has_name = data.get("name") == test_contact["name"]
                has_email = data.get("email") == test_contact["email"]
                
                success = has_id and has_created_at and has_name and has_email
                details = {
                    "status_code": response.status_code,
                    "created_id": data.get("id") if success else None,
                    "response_valid": success
                }
            else:
                details = {
                    "status_code": response.status_code,
                    "response": response.text
                }
                
            self.log_test("Contact POST", success, details)
            return success, details.get("created_id") if success else None
        except Exception as e:
            self.log_test("Contact POST", False, {"error": str(e)})
            return False, None

    def test_contact_get(self):
        """Test GET /api/contact endpoint"""
        try:
            response = requests.get(f"{self.api_base}/contact", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                is_list = isinstance(data, list)
                details = {
                    "status_code": response.status_code,
                    "is_list": is_list,
                    "messages_count": len(data) if is_list else 0
                }
                success = is_list
            else:
                details = {
                    "status_code": response.status_code,
                    "response": response.text
                }
                
            self.log_test("Contact GET", success, details)
            return success
        except Exception as e:
            self.log_test("Contact GET", False, {"error": str(e)})
            return False

    def test_portfolio_endpoints(self):
        """Test portfolio endpoints"""
        # Test GET /api/portfolio
        try:
            response = requests.get(f"{self.api_base}/portfolio", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                is_list = isinstance(data, list)
                details = {
                    "status_code": response.status_code,
                    "is_list": is_list,
                    "items_count": len(data) if is_list else 0
                }
                success = is_list
            else:
                details = {
                    "status_code": response.status_code,
                    "response": response.text
                }
                
            self.log_test("Portfolio GET", success, details)
            return success
        except Exception as e:
            self.log_test("Portfolio GET", False, {"error": str(e)})
            return False

    def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 Starting ATARAXIA TECH LAB API Tests...")
        print(f"Testing against: {self.base_url}")
        print("-" * 50)
        
        # Basic connectivity tests
        health_ok = self.test_health_check()
        root_ok = self.test_root_endpoint()
        
        if not health_ok and not root_ok:
            print("\n❌ CRITICAL: Cannot reach API endpoints")
            return self.generate_summary()
        
        # Services endpoint test
        services_ok = self.test_services_endpoint()
        
        # Contact endpoint tests
        contact_post_ok, contact_id = self.test_contact_post()
        contact_get_ok = self.test_contact_get()
        
        # Portfolio endpoint test
        portfolio_ok = self.test_portfolio_endpoints()
        
        return self.generate_summary()

    def generate_summary(self):
        """Generate test summary"""
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"\n📊 Test Results Summary:")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Success rate: {success_rate:.1f}%")
        
        if success_rate < 50:
            print("🔴 CRITICAL: Major backend issues detected")
        elif success_rate < 80:
            print("🟡 WARNING: Some backend issues found")
        else:
            print("🟢 GOOD: Backend APIs functioning well")
        
        return {
            "tests_run": self.tests_run,
            "tests_passed": self.tests_passed,
            "success_rate": success_rate,
            "test_results": self.test_results
        }

def main():
    """Main test execution"""
    tester = AtaraxiaAPITester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    if results["success_rate"] < 50:
        return 1
    else:
        return 0

if __name__ == "__main__":
    sys.exit(main())