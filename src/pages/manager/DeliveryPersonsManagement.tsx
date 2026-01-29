import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import api from '../../services/api';
import { Livreur } from '../../types';

export default function DeliveryPersonsManagement() {
    const [livreurs, setLivreurs] = useState<Livreur[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingLivreur, setEditingLivreur] = useState<Livreur | null>(null);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        vehicule: '',
    });
    const { showToast } = useToast();

    useEffect(() => {
        fetchLivreurs();
    }, []);

    const fetchLivreurs = async () => {
        try {
            setIsLoading(true);
            const data = await api.getAllLivreurs();
            setLivreurs(data as Livreur[]);
        } catch (error) {
            showToast('error', 'Failed to fetch delivery persons');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (livreur?: Livreur) => {
        if (livreur) {
            setEditingLivreur(livreur);
            setFormData({
                nom: livreur.nom,
                prenom: livreur.prenom,
                email: livreur.email,
                telephone: livreur.telephone,
                vehicule: livreur.vehicule,
            });
        } else {
            setEditingLivreur(null);
            setFormData({ nom: '', prenom: '', email: '', telephone: '', vehicule: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
            showToast('error', 'Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            if (editingLivreur) {
                await api.updateLivreur(editingLivreur.id, formData);
                showToast('success', 'Delivery person updated successfully');
            } else {
                await api.createLivreur(formData);
                showToast('success', 'Delivery person created successfully');
            }
            setIsModalOpen(false);
            fetchLivreurs();
        } catch (error) {
            showToast('error', error instanceof Error ? error.message : 'Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this delivery person?')) return;

        try {
            await api.deleteLivreur(id);
            showToast('success', 'Delivery person deleted successfully');
            fetchLivreurs();
        } catch (error) {
            showToast('error', error instanceof Error ? error.message : 'Failed to delete');
        }
    };

    const filteredLivreurs = livreurs.filter((l) =>
        `${l.prenom} ${l.nom} ${l.email}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            key: 'person' as string,
            header: 'Delivery Person',
            render: (livreur: Livreur) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold">
                        {livreur.prenom[0]}{livreur.nom[0]}
                    </div>
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white">{livreur.prenom} {livreur.nom}</p>
                        <p className="text-sm text-slate-500">{livreur.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'telephone' as keyof Livreur,
            header: 'Phone',
            render: (livreur: Livreur) => (
                <span className="text-slate-600 dark:text-slate-300">{livreur.telephone}</span>
            ),
        },
        {
            key: 'vehicule' as keyof Livreur,
            header: 'Vehicle',
            render: (livreur: Livreur) => (
                <Badge variant="info">{livreur.vehicule || 'Not specified'}</Badge>
            ),
        },
        {
            key: 'status' as string,
            header: 'Status',
            render: () => (
                <Badge variant="success" dot>Active</Badge>
            ),
        },
        {
            key: 'actions' as string,
            header: 'Actions',
            render: (livreur: Livreur) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(livreur)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(livreur.id)}>
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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Delivery Persons</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your delivery team</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Delivery Person
                </Button>
            </div>

            {/* Search */}
            <div className="max-w-md">
                <Input
                    placeholder="Search delivery persons..."
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
                data={filteredLivreurs}
                keyExtractor={(l) => l.id}
                isLoading={isLoading}
                emptyMessage="No delivery persons found."
            />

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingLivreur ? 'Edit Delivery Person' : 'Add Delivery Person'}
                size="lg"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} isLoading={isSubmitting}>
                            {editingLivreur ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        placeholder="John"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    />
                    <Input
                        label="Last Name"
                        placeholder="Doe"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Input
                        label="Phone"
                        placeholder="+212 600 000 000"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    />
                    <div className="col-span-2">
                        <Input
                            label="Vehicle Type"
                            placeholder="e.g., Motorcycle, Van, Truck"
                            value={formData.vehicule}
                            onChange={(e) => setFormData({ ...formData, vehicule: e.target.value })}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
