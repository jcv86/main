#!/usr/bin/env python3
"""
Comprehensive TypeScript Audit for all test files
Scans for common TypeScript errors and type mismatches
"""
import os
import re
from pathlib import Path
from collections import defaultdict

def scan_typescript_issues():
    """Scan all test files for TypeScript issues"""
    
    issues = defaultdict(list)
    test_dir = Path("/vercel/share/v0-project/app/test")
    
    # Define patterns to search for
    patterns = {
        "missing_props": {
            "pattern": r"<(\w+)\s+(?!.*userEmail.*)\s*/>",
            "description": "Component might be missing required props"
        },
        "property_access": {
            "pattern": r"(\w+)\.(\w+)\s*(?:===|!==|&&|\|\|)",
            "description": "Potential access to non-existent property"
        },
        "type_mismatches": {
            "pattern": r"as\s+(\w+)",
            "description": "Type assertions (may hide real issues)"
        },
        "optional_chaining": {
            "pattern": r"(\w+)\.",
            "description": "Direct property access (should use optional chaining)"
        }
    }
    
    # Scan all TypeScript files
    for tsx_file in test_dir.rglob("*.tsx"):
        with open(tsx_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            lines = content.split('\n')
            
            # Check for specific issues
            check_component_props(tsx_file, content, issues)
            check_type_safety(tsx_file, content, issues)
            check_function_signatures(tsx_file, content, issues)
    
    return issues

def check_component_props(file_path, content, issues):
    """Check for missing or incorrect component props"""
    
    # Find all component usages
    component_pattern = r"<(\w+)\s+([^/>]*)/?>|<(\w+)\s+([^>]*)>"
    
    components_to_check = {
        "EnhancedCoachFlow": ["testType", "testResults", "userEmail"],
        "TestCompletionScreen": ["testType"],
        "TestIntroScreen": ["onStart"],
        "AiInsightsPanel": ["testType"],
    }
    
    for match in re.finditer(component_pattern, content):
        comp_name = match.group(1) or match.group(3)
        props_str = match.group(2) or match.group(4)
        
        if comp_name in components_to_check:
            required_props = components_to_check[comp_name]
            for prop in required_props:
                if prop not in props_str:
                    issues[str(file_path)].append({
                        "type": "missing_prop",
                        "component": comp_name,
                        "prop": prop,
                        "severity": "HIGH"
                    })

def check_type_safety(file_path, content, issues):
    """Check for type safety issues"""
    
    unsafe_patterns = [
        (r"\.type\s*===", "question.type - use type guard"),
        (r"\.options\s*\.", "question.options - use type guard"),
        (r"as\s+any", "Using 'any' type - reduces type safety"),
    ]
    
    for pattern, description in unsafe_patterns:
        if re.search(pattern, content):
            issues[str(file_path)].append({
                "type": "type_safety",
                "pattern": pattern,
                "description": description,
                "severity": "MEDIUM"
            })

def check_function_signatures(file_path, content, issues):
    """Check for function signature mismatches"""
    
    # Look for saveTestResult calls
    save_result_pattern = r"saveTestResult\(\s*({[^}]*}|[^,)]*)\s*[,)]"
    
    for match in re.finditer(save_result_pattern, content):
        call = match.group(1)
        # Should be 4 positional args, not object
        if "{" in call and "userEmail" in call:
            issues[str(file_path)].append({
                "type": "function_signature",
                "function": "saveTestResult",
                "issue": "Using object parameter instead of 4 positional arguments",
                "severity": "HIGH"
            })

def print_audit_report(issues):
    """Print comprehensive audit report"""
    
    print("\n" + "="*80)
    print("COMPREHENSIVE TYPESCRIPT AUDIT REPORT")
    print("="*80 + "\n")
    
    total_issues = sum(len(v) for v in issues.values())
    print(f"Total Issues Found: {total_issues}\n")
    
    high_severity = 0
    medium_severity = 0
    low_severity = 0
    
    for file_path, file_issues in sorted(issues.items()):
        print(f"📄 {file_path}")
        for issue in file_issues:
            severity = issue.get("severity", "LOW")
            if severity == "HIGH":
                high_severity += 1
                symbol = "🔴"
            elif severity == "MEDIUM":
                medium_severity += 1
                symbol = "🟡"
            else:
                low_severity += 1
                symbol = "🟢"
            
            print(f"  {symbol} [{severity}] {issue['type']}")
            for key, value in issue.items():
                if key not in ["type", "severity"]:
                    print(f"      {key}: {value}")
        print()
    
    print("\n" + "="*80)
    print(f"SUMMARY:")
    print(f"  High Severity (Blocking):   {high_severity}")
    print(f"  Medium Severity (Important): {medium_severity}")
    print(f"  Low Severity (Info):         {low_severity}")
    print("="*80 + "\n")

if __name__ == "__main__":
    print("Starting comprehensive TypeScript audit...")
    issues = scan_typescript_issues()
    print_audit_report(issues)
    
    # Print specific recommendations
    print("\nRECOMMENDATIONS:")
    print("1. Fix all HIGH severity issues first")
    print("2. Add type guards for optional properties")
    print("3. Use correct function signatures")
    print("4. Ensure all required component props are passed")
    print("5. Run 'pnpm build' to verify fixes")
