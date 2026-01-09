"""
Test script for Magic Auto-Fill Feature
Tests entity extraction with sample cheque bounce conversation
"""

import asyncio
from agents.entity_extractor import entity_extractor

async def test_extraction():
    print("🧪 Testing Entity Extraction...")
    print("=" * 60)
    
    # Sample conversation from requirements
    conversation = [
        {
            "role": "user",
            "content": "My client Ramesh Kumar received a bounced cheque for ₹50,000 from Suresh Patel on 15th Jan 2024. Bank returned it as 'Insufficient Funds'."
        },
        {
            "role": "assistant",
            "content": "This is a clear case under Section 138 of the Negotiable Instruments Act. You need to send a legal notice within 30 days of receiving the dishonor memo."
        }
    ]
    
    # Extract entities
    result = await entity_extractor.extract_from_conversation(
        conversation_history=conversation,
        target_template="legal-notice-cheque-bounce"
    )
    
    print("\n📊 EXTRACTION RESULTS:")
    print(f"Success: {result['success']}")
    print(f"Confidence: {result.get('confidence', 0):.2%}")
    
    print("\n✅ EXTRACTED FIELDS:")
    for field, value in result.get('extracted_fields', {}).items():
        print(f"  {field}: {value}")
    
    print("\n⚠️  MISSING FIELDS:")
    missing = result.get('missing_fields', [])
    if missing:
        for field in missing:
            print(f"  - {field}")
    else:
        print("  (None - all fields extracted!)")
    
    print("\n" + "=" * 60)
    
    # Verify expected extraction
    expected = {
        "payeeName": "Ramesh Kumar",
        "drawerName": "Suresh Patel",
        "chequeAmount": "Rs. 50,000/-",
        "chequeDate": "15/01/2024",
        "returnReason": "Insufficient Funds"
    }
    
    print("\n✓ VERIFICATION:")
    extracted = result.get('extracted_fields', {})
    for field, expected_value in expected.items():
        actual_value = extracted.get(field)
        match = "✅" if actual_value == expected_value else "❌"
        print(f"  {match} {field}: Expected '{expected_value}', Got '{actual_value}'")

if __name__ == "__main__":
    asyncio.run(test_extraction())
