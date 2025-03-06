
import React, { useRef } from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';
export interface DataImportButtonProps {
    
    sheetName?: string;
    
    requiredColumns: string[];
    
    onDataImported: (data: any[]) => void;
}
const DataImportButton: React.FC<DataImportButtonProps> = ({
    sheetName,
    requiredColumns,
    onDataImported,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            let sheetToUse;
            if (sheetName && workbook.SheetNames.includes(sheetName)) {
                sheetToUse = workbook.Sheets[sheetName];
            } else {
                
                for (const sheet of workbook.SheetNames) {
                    const ws = workbook.Sheets[sheet];
                    const jsonData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
                    if (jsonData.length > 0) {
                        const headerRow = jsonData[0] as string[];
                        const hasAll = requiredColumns.every((col) =>
                            headerRow.map((h) => h.toLowerCase()).includes(col.toLowerCase())
                        );
                        if (hasAll) {
                            sheetToUse = ws;
                            break;
                        }
                    }
                }
            }
            if (!sheetToUse) {
                alert("No sheet found with the required columns.");
                return;
            }
            const jsonData = XLSX.utils.sheet_to_json(sheetToUse, { defval: '' });
            
            if (jsonData.length === 0) {
                alert("The sheet is empty.");
                return;
            }
            const firstRow = jsonData[0] as Record<string, any>;
            if (!requiredColumns.every((col) =>
                Object.keys(firstRow).map((k) => k.toLowerCase()).includes(col.toLowerCase())
            )) {
                alert("The sheet does not contain the required columns.");
                return;
            }
            onDataImported(jsonData);
        } catch (error) {
            console.error("Error importing file:", error);
            alert("Failed to import file.");
        } finally {
            
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };
    return (
        <>
            <Button variant="outlined" onClick={() => fileInputRef.current?.click()}>
                Import Data
            </Button>
            <input
                type="file"
                accept=".xlsx, .csv"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </>
    );
};
export default DataImportButton;
