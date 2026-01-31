"""
File reading utilities with security checks.
"""
from pathlib import Path
from typing import Tuple, Optional


class FileReader:
    """Handles safe file reading operations."""
    
    @staticmethod
    def safe_read_file(base_dir: Path, relative_path: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Safely read a file with directory traversal protection.
        
        Args:
            base_dir: Base directory (must be absolute)
            relative_path: Relative path to the file
            
        Returns:
            Tuple of (success, content, error_message)
        """
        try:
            # Ensure base directory is absolute
            base_dir = base_dir.resolve()
            
            # Construct target path
            target_path = (base_dir / relative_path).resolve()
            
            # Security check: ensure target is within base directory
            if not str(target_path).startswith(str(base_dir)):
                return False, None, "Invalid path: access denied"
            
            # Check if file exists
            if not target_path.exists():
                return False, None, "File not found"
            
            # Check if it's a file (not a directory)
            if not target_path.is_file():
                return False, None, "Path is not a file"
            
            # Read file content as UTF-8
            try:
                content = target_path.read_text(encoding='utf-8')
                return True, content, None
            except UnicodeDecodeError:
                return False, None, "File is not a valid UTF-8 text file"
            except Exception as e:
                return False, None, f"Failed to read file: {str(e)}"
        
        except Exception as e:
            return False, None, f"Error processing file path: {str(e)}"
    
    @staticmethod
    def validate_path(relative_path: str) -> Tuple[bool, Optional[str]]:
        """
        Validate that a relative path is safe.
        
        Args:
            relative_path: Path to validate
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if not relative_path:
            return False, "Path cannot be empty"
        
        # Check for absolute paths
        if Path(relative_path).is_absolute():
            return False, "Absolute paths are not allowed"
        
        # Check for parent directory references
        if ".." in relative_path:
            return False, "Parent directory references (..) are not allowed"
        
        return True, None


# Global file reader instance
file_reader = FileReader()
