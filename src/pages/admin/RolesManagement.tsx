import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import api from '../../services/api';

interface Role {
    id: string;
    name: string;
    permissions: { id: string; name: string }[];
}

export default function RolesManagement() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setIsLoading(true);
            const data = await api.getRoles();
            setRoles(data);
        } catch (error) {
            showToast('error', 'Failed to fetch roles');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateRole = async () => {
        if (!newRoleName.trim()) {
            showToast('error', 'Role name is required');
            return;
        }

        try {
            setIsSubmitting(true);
            await api.createRole(newRoleName);
            showToast('success', 'Role created successfully');
            setNewRoleName('');
            setIsModalOpen(false);
            fetchRoles();
        } catch (error) {
            showToast('error', error instanceof Error ? error.message : 'Failed to create role');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRole = async (roleName: string) => {
        if (!confirm(`Are you sure you want to delete the role "${roleName}"?`)) return;

        try {
            await api.deleteRole(roleName);
            showToast('success', 'Role deleted successfully');
            fetchRoles();
        } catch (error) {
            showToast('error', error instanceof Error ? error.message : 'Failed to delete role');
        }
    };

    const columns = [
        { key: 'name' as keyof Role, header: 'Role Name' },
        {
            key: 'permissions' as keyof Role,
            header: 'Permissions',
            render: (role: Role) => (
                <div className="flex flex-wrap gap-1">
                    {role.permissions.length > 0 ? (
                        role.permissions.slice(0, 3).map((p) => (
                            <Badge key={p.id} variant="purple" size="sm">
                                {p.name}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-slate-400 text-sm">No permissions</span>
                    )}
                    {role.permissions.length > 3 && (
                        <Badge variant="default" size="sm">
                            +{role.permissions.length - 3} more
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            key: 'actions' as string,
            header: 'Actions',
            render: (role: Role) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.name)}>
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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Roles Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage user roles</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Role
                </Button>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                data={roles}
                keyExtractor={(role) => role.id}
                isLoading={isLoading}
                emptyMessage="No roles found. Create your first role!"
            />

            {/* Create Role Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Role"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateRole} isLoading={isSubmitting}>
                            Create Role
                        </Button>
                    </>
                }
            >
                <Input
                    label="Role Name"
                    placeholder="e.g., SUPERVISOR"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    helperText="Role names should be uppercase (e.g., ADMIN, MANAGER)"
                />
            </Modal>
        </div>
    );
}
