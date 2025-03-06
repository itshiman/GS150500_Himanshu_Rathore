// src/pages/StoresPage.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/store';
import { RootState } from '../store/store';
import { addStore, removeStore, updateStore, reorderStores } from '../store/storesSlice';
import { v4 as uuidv4 } from 'uuid';
import {
    Container,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const StoresPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const stores = useSelector((state: RootState) => state.stores.stores);
    const [storeName, setStoreName] = useState('');
    const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState('');

    const handleAddStore = () => {
        if (storeName.trim() !== '') {
            dispatch(addStore({ id: uuidv4(), name: storeName.trim() }));
            setStoreName('');
        }
    };

    const handleDeleteStore = (id: string) => {
        dispatch(removeStore(id));
    };

    const handleEditStore = (storeId: string, currentName: string) => {
        setEditingStoreId(storeId);
        setEditedName(currentName);
    };

    const handleUpdateStore = (id: string) => {
        if (editedName.trim() !== '') {
            dispatch(updateStore({ id, name: editedName.trim() }));
            setEditingStoreId(null);
            setEditedName('');
        }
    };

    const moveStore = (startIndex: number, endIndex: number) => {
        if (endIndex >= 0 && endIndex < stores.length) {
            dispatch(reorderStores({ startIndex, endIndex }));
        }
    };

    return (
        <Container>
            <h2>Stores Management</h2>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <TextField
                    label="Store Name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddStore}
                    style={{ marginLeft: '8px' }}
                >
                    Add Store
                </Button>
            </div>
            <List>
                {stores.map((store, index) => (
                    <ListItem key={store.id} divider>
                        {editingStoreId === store.id ? (
                            <>
                                <TextField
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                />
                                <Button onClick={() => handleUpdateStore(store.id)}>Save</Button>
                            </>
                        ) : (
                            <>
                                <ListItemText primary={store.name} />
                                <IconButton onClick={() => handleEditStore(store.id, store.name)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteStore(store.id)}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => moveStore(index, index - 1)}
                                    disabled={index === 0}
                                >
                                    <ArrowUpwardIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => moveStore(index, index + 1)}
                                    disabled={index === stores.length - 1}
                                >
                                    <ArrowDownwardIcon />
                                </IconButton>
                            </>
                        )}
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default StoresPage;
