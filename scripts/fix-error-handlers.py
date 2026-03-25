#!/usr/bin/env python3
"""
Bulk fix error handlers from catch (error: any) to catch (error)
This script updates all catch clauses to remove type: any annotations
"""

import os
import re
import glob

def fix_error_handlers(directory="/vercel/share/v0-project"):
    """Fix all catch (error: any) and similar patterns to catch (error)"""
    
    patterns = [
        (r'catch\s*\(\s*error:\s*any\s*\)', 'catch (error)'),
        (r'catch\s*\(\s*err:\s*any\s*\)', 'catch (err)'),
        (r'catch\s*\(\s*e:\s*any\s*\)', 'catch (e)'),
    ]
    
    # File extensions to process
    extensions = ['*.ts', '*.tsx', '*.js', '*.jsx']
    
    total_files = 0
    total_changes = 0
    
    for ext in extensions:
        pattern = os.path.join(directory, f'**/{ext}')
        files = glob.glob(pattern, recursive=True)
        
        for filepath in files:
            # Skip node_modules and dist
            if 'node_modules' in filepath or 'dist' in filepath or '.next' in filepath:
                continue
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # Apply all replacements
                for pattern, replacement in patterns:
                    content = re.sub(pattern, replacement, content)
                
                # If content changed, write back
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    changes = len(re.findall(r'catch\s*\(', original_content)) - len(re.findall(r'catch\s*\(', content))
                    if changes > 0:
                        total_files += 1
                        total_changes += changes
                        print(f"[v0] Fixed {filepath}")
            
            except Exception as e:
                print(f"[v0] Error processing {filepath}: {e}")
    
    print(f"\n[v0] Fixed {total_changes} catch clauses in {total_files} files")
    return total_files, total_changes

if __name__ == '__main__':
    print("[v0] Starting error handler bulk fix...")
    files_changed, changes_made = fix_error_handlers()
    print(f"[v0] ✓ Bulk fix complete: {files_changed} files updated, {changes_made} catch clauses fixed")
