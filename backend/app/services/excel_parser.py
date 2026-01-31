"""
Excel parsing service for converting Excel files to JSON-compatible dictionaries.
Uses pandas for robust Excel file reading.
"""
import pandas as pd
from pathlib import Path
from typing import Dict, Any, List
import json


class ExcelParserService:
    """Handles parsing of Excel files into structured Python dictionaries."""
    
    @staticmethod
    def parse_excel_to_dict(file_path: Path) -> Dict[str, Any]:
        """
        Parse an Excel file into a JSON-compatible dictionary.
        Generic parser that reads all sheets and converts to dict format.
        
        Args:
            file_path: Path to the Excel file
            
        Returns:
            Dictionary representation of the Excel data
        """
        if not file_path.exists():
            raise FileNotFoundError(f"Excel file not found: {file_path}")
        
        try:
            # Read all sheets from the Excel file
            excel_data = pd.read_excel(file_path, sheet_name=None, engine='openpyxl')
            
            # Convert to JSON-compatible dictionary
            result = {}
            for sheet_name, df in excel_data.items():
                # Replace NaN values with None for JSON compatibility
                df = df.where(pd.notna(df), None)
                
                # Convert DataFrame to list of dictionaries (records format)
                sheet_data = df.to_dict(orient='records')
                result[sheet_name] = sheet_data
            
            return result
        
        except Exception as e:
            # Return error information in a structured format
            return {
                "error": str(e),
                "file": str(file_path),
                "parsed": False
            }
    
    @staticmethod
    def parse_features_excel(file_path: Path) -> Dict[str, Any]:
        """
        Parse features.xlsx file.
        Expected format: Feature sheets with columns like Name, Description, Priority, etc.
        
        Args:
            file_path: Path to features.xlsx
            
        Returns:
            Structured dictionary of features
        """
        return ExcelParserService.parse_excel_to_dict(file_path)
    
    @staticmethod
    def parse_apis_excel(file_path: Path) -> Dict[str, Any]:
        """
        Parse apis.xlsx file.
        Expected format: API sheets with endpoint, method, request, response, etc.
        
        Args:
            file_path: Path to apis.xlsx
            
        Returns:
            Structured dictionary of API specifications
        """
        return ExcelParserService.parse_excel_to_dict(file_path)
    
    @staticmethod
    def parse_database_excel(file_path: Path) -> Dict[str, Any]:
        """
        Parse database.xlsx file.
        Expected format: Database schema with tables, columns, types, relationships.
        
        Args:
            file_path: Path to database.xlsx
            
        Returns:
            Structured dictionary of database schema
        """
        return ExcelParserService.parse_excel_to_dict(file_path)
    
    @staticmethod
    def parse_tech_stack_excel(file_path: Path) -> Dict[str, Any]:
        """
        Parse tech_stack.xlsx file.
        Expected format: Technology choices, versions, configurations.
        
        Args:
            file_path: Path to tech_stack.xlsx
            
        Returns:
            Structured dictionary of tech stack specifications
        """
        return ExcelParserService.parse_excel_to_dict(file_path)
    
    @staticmethod
    def parse_all_specs(
        features_path: Path = None,
        apis_path: Path = None,
        database_path: Path = None,
        tech_stack_path: Path = None
    ) -> Dict[str, Dict[str, Any]]:
        """
        Parse all specification Excel files.
        
        Args:
            features_path: Path to features.xlsx (optional)
            apis_path: Path to apis.xlsx (optional)
            database_path: Path to database.xlsx (optional)
            tech_stack_path: Path to tech_stack.xlsx (optional)
            
        Returns:
            Dictionary with all parsed specifications
        """
        result = {
            "features": {},
            "apis": {},
            "database": {},
            "tech_stack": {}
        }
        
        if features_path and features_path.exists():
            result["features"] = ExcelParserService.parse_features_excel(features_path)
        
        if apis_path and apis_path.exists():
            result["apis"] = ExcelParserService.parse_apis_excel(apis_path)
        
        if database_path and database_path.exists():
            result["database"] = ExcelParserService.parse_database_excel(database_path)
        
        if tech_stack_path and tech_stack_path.exists():
            result["tech_stack"] = ExcelParserService.parse_tech_stack_excel(tech_stack_path)
        
        return result


# Global parser service instance
excel_parser = ExcelParserService()
