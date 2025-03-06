
import React, { useState, useEffect } from 'react';
import {
    Box,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store/store';
import { Store, reorderStores } from '../store/storesSlice';
import {
    addStoreToFirebase,
    updateStoreInFirebase,
    removeStoreFromFirebase,
} from '../firebaseStores';
import { subscribeToStores } from '../firebaseStoresSync';
import DataImportButton from '../components/DataImportButton';
const StoresPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const stores = useSelector((state: RootState) => state.stores.stores);

    useEffect(() => {
        const unsubscribe = subscribeToStores();
        return () => unsubscribe();
    }, []);

    const [newStoreDialogOpen, setNewStoreDialogOpen] = useState(false);
    const [newStoreName, setNewStoreName] = useState('');
    const [newStoreCity, setNewStoreCity] = useState('');
    const [newStoreState, setNewStoreState] = useState('');

    const [editStoreDialogOpen, setEditStoreDialogOpen] = useState(false);
    const [editStoreId, setEditStoreId] = useState<string | null>(null);
    const [editStoreName, setEditStoreName] = useState('');
    const [editStoreCity, setEditStoreCity] = useState('');
    const [editStoreState, setEditStoreState] = useState('');

    const handleOpenNewStoreDialog = () => setNewStoreDialogOpen(true);
    const handleCloseNewStoreDialog = () => {
        setNewStoreDialogOpen(false);
        setNewStoreName('');
        setNewStoreCity('');
        setNewStoreState('');
    };
    const handleNewStoreSubmit = async () => {
        if (newStoreName.trim() && newStoreCity.trim() && newStoreState.trim()) {
            try {
                await addStoreToFirebase({
                    name: newStoreName.trim(),
                    city: newStoreCity.trim(),
                    state: newStoreState.trim(),
                });
                handleCloseNewStoreDialog();
            } catch (error) {
                console.error('Error adding store:', error);
            }
        }
    };

    const handleOpenEditStoreDialog = (store: Store) => {
        setEditStoreId(store.id);
        setEditStoreName(store.name);
        setEditStoreCity(store.city);
        setEditStoreState(store.state);
        setEditStoreDialogOpen(true);
    };
    const handleCloseEditStoreDialog = () => {
        setEditStoreDialogOpen(false);
        setEditStoreId(null);
        setEditStoreName('');
        setEditStoreCity('');
        setEditStoreState('');
    };
    const handleEditStoreSubmit = async () => {
        if (editStoreId && editStoreName.trim() && editStoreCity.trim() && editStoreState.trim()) {
            try {
                await updateStoreInFirebase({
                    id: editStoreId,
                    name: editStoreName.trim(),
                    city: editStoreCity.trim(),
                    state: editStoreState.trim(),
                });
                handleCloseEditStoreDialog();
            } catch (error) {
                console.error('Error updating store:', error);
            }
        }
    };

    const handleDeleteStore = async (id: string) => {
        try {
            await removeStoreFromFirebase(id);
        } catch (error) {
            console.error('Error deleting store:', error);
        }
    };

    const moveStore = (startIndex: number, endIndex: number) => {
        if (endIndex >= 0 && endIndex < stores.length) {
            dispatch(reorderStores({ startIndex, endIndex }));
        }
    };

    const handleDataImported = async (importedData: any[]) => {
        if (!window.confirm("Importing data will add new stores. Continue?")) {
            return;
        }
        try {
            for (const row of importedData) {
                const keys = Object.keys(row).map((k) => k.toLowerCase());
                if (
                    keys.includes('name') &&
                    keys.includes('city') &&
                    keys.includes('state')
                ) {
                    const store = {
                        name: row['name'] || row['Name'] || '',
                        city: row['city'] || row['City'] || '',
                        state: row['state'] || row['State'] || '',
                    };
                    await addStoreToFirebase(store);
                }
            }
        } catch (error) {
            console.error("Error importing stores data:", error);
            alert("Failed to import data.");
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'sno',
            headerName: 'S. No',
            width: 80,
            sortable: false,
            renderCell: (params) => {
                if (!params.row) return '';
                const sortedIds = params.api.getSortedRowIds() as (string | number)[];
                const index = sortedIds.indexOf(params.id);
                return index >= 0 ? index + 1 : '';
            },
        },
        { field: 'name', headerName: 'Store', width: 250 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'state', headerName: 'State', width: 120 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 220,
            sortable: false,
            renderCell: (params) => {
                const sortedIds = params.api.getSortedRowIds() as (string | number)[];
                const index = sortedIds.indexOf(params.id);
                return (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                            onClick={() => moveStore(index, index - 1)}
                            disabled={index === 0}
                            size="small"
                        >
                            <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            onClick={() => moveStore(index, index + 1)}
                            disabled={index === sortedIds.length - 1}
                            size="small"
                        >
                            <ArrowDownwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            onClick={() => handleOpenEditStoreDialog(params.row as Store)}
                            size="small"
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            onClick={() => handleDeleteStore(params.id as string)}
                            size="small"
                        >
                            <DeleteIcon color="error" fontSize="small" />
                        </IconButton>
                    </Box>
                );
            },
        },
    ];
    return (
        <Box sx={{ height: 'calc(100vh - 160px)', position: 'relative', p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Stores Management
            </Typography>
            {/* Import Data Button */}
            <Box sx={{ mb: 2 }}>
                <DataImportButton
                    requiredColumns={['name', 'city', 'state']}
                    onDataImported={handleDataImported}
                />
            </Box>
            <div style={{ height: '60vh', width: '100%' }}>
                <DataGrid
                    rows={stores}
                    columns={columns}
                    getRowId={(row: Store) => row.id}
                    disableRowSelectionOnClick
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10, page: 0 },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                />
            </div>
            {/* Floating "NEW STORE" button */}
            <Fab
                variant="extended"
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    backgroundColor: '#f79256',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#f3722c' },
                }}
                onClick={handleOpenNewStoreDialog}
            >
                <AddIcon sx={{ mr: 1 }} />
                NEW STORE
            </Fab>
            {/* "New Store" Modal Dialog */}
            <Dialog open={newStoreDialogOpen} onClose={handleCloseNewStoreDialog}>
                <DialogTitle>New Store</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Store Name"
                        fullWidth
                        value={newStoreName}
                        onChange={(e) => setNewStoreName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="City"
                        fullWidth
                        value={newStoreCity}
                        onChange={(e) => setNewStoreCity(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="State"
                        fullWidth
                        value={newStoreState}
                        onChange={(e) => setNewStoreState(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNewStoreDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleNewStoreSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            {/* "Edit Store" Modal Dialog */}
            <Dialog open={editStoreDialogOpen} onClose={handleCloseEditStoreDialog}>
                <DialogTitle>Edit Store</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Store Name"
                        fullWidth
                        value={editStoreName}
                        onChange={(e) => setEditStoreName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="City"
                        fullWidth
                        value={editStoreCity}
                        onChange={(e) => setEditStoreCity(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="State"
                        fullWidth
                        value={editStoreState}
                        onChange={(e) => setEditStoreState(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditStoreDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditStoreSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
export default StoresPage;
