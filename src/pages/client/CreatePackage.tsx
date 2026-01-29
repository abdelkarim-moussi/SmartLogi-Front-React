import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardTitle } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import api from '../../services/api';

interface ProductItem {
    nom: string;
    quantite: number;
    poids: number;
}

export default function CreatePackage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        poids: '',
        adresse: '',
        villeDestination: '',
        destinataire: '',
        priority: 'NORMAL' as 'NORMAL' | 'EXPRESS',
    });
    const [products, setProducts] = useState<ProductItem[]>([{ nom: '', quantite: 1, poids: 0 }]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.poids || parseFloat(formData.poids) <= 0) newErrors.poids = 'Valid weight is required';
        if (!formData.adresse.trim()) newErrors.adresse = 'Address is required';
        if (!formData.villeDestination.trim()) newErrors.villeDestination = 'Destination city is required';
        if (!formData.destinataire.trim()) newErrors.destinataire = 'Recipient name is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            showToast('error', 'Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            await api.createColis({
                ...formData,
                poids: parseFloat(formData.poids),
                produits: products.filter((p) => p.nom.trim()),
            });
            showToast('success', 'Package created successfully!');
            navigate('/client/packages');
        } catch (error) {
            showToast('error', error instanceof Error ? error.message : 'Failed to create package');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addProduct = () => {
        setProducts([...products, { nom: '', quantite: 1, poids: 0 }]);
    };

    const updateProduct = (index: number, field: keyof ProductItem, value: string | number) => {
        const updated = [...products];
        updated[index] = { ...updated[index], [field]: value };
        setProducts(updated);
    };

    const removeProduct = (index: number) => {
        if (products.length > 1) {
            setProducts(products.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Package</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Fill in the details for your delivery request</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Package Details */}
                <Card padding="md">
                    <CardTitle className="mb-4">Package Details</CardTitle>
                    <div className="space-y-4">
                        <Input
                            label="Description"
                            placeholder="What are you sending?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            error={errors.description}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Weight (kg)"
                                type="number"
                                step="0.1"
                                placeholder="0.0"
                                value={formData.poids}
                                onChange={(e) => setFormData({ ...formData, poids: e.target.value })}
                                error={errors.poids}
                            />
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                    Priority
                                </label>
                                <div className="flex gap-4">
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.priority === 'NORMAL'
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="priority"
                                            value="NORMAL"
                                            checked={formData.priority === 'NORMAL'}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'NORMAL' })}
                                            className="sr-only"
                                        />
                                        <span className="font-medium text-slate-700 dark:text-slate-200">Normal</span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.priority === 'EXPRESS'
                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="priority"
                                            value="EXPRESS"
                                            checked={formData.priority === 'EXPRESS'}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'EXPRESS' })}
                                            className="sr-only"
                                        />
                                        <span className="font-medium text-slate-700 dark:text-slate-200">⚡ Express</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Delivery Information */}
                <Card padding="md">
                    <CardTitle className="mb-4">Delivery Information</CardTitle>
                    <div className="space-y-4">
                        <Input
                            label="Recipient Name"
                            placeholder="Who will receive the package?"
                            value={formData.destinataire}
                            onChange={(e) => setFormData({ ...formData, destinataire: e.target.value })}
                            error={errors.destinataire}
                        />
                        <Input
                            label="Delivery Address"
                            placeholder="Full delivery address"
                            value={formData.adresse}
                            onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                            error={errors.adresse}
                        />
                        <Input
                            label="Destination City"
                            placeholder="e.g., Casablanca, Rabat, Marrakech"
                            value={formData.villeDestination}
                            onChange={(e) => setFormData({ ...formData, villeDestination: e.target.value })}
                            error={errors.villeDestination}
                        />
                    </div>
                </Card>

                {/* Products */}
                <Card padding="md">
                    <div className="flex items-center justify-between mb-4">
                        <CardTitle>Products (Optional)</CardTitle>
                        <Button type="button" variant="ghost" size="sm" onClick={addProduct}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Product
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {products.map((product, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <Input
                                    placeholder="Product name"
                                    value={product.nom}
                                    onChange={(e) => updateProduct(index, 'nom', e.target.value)}
                                    className="flex-1"
                                />
                                <Input
                                    type="number"
                                    placeholder="Qty"
                                    value={product.quantite}
                                    onChange={(e) => updateProduct(index, 'quantite', parseInt(e.target.value) || 0)}
                                    className="w-20"
                                />
                                <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="kg"
                                    value={product.poids}
                                    onChange={(e) => updateProduct(index, 'poids', parseFloat(e.target.value) || 0)}
                                    className="w-24"
                                />
                                {products.length > 1 && (
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeProduct(index)}>
                                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Submit */}
                <div className="flex items-center justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        Create Package
                    </Button>
                </div>
            </form>
        </div>
    );
}
