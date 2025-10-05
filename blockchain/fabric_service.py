"""
Python wrapper for Hyperledger Fabric interactions.
This file calls the Node.js fabric_client.js via subprocess to submit and query chaincode.

Provides:
 - issue_credits(credit_dict) -> dict
 - query_all_credits() -> list

Note: Requires Node.js runtime and the fabric client dependencies to be installed.
"""
import json
import subprocess
import shlex
from pathlib import Path
from typing import Any, Dict, List

ROOT = Path(__file__).resolve().parent
FABRIC_CLIENT = ROOT / 'fabric_client.js'


class FabricServiceError(Exception):
    pass


class FabricService:
    def __init__(self, node_bin: str = 'node'):
        self.node_bin = node_bin
        if not FABRIC_CLIENT.exists():
            raise FabricServiceError(f"Fabric client not found at {FABRIC_CLIENT}")

    def _run_node(self, args: List[str], input_data: Any = None) -> str:
        cmd = [self.node_bin, str(FABRIC_CLIENT)] + args
        try:
            if input_data is not None and isinstance(input_data, (dict, list)):
                input_str = json.dumps(input_data)
            else:
                input_str = input_data

            proc = subprocess.run(
                cmd,
                input=input_str.encode('utf-8') if input_str else None,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=False
            )

            stdout = proc.stdout.decode('utf-8').strip()
            stderr = proc.stderr.decode('utf-8').strip()

            if proc.returncode != 0:
                raise FabricServiceError(f"Node process failed: rc={proc.returncode}, stderr={stderr}")

            return stdout

        except FileNotFoundError as e:
            raise FabricServiceError(f"Node binary not found: {e}")

    def issue_credits(self, credit: Dict[str, Any]) -> Dict[str, Any]:
        """Issue (add) carbon credits to the Fabric ledger.

        credit: { creditId?, projectId, ngoName, credits, verificationScore, timestamp?, metadata? }
        returns parsed JSON result from chaincode
        """
        try:
            args = ['addCredit', json.dumps(credit)]
            out = self._run_node(args)
            # chaincode returns a JSON string
            try:
                return json.loads(out)
            except Exception:
                return { 'raw': out }
        except Exception as e:
            raise FabricServiceError(str(e))

    def query_all_credits(self) -> List[Dict[str, Any]]:
        try:
            args = ['queryAll']
            out = self._run_node(args)
            try:
                return json.loads(out)
            except Exception:
                # If chaincode returned a stringified JSON, attempt to extract
                return json.loads(out)
        except Exception as e:
            raise FabricServiceError(str(e))


# Simple CLI for quick tests
if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Fabric service wrapper CLI')
    parser.add_argument('--test-add', action='store_true')
    parser.add_argument('--test-query', action='store_true')
    args = parser.parse_args()

    svc = FabricService()
    if args.test_add:
        sample = {
            'projectId': 'proj-test-001',
            'ngoName': 'Test NGO',
            'credits': 10.5,
            'verificationScore': 92.4,
            'timestamp': '2025-10-04T12:00:00Z',
            'metadata': { 'notes': 'test credit' }
        }
        res = svc.issue_credits(sample)
        print('Issue result:', res)
    if args.test_query:
        res = svc.query_all_credits()
        print('Query result:', res)
