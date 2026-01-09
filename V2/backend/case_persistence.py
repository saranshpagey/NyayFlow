import json
import os
from typing import List, Dict, Any, Optional

class CasePersistenceManager:
    """
    Handles persistence of client cases using a local JSON file.
    """
    def __init__(self, storage_path: str = "data/cases.json"):
        self.storage_path = storage_path
        self._ensure_storage_exists()

    def _ensure_storage_exists(self):
        """Create data directory and empty cases file if they don't exist."""
        os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
        if not os.path.exists(self.storage_path):
            with open(self.storage_path, 'w') as f:
                json.dump([], f)

    def get_all_cases(self) -> List[Dict[str, Any]]:
        """Retrieve all cases from storage."""
        try:
            with open(self.storage_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading cases: {e}")
            return []

    def create_case(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save a new case."""
        cases = self.get_all_cases()
        cases.append(case_data)
        self._save_all_cases(cases)
        return case_data

    def update_case(self, case_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing case by ID."""
        cases = self.get_all_cases()
        updated_case = None
        
        for i, case in enumerate(cases):
            if case.get('id') == case_id:
                cases[i].update(updates)
                updated_case = cases[i]
                break
        
        if updated_case:
            self._save_all_cases(cases)
        return updated_case

    def delete_case(self, case_id: str) -> bool:
        """Delete a case by ID."""
        cases = self.get_all_cases()
        initial_count = len(cases)
        cases = [c for c in cases if c.get('id') != case_id]
        
        if len(cases) < initial_count:
            self._save_all_cases(cases)
            return True
        return False

    def _save_all_cases(self, cases: List[Dict[str, Any]]):
        """Internal helper to write to disk."""
        try:
            with open(self.storage_path, 'w') as f:
                json.dump(cases, f, indent=4)
        except Exception as e:
            print(f"Error saving cases: {e}")

class DraftPersistenceManager:
    """
    Handles persistence of generated legal drafts using a local JSON file.
    """
    def __init__(self, storage_path: str = "data/drafts.json"):
        self.storage_path = storage_path
        self._ensure_storage_exists()

    def _ensure_storage_exists(self):
        """Create data directory and empty drafts file if they don't exist."""
        os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
        if not os.path.exists(self.storage_path):
            with open(self.storage_path, 'w') as f:
                json.dump([], f)

    def get_all_drafts(self) -> List[Dict[str, Any]]:
        """Retrieve all drafts from storage."""
        try:
            with open(self.storage_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading drafts: {e}")
            return []

    def create_draft(self, draft_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save a new draft."""
        drafts = self.get_all_drafts()
        # Add timestamp if not present
        if 'timestamp' not in draft_data:
            import time
            draft_data['timestamp'] = int(time.time() * 1000)
        
        drafts.append(draft_data)
        self._save_all_drafts(drafts)
        return draft_data

    def _save_all_drafts(self, drafts: List[Dict[str, Any]]):
        """Internal helper to write to disk."""
        try:
            with open(self.storage_path, 'w') as f:
                json.dump(drafts, f, indent=4)
        except Exception as e:
            print(f"Error saving drafts: {e}")

# Singleton instances
case_manager = CasePersistenceManager()
draft_manager = DraftPersistenceManager()
