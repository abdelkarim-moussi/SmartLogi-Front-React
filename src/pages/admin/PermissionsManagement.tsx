import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import api from '../../services/api';

interface Permission {
    id: string;
    name: string;
}

export default function PermissionsManagement() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPermissionName, setNewPermissionName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            setIsLoading(true);
            const data = await api.getPermissions();
            setPermissions(data);
        } catch (error) {
            showToast('error', 'Failed to fetch permissions');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePermission = async () => {
        if (!newPermissionName.trim()) {
            showToast('error', 'Permission name is required');
            return;
        }

        try {
            setIsSubmitting(true);
            await api.createPermission(newPermissionName);
            showToast('success', 'Permission created successfully');
            setNewPermissionName('');
            setIsModalOpen(false);
            fetchPermissions();
        } catch (error) {
            showToast('error', error instanceof Error ? error.message : 'Failed to create permission');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePermission = async (permissionName: string) => {
        if (!confirm(`Are you sure you want to delete the permission "${permissionName}"?`)) return;

        try {
            await api.deletePermission(permissionName);
            showToast('success', 'Permission deleted successfully');
            fetchPermissions();
        } catch (error) {
            showToast('error', error instanceof Error ? error.message : 'Failed to delete permission');
        }
    };

    const filteredPermissions = permissions.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        { key: 'name' as keyof Permission, header: 'Permission Name' },
        {
            key: 'id' as keyof Permission,
            header: 'ID',
            render: (permission: Permission) => (
                <span className="text-slate-400 font-mono text-xs">{permission.id}</span>
            ),
        },
        {
            key: 'actions' as string,
            header: 'Actions',
            render: (permission: Permission) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleDeletePermission(permission.name)}>
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Permissions Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage system permissions</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Permission
                </Button>
            </div>

            {/* Search */}
            <div className="max-w-md">
                <Input
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Table */}
            <Table
                columns={columns}
                data={filteredPermissions}
                keyExtractor={(permission) => permission.id}
                isLoading={isLoading}
                emptyMessage="No permissions found."
            />

            {/* Create Permission Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Permission"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreatePermission} isLoading={isSubmitting}>
                            Create Permission
                        </Button>
                    </>
                }
            >
                <Input
                    label="Permission Name"
                    placeholder="e.g., VIEW_PACKAGES"
                    value={newPermissionName}
                    onChange={(e) => setNewPermissionName(e.target.value)}
                    helperText="Use descriptive names like VIEW_USERS, CREATE_PACKAGE, etc."
                />
            </Modal>
        </div>
    );
}
