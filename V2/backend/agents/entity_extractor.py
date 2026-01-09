"""
Entity Extraction Agent - Magic Auto-Fill from Conversations

Extracts structured data from legal conversations to pre-fill drafting forms.
Phase 1: Cheque Bounce Notice template only
"""

import re
import json
from typing import List, Dict, Any, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()


class EntityExtractorAgent:
    """
    Extracts structured entities from unstructured legal conversations.
    
    Supports:
    - Cheque Bounce Notices (Phase 1)
    - Future templates (Phase 2+)
    """
    
    def __init__(self):
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        
        if not self.google_api_key:
            print("⚠️ EntityExtractor: Missing GOOGLE_API_KEY")
            self.active = False
            return
            
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0.1,  # Low temp for precise extraction
            google_api_key=self.google_api_key
        )
        
        self.active = True
        print("✅ Entity Extractor Agent initialized")
    
    async def extract_from_conversation(
        self,
        conversation_history: List[Dict[str, str]],
        target_template: str = "auto"
    ) -> Dict[str, Any]:
        """
        Extract structured entities from conversation for a specific template.
        
        Args:
            conversation_history: List of {role: "user"|"assistant", content: "..."}
            target_template: Template ID or "auto" to detect
            
        Returns:
            {
                "success": bool,
                "extracted_fields": {...},
                "confidence": float,
                "missing_fields": [...]
            }
        """
        if not self.active:
            return {
                "success": False,
                "error": "Entity extractor not active",
                "extracted_fields": {},
                "confidence": 0.0
            }
        
        # Determine which extraction logic to use
        # In a real system, we'd use another LLM call to classify the best template
        # For now, we use a simple heuristic if "auto" or map explicitly
        
        if target_template == "legal-notice-cheque-bounce":
            return await self._extract_cheque_bounce_fields(conversation_history)
        elif target_template == "legal-notice-generic" or target_template == "auto":
            # Check for cheque bounce keywords in conversation to see if we should use the specific one
            conv_str = str(conversation_history).lower()
            if "cheque" in conv_str or "section 138" in conv_str or "bounce" in conv_str:
                return await self._extract_cheque_bounce_fields(conversation_history)
            
            # Default to generic extraction
            return await self._extract_generic_fields(conversation_history)
        else:
            # Fallback to generic
            return await self._extract_generic_fields(conversation_history)
    
    async def _extract_cheque_bounce_fields(
        self,
        conversation_history: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """
        Extract fields specific to Cheque Bounce Legal Notice.
        
        Fields:
        - payeeName: Person who received the bounced cheque
        - drawerName: Person who issued the bounced cheque
        - chequeAmount: Amount on cheque (formatted as "Rs. X/-")
        - chequeNumber: Cheque number
        - chequeDate: Date on cheque (DD/MM/YYYY)
        - bankName: Bank that returned the cheque
        - returnDate: Date cheque was returned
        - returnReason: Reason for dishonor
        - payeeAddress: Full address of payee
        - drawerAddress: Full address of drawer
        """
        
        # Combine conversation into context
        conversation_text = "\n".join([
            f"{msg['role'].upper()}: {msg['content']}"
            for msg in conversation_history
        ])
        
        extraction_prompt = f"""You are a legal data extraction expert.

CONVERSATION HISTORY:
{conversation_text}

TASK: Extract structured data for a Cheque Bounce Legal Notice (Section 138 NI Act).

Extract the following fields from the conversation. If a field is not mentioned or unclear, set it to null.

REQUIRED FIELDS:
1. payeeName: Full name of person who received bounced cheque (the victim/client)
2. drawerName: Full name of person who issued the bounced cheque (the accused)
3. chequeAmount: Amount in format "Rs. X/-" (e.g., "Rs. 50,000/-")
4. chequeDate: Date on cheque in DD/MM/YYYY format
5. returnReason: Reason for dishonor (e.g., "Insufficient Funds", "Account Closed")

OPTIONAL FIELDS (set null if not found):
6. chequeNumber: Cheque number
7. bankName: Name of the bank
8. returnDate: Date cheque was returned (DD/MM/YYYY)
9. payeeAddress: Full address of payee
10. drawerAddress: Full address of drawer

IMPORTANT RULES:
- Names should be FULL names (not "Mr. Kumar" but "Ramesh Kumar")
- Dates must be in DD/MM/YYYY format
- Amount must include "Rs." prefix and "/-" suffix
- Set null for any field you're not confident about
- Do NOT make up information

Respond in STRICT JSON format:
{{
    "payeeName": "Full Name or null",
    "drawerName": "Full Name or null",
    "chequeAmount": "Rs. X/- or null",
    "chequeNumber": "number or null",
    "chequeDate": "DD/MM/YYYY or null",
    "bankName": "Bank Name or null",
    "returnDate": "DD/MM/YYYY or null",
    "returnReason": "Reason or null",
    "payeeAddress": "Full address or null",
    "drawerAddress": "Full address or null",
    "confidence": 0.0-1.0 (your confidence in the extraction)
}}

Respond ONLY with valid JSON, no other text."""

        try:
            print("🔍 EntityExtractor: Extracting cheque bounce fields...")
            response = await self.llm.ainvoke(extraction_prompt)
            
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            if json_match:
                extracted_data = json.loads(json_match.group(0))
                
                # Calculate confidence and missing fields
                confidence = extracted_data.pop("confidence", 0.8)
                
                missing_fields = [
                    field for field, value in extracted_data.items()
                    if value is None or value == "null" or value == ""
                ]
                
                # Count filled required fields for confidence adjustment
                required_fields = ["payeeName", "drawerName", "chequeAmount", "chequeDate", "returnReason"]
                filled_required = sum(1 for f in required_fields if extracted_data.get(f))
                
                # Adjust confidence based on completeness
                adjusted_confidence = min(confidence, filled_required / len(required_fields))
                
                print(f"✅ Extraction complete. Confidence: {adjusted_confidence:.2f}")
                print(f"📊 Missing fields: {missing_fields}")
                
                return {
                    "success": True,
                    "extracted_fields": extracted_data,
                    "confidence": round(adjusted_confidence, 2),
                    "missing_fields": missing_fields
                }
            else:
                print("⚠️ Failed to parse JSON from LLM response")
                return {
                    "success": False,
                    "error": "Failed to parse extraction response",
                    "extracted_fields": {},
                    "confidence": 0.0
                }
                
        except Exception as e:
            print(f"❌ Entity extraction error: {e}")
            return {
                "success": False,
                "error": str(e),
                "extracted_fields": {},
                "confidence": 0.0
            }


    async def _extract_generic_fields(
        self,
        conversation_history: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """
        Extract generic fields common to most legal notices/documents.
        """
        conversation_text = "\n".join([
            f"{msg['role'].upper()}: {msg['content']}"
            for msg in conversation_history
        ])
        
        extraction_prompt = f"""You are a legal data extraction expert.
 
 CONVERSATION HISTORY:
 {conversation_text}
 
 TASK: Identify the TYPE of legal document being discussed and extract common entities.
 
 Extract the following fields. If a field is not mentioned, set it to null.
 
 FIELDS TO EXTRACT:
 1. documentType: What kind of document is this? (e.g., "Legal Notice for Delay in Possession", "Eviction Notice", "Consumer Complaint")
 2. senderName: Name of the person sending the document/client
 3. recipientName: Name of the person/company receiving the document (the opposing party)
 4. senderAddress: Address of the sender
 5. recipientAddress: Address of the recipient
 6. subject: A concise subject line for the document
 7. mainFacts: Key facts mentioned (as a single string or summary)
 8. claimedAmount: Any monetary claim mentioned (include currency)
 
 IMPORTANT RULES:
 - Names should be FULL names
 - Set null for any field you're not confident about
 - Do NOT make up information
 
 Respond in STRICT JSON format:
 {{
     "documentType": "type or null",
     "senderName": "Full Name or null",
     "recipientName": "Full Name or null",
     "senderAddress": "Address or null",
     "recipientAddress": "Address or null",
     "subject": "Subject or null",
     "mainFacts": "Summary of facts or null",
     "claimedAmount": "Amount or null",
     "confidence": 0.0-1.0
 }}
 
 Respond ONLY with valid JSON."""

        try:
            print("🔍 EntityExtractor: Extracting generic legal fields...")
            response = await self.llm.ainvoke(extraction_prompt)
            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            
            if json_match:
                extracted_data = json.loads(json_match.group(0))
                confidence = extracted_data.pop("confidence", 0.7)
                
                missing_fields = [
                    field for field, value in extracted_data.items()
                    if value is None or value == "null" or value == ""
                ]
                
                # Check critical fields for confidence boost
                critical_fields = ["documentType", "senderName", "recipientName"]
                filled_critical = sum(1 for f in critical_fields if extracted_data.get(f))
                
                adjusted_confidence = min(confidence, (filled_critical + 1) / (len(critical_fields) + 1))
                
                print(f"✅ Generic extraction complete. Confidence: {adjusted_confidence:.2f}")
                
                return {
                    "success": True,
                    "extracted_fields": extracted_data,
                    "confidence": round(adjusted_confidence, 2),
                    "missing_fields": missing_fields
                }
            else:
                raise ValueError("JSON parse error")
                
        except Exception as e:
            print(f"❌ Generic extraction error: {e}")
            return {
                "success": False,
                "error": str(e),
                "extracted_fields": {},
                "confidence": 0.0
            }


# Singleton instance
entity_extractor = EntityExtractorAgent()
