"""
Blockchain Ledger Service
Simulates Hyperledger Fabric for storing verified reports and managing carbon credits
For hackathon purposes, uses MongoDB/JSON storage with blockchain-like properties
"""

import json
import hashlib
import uuid
from datetime import datetime
import logging
import os
from pathlib import Path

try:
    # Import the Fabric wrapper if available
    from ....blockchain.fabric_service import FabricService, FabricServiceError
    FABRIC_AVAILABLE = True
except Exception:
    # Fallback to top-level import path
    try:
        from blockchain.fabric_service import FabricService, FabricServiceError
        FABRIC_AVAILABLE = True
    except Exception:
        FABRIC_AVAILABLE = False

logger = logging.getLogger(__name__)

try:
    from pymongo import MongoClient
    MONGODB_AVAILABLE = True
except ImportError:
    MONGODB_AVAILABLE = False
    logger.warning("MongoDB not available, using file-based storage")

class LedgerService:
    def __init__(self, use_mongodb=False):
        """
        Initialize ledger service
        
        Args:
            use_mongodb: Whether to use MongoDB or file-based storage
        """
        self.use_mongodb = use_mongodb and MONGODB_AVAILABLE
        self.storage_dir = "blockchain_data"
        os.makedirs(self.storage_dir, exist_ok=True)
        
        if self.use_mongodb:
            try:
                self.client = MongoClient('mongodb://localhost:27017/')
                self.db = self.client['ecoledger']
                self.reports_collection = self.db['reports']
                self.credits_collection = self.db['credits']
                self.transactions_collection = self.db['transactions']
                logger.info("Connected to MongoDB")
            except Exception as e:
                logger.error(f"MongoDB connection failed: {e}")
                self.use_mongodb = False
        
        # Initialize file-based storage
        self.reports_file = os.path.join(self.storage_dir, "reports.json")
        self.credits_file = os.path.join(self.storage_dir, "credits.json")
        self.transactions_file = os.path.join(self.storage_dir, "transactions.json")
        
        # Initialize empty files if they don't exist
        for file_path in [self.reports_file, self.credits_file, self.transactions_file]:
            if not os.path.exists(file_path):
                with open(file_path, 'w') as f:
                    json.dump([], f)
    
    def submit_report(self, report_data):
        """
        Submit verified report to blockchain ledger
        
        Args:
            report_data: Dictionary containing verification results
            
        Returns:
            dict: Submission result with blockchain hash
        """
        try:
            # Generate unique report ID
            report_id = str(uuid.uuid4())
            
            # Add metadata
            ledger_entry = {
                "report_id": report_id,
                "timestamp": datetime.now().isoformat(),
                "data": report_data,
                "block_number": self._get_next_block_number(),
                "previous_hash": self._get_last_block_hash(),
                "status": "verified"
            }
            
            # Calculate hash for this entry
            ledger_entry["hash"] = self._calculate_hash(ledger_entry)
            
            # Store in ledger
            if self.use_mongodb:
                self.reports_collection.insert_one(ledger_entry)
            else:
                self._append_to_file(self.reports_file, ledger_entry)
            
            logger.info(f"Report {report_id} submitted to ledger")
            
            return {
                "status": "success",
                "report_id": report_id,
                "blockchain_hash": ledger_entry["hash"],
                "block_number": ledger_entry["block_number"],
                "timestamp": ledger_entry["timestamp"]
            }
            
        except Exception as e:
            logger.error(f"Report submission failed: {e}")
            return {
                "status": "failed",
                "error": str(e)
            }
    
    def query_report(self, report_id):
        """
        Query report from blockchain ledger
        
        Args:
            report_id: Report ID to query
            
        Returns:
            dict: Report data or error
        """
        try:
            if self.use_mongodb:
                report = self.reports_collection.find_one({"report_id": report_id})
                if report:
                    report['_id'] = str(report['_id'])  # Convert ObjectId to string
            else:
                reports = self._load_from_file(self.reports_file)
                report = next((r for r in reports if r['report_id'] == report_id), None)
            
            if report:
                return {
                    "status": "found",
                    "report": report
                }
            else:
                return {
                    "status": "not_found",
                    "error": f"Report {report_id} not found"
                }
                
        except Exception as e:
            logger.error(f"Report query failed: {e}")
            return {
                "status": "error",
                "error": str(e)
            }
    
    def issue_credits(self, credit_data):
        """
        Issue carbon credits to NGO based on verified report
        
        Args:
            credit_data: Dictionary with NGO ID, credits amount, report ID
            
        Returns:
            dict: Credit issuance result
        """
        try:
            ngo_id = credit_data['ngo_id']
            credits_amount = float(credit_data['credits_amount'])
            report_id = credit_data['report_id']
            
            # Verify report exists
            report_query = self.query_report(report_id)
            if report_query['status'] != 'found':
                return {
                    "status": "failed",
                    "error": "Report not found or not verified"
                }
            
            # Generate credit record
            credit_id = str(uuid.uuid4())
            credit_record = {
                "credit_id": credit_id,
                "ngo_id": ngo_id,
                "credits_amount": credits_amount,
                "report_id": report_id,
                "status": "issued",
                "issued_at": datetime.now().isoformat(),
                "available_for_sale": True,
                "price_per_credit": credit_data.get('price_per_credit', 15.0),
                "vintage_year": datetime.now().year,
                "project_type": "mangrove_plantation",
                "verification_standard": "EcoLedger_AI_v1.0"
            }
            
            # Calculate hash
            credit_record["hash"] = self._calculate_hash(credit_record)
            
            # Attempt to store on-chain via FabricService if available
            onchain_result = None
            try:
                if FABRIC_AVAILABLE:
                    fabric = FabricService()
                    # Prepare payload for chaincode
                    payload = {
                        'creditId': credit_id,
                        'projectId': credit_data.get('project_id'),
                        'ngoName': credit_data.get('ngo_id'),
                        'credits': credits_amount,
                        'verificationScore': credit_data.get('verification_score', 0),
                        'timestamp': credit_record['issued_at'],
                        'metadata': credit_data.get('metadata', {})
                    }
                    onchain_result = fabric.issue_credits(payload)
                    # If successful and contains txId or creditId, persist
                    credit_record['onchain'] = True
                    credit_record['onchain_result'] = onchain_result
                    credit_record['status'] = 'issued_on_chain'
                else:
                    credit_record['onchain'] = False
                    credit_record['status'] = 'issued_local'

            except Exception as e:
                # If Fabric submission fails, mark as pending and log error
                logger.error(f"Fabric submission failed for credit {credit_id}: {e}")
                credit_record['onchain'] = False
                credit_record['onchain_error'] = str(e)
                credit_record['status'] = 'pending_on_chain'

            # Store credit record (always store locally for audit and recovery)
            if self.use_mongodb:
                self.credits_collection.insert_one(credit_record)
            else:
                self._append_to_file(self.credits_file, credit_record)

            logger.info(f"Issued {credits_amount} credits to NGO {ngo_id} (credit_id={credit_id}) status={credit_record['status']}")

            return {
                "status": "success",
                "credit_id": credit_id,
                "credits_issued": credits_amount,
                "onchain": credit_record.get('onchain', False),
                "onchain_result": credit_record.get('onchain_result', None),
                "error": credit_record.get('onchain_error', None)
            }
            
        except Exception as e:
            logger.error(f"Credit issuance failed: {e}")
            return {
                "status": "failed",
                "error": str(e)
            }
    
    def transfer_credits(self, transfer_data):
        """
        Transfer carbon credits from NGO to company
        
        Args:
            transfer_data: Dictionary with from_id, to_id, credits_amount, price
            
        Returns:
            dict: Transfer result
        """
        try:
            from_id = transfer_data['from_id']
            to_id = transfer_data['to_id']
            credits_amount = float(transfer_data['credits_amount'])
            price = float(transfer_data['price'])
            
            # Check available credits for sender
            available_credits = self._get_available_credits(from_id)
            if available_credits < credits_amount:
                return {
                    "status": "failed",
                    "error": f"Insufficient credits. Available: {available_credits}, Requested: {credits_amount}"
                }
            
            # Create transaction record
            transaction_id = str(uuid.uuid4())
            transaction = {
                "transaction_id": transaction_id,
                "from_id": from_id,
                "to_id": to_id,
                "credits_amount": credits_amount,
                "price_per_credit": price,
                "total_amount": credits_amount * price,
                "timestamp": datetime.now().isoformat(),
                "status": "completed",
                "transaction_type": "credit_transfer"
            }
            
            transaction["hash"] = self._calculate_hash(transaction)
            
            # Update credit ownership
            self._update_credit_ownership(from_id, to_id, credits_amount)
            
            # Store transaction
            if self.use_mongodb:
                self.transactions_collection.insert_one(transaction)
            else:
                self._append_to_file(self.transactions_file, transaction)
            
            logger.info(f"Transferred {credits_amount} credits from {from_id} to {to_id}")
            
            return {
                "status": "success",
                "transaction_id": transaction_id,
                "credits_transferred": credits_amount,
                "total_price": credits_amount * price,
                "blockchain_hash": transaction["hash"]
            }
            
        except Exception as e:
            logger.error(f"Credit transfer failed: {e}")
            return {
                "status": "failed",
                "error": str(e)
            }
    
    def get_marketplace_credits(self):
        """
        Get available carbon credits in marketplace
        
        Returns:
            dict: Available credits for purchase
        """
        try:
            if self.use_mongodb:
                credits = list(self.credits_collection.find({"available_for_sale": True}))
                for credit in credits:
                    credit['_id'] = str(credit['_id'])
            else:
                all_credits = self._load_from_file(self.credits_file)
                credits = [c for c in all_credits if c.get('available_for_sale', False)]
            
            # Group by NGO and aggregate
            marketplace = {}
            for credit in credits:
                ngo_id = credit['ngo_id']
                if ngo_id not in marketplace:
                    marketplace[ngo_id] = {
                        "ngo_id": ngo_id,
                        "total_credits": 0,
                        "price_per_credit": credit.get('price_per_credit', 15.0),
                        "vintage_year": credit.get('vintage_year', datetime.now().year),
                        "project_type": credit.get('project_type', 'mangrove_plantation'),
                        "verification_standard": credit.get('verification_standard', 'EcoLedger_AI_v1.0'),
                        "credits_available": []
                    }
                
                marketplace[ngo_id]["total_credits"] += credit['credits_amount']
                marketplace[ngo_id]["credits_available"].append({
                    "credit_id": credit['credit_id'],
                    "amount": credit['credits_amount'],
                    "issued_at": credit['issued_at']
                })
            
            return {
                "status": "success",
                "marketplace": list(marketplace.values()),
                "total_ngos": len(marketplace),
                "total_credits_available": sum(ngo['total_credits'] for ngo in marketplace.values())
            }
            
        except Exception as e:
            logger.error(f"Marketplace query failed: {e}")
            return {
                "status": "error",
                "error": str(e),
                "marketplace": []
            }
    
    def get_ngo_credits(self, ngo_id):
        """Get credit holdings for specific NGO"""
        try:
            if self.use_mongodb:
                credits = list(self.credits_collection.find({"ngo_id": ngo_id}))
            else:
                all_credits = self._load_from_file(self.credits_file)
                credits = [c for c in all_credits if c['ngo_id'] == ngo_id]
            
            total_issued = sum(c['credits_amount'] for c in credits)
            total_available = sum(c['credits_amount'] for c in credits if c.get('available_for_sale', False))
            
            return {
                "status": "success",
                "ngo_id": ngo_id,
                "total_credits_issued": total_issued,
                "total_credits_available": total_available,
                "credits": credits
            }
            
        except Exception as e:
            logger.error(f"NGO credits query failed: {e}")
            return {
                "status": "error",
                "error": str(e)
            }
    
    def _calculate_hash(self, data):
        """Calculate SHA-256 hash for blockchain entry"""
        # Remove hash field if it exists, then calculate
        data_copy = data.copy()
        data_copy.pop('hash', None)
        data_copy.pop('_id', None)  # Remove MongoDB ObjectId
        
        # Create deterministic string representation
        data_string = json.dumps(data_copy, sort_keys=True)
        return hashlib.sha256(data_string.encode()).hexdigest()
    
    def _get_next_block_number(self):
        """Get next block number in sequence"""
        try:
            if self.use_mongodb:
                last_report = self.reports_collection.find_one(sort=[("block_number", -1)])
                return (last_report['block_number'] + 1) if last_report else 1
            else:
                reports = self._load_from_file(self.reports_file)
                return max((r.get('block_number', 0) for r in reports), default=0) + 1
        except:
            return 1
    
    def _get_last_block_hash(self):
        """Get hash of last block"""
        try:
            if self.use_mongodb:
                last_report = self.reports_collection.find_one(sort=[("block_number", -1)])
                return last_report['hash'] if last_report else "genesis"
            else:
                reports = self._load_from_file(self.reports_file)
                if reports:
                    last_report = max(reports, key=lambda x: x.get('block_number', 0))
                    return last_report.get('hash', 'genesis')
                return "genesis"
        except:
            return "genesis"
    
    def _get_available_credits(self, entity_id):
        """Get available credits for an entity"""
        try:
            if self.use_mongodb:
                credits = list(self.credits_collection.find({"ngo_id": entity_id, "available_for_sale": True}))
            else:
                all_credits = self._load_from_file(self.credits_file)
                credits = [c for c in all_credits if c['ngo_id'] == entity_id and c.get('available_for_sale', False)]
            
            return sum(c['credits_amount'] for c in credits)
        except:
            return 0
    
    def _update_credit_ownership(self, from_id, to_id, amount):
        """Update credit ownership after transfer"""
        # For simplicity, this is a basic implementation
        # In a real blockchain, this would be more sophisticated
        pass
    
    def _load_from_file(self, file_path):
        """Load data from JSON file"""
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except:
            return []
    
    def _append_to_file(self, file_path, data):
        """Append data to JSON file"""
        try:
            current_data = self._load_from_file(file_path)
            current_data.append(data)
            with open(file_path, 'w') as f:
                json.dump(current_data, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to append to file {file_path}: {e}")
    
    def get_blockchain_stats(self):
        """Get blockchain statistics"""
        try:
            if self.use_mongodb:
                total_reports = self.reports_collection.count_documents({})
                total_credits = self.credits_collection.count_documents({})
                total_transactions = self.transactions_collection.count_documents({})
            else:
                total_reports = len(self._load_from_file(self.reports_file))
                total_credits = len(self._load_from_file(self.credits_file))
                total_transactions = len(self._load_from_file(self.transactions_file))
            
            return {
                "status": "success",
                "blockchain_stats": {
                    "total_reports": total_reports,
                    "total_credits_issued": total_credits,
                    "total_transactions": total_transactions,
                    "last_block_number": self._get_next_block_number() - 1,
                    "storage_type": "MongoDB" if self.use_mongodb else "File-based"
                }
            }
            
        except Exception as e:
            logger.error(f"Stats query failed: {e}")
            return {
                "status": "error",
                "error": str(e)
            }