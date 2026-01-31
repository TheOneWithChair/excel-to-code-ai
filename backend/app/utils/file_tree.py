"""
File tree utilities for generating directory structures.
"""
from pathlib import Path
from typing import List, Dict, Any


def build_file_tree(directory: Path) -> List[Dict[str, Any]]:
    """
    Build a tree structure from a directory.
    
    Args:
        directory: Path to the directory to traverse
        
    Returns:
        List of tree nodes representing the directory structure
    """
    if not directory.exists():
        return []
    
    tree = []
    
    # Get all items in directory, sorted (folders first, then files)
    items = sorted(directory.iterdir(), key=lambda x: (x.is_file(), x.name))
    
    for item in items:
        node = {
            "name": item.name,
            "type": "folder" if item.is_dir() else "file"
        }
        
        # Recursively build tree for subdirectories
        if item.is_dir():
            node["children"] = build_file_tree(item)
        
        tree.append(node)
    
    return tree
