import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";


interface User {
    id: number;
    login: string;
}

interface DocType {
    id: number;
    documentName: string;
    initials: string;
}

interface Sex {
    id: number;
    sexName: string;
}

interface City {
    id: number;
    name: string;
}

interface FilmGenre {
    id: number;
    movieGenre: string;
}

interface Customer {
    id: number;
    documentNumber: string;
    firstName: string;
    secondName: string;
    firstLasName: string;
    secondLastName: string;
    user: User;
    filmGenres: FilmGenre[];
    documentType: DocType;
    sex: Sex;
    cities: City;
}

const Customers = () => {

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);


    const [users, setUsers] = useState<User[]>([]);
    const [docTypes, setDocTypes] = useState<DocType[]>([]);
    const [sexes, setSexes] = useState<Sex[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [genres, setGenres] = useState<FilmGenre[]>([]);


    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);


    const [formData, setFormData] = useState({
        documentNumber: "",
        firstName: "",
        secondName: "",
        firstLasName: "",
        secondLastName: "",
        userId: "",
        documentTypeId: "",
        sexId: "",
        cityId: "",
        selectedGenreIds: [] as number[]
    });

    const { toast } = useToast();


    const fetchData = async () => {
        try {
            const [custRes, userRes, docRes, sexRes, cityRes, genreRes] = await Promise.all([
                api.get("/api/customers/findAll"),
                api.get("/api/users/findAll"),
                api.get("/api/document-types/findAll"),
                api.get("/api/sex/findAll"),
                api.get("/api/cities/findAll"),
                api.get("/api/film-genres/findAll")
            ]);

            setCustomers(custRes.data.sort((a: Customer, b: Customer) => a.id - b.id));
            setUsers(userRes.data);
            setDocTypes(docRes.data);
            setSexes(sexRes.data);
            setCities(cityRes.data);
            setGenres(genreRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleGenreToggle = (genreId: number) => {
        setFormData(prev => {
            const currentIds = prev.selectedGenreIds;
            if (currentIds.includes(genreId)) {
                return { ...prev, selectedGenreIds: currentIds.filter(id => id !== genreId) };
            } else {
                return { ...prev, selectedGenreIds: [...currentIds, genreId] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (!formData.userId || !formData.documentTypeId || !formData.sexId || !formData.cityId) {
            toast({ variant: "destructive", title: "Por favor complete todos los campos obligatorios" });
            return;
        }

        const payload = {
            documentNumber: formData.documentNumber,
            firstName: formData.firstName,
            secondName: formData.secondName,
            firstLasName: formData.firstLasName,
            secondLastName: formData.secondLastName,
            user: { id: parseInt(formData.userId) },
            documentType: { id: parseInt(formData.documentTypeId) },
            sex: { id: parseInt(formData.sexId) },
            cities: { id: parseInt(formData.cityId) },
            filmGenres: formData.selectedGenreIds.map(id => ({ id }))
        };

        try {
            if (editingId) {
                await api.put(`/api/customers/${editingId}`, payload);
                toast({ title: "Cliente actualizado" });
            } else {
                await api.post("/api/customers/create", payload);
                toast({ title: "Cliente creado" });
            }
            setIsDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error("Error saving customer", error);
            toast({ variant: "destructive", title: "Error al guardar cliente" });
        }
    };

    const handleEdit = (customer: Customer) => {
        setFormData({
            documentNumber: customer.documentNumber,
            firstName: customer.firstName,
            secondName: customer.secondName || "",
            firstLasName: customer.firstLasName,
            secondLastName: customer.secondLastName || "",
            userId: customer.user?.id.toString() || "",
            documentTypeId: customer.documentType?.id.toString() || "",
            sexId: customer.sex?.id.toString() || "",
            cityId: customer.cities?.id.toString() || "",
            selectedGenreIds: customer.filmGenres?.map(g => g.id) || []
        });
        setEditingId(customer.id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
        try {
            await api.delete(`/api/customers/${id}`);
            toast({ title: "Cliente eliminado" });
            fetchData();
        } catch (error) {
            console.error("Error deleting customer", error);
            toast({ variant: "destructive", title: "Error al eliminar" });
        }
    };

    const resetForm = () => {
        setFormData({
            documentNumber: "",
            firstName: "",
            secondName: "",
            firstLasName: "",
            secondLastName: "",
            userId: "",
            documentTypeId: "",
            sexId: "",
            cityId: "",
            selectedGenreIds: []
        });
        setEditingId(null);
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 mt-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Clientes</h1>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" /> Nuevo Cliente
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Editar" : "Crear"} Cliente</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-6 mt-4">

                                {/* Nombres */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Primer Nombre</label>
                                        <Input
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Segundo Nombre</label>
                                        <Input
                                            value={formData.secondName}
                                            onChange={(e) => setFormData({ ...formData, secondName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Primer Apellido</label>
                                        <Input
                                            value={formData.firstLasName}
                                            onChange={(e) => setFormData({ ...formData, firstLasName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Segundo Apellido</label>
                                        <Input
                                            value={formData.secondLastName}
                                            onChange={(e) => setFormData({ ...formData, secondLastName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Documento */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Tipo de Documento</label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={formData.documentTypeId}
                                            onChange={(e) => setFormData({ ...formData, documentTypeId: e.target.value })}
                                            required
                                        >
                                            <option value="">Seleccione...</option>
                                            {docTypes.map(d => (
                                                <option key={d.id} value={d.id}>{d.documentName} ({d.initials})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Número de Documento</label>
                                        <Input
                                            value={formData.documentNumber}
                                            onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Sexo y Ciudad */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Sexo</label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={formData.sexId}
                                            onChange={(e) => setFormData({ ...formData, sexId: e.target.value })}
                                            required
                                        >
                                            <option value="">Seleccione...</option>
                                            {sexes.map(s => (
                                                <option key={s.id} value={s.id}>{s.sexName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Ciudad</label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={formData.cityId}
                                            onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                                            required
                                        >
                                            <option value="">Seleccione...</option>
                                            {cities.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Usuario */}
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Usuario del Sistema</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.userId}
                                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                        required
                                    >
                                        <option value="">Seleccione un usuario...</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>
                                                {u.login}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-muted-foreground mt-1">El cliente debe estar asociado a un usuario registrado.</p>
                                </div>

                                {/* Géneros */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Gustos / Géneros Favoritos</label>
                                    <div className="flex flex-wrap gap-2 p-4 border rounded-md bg-muted/20 max-h-40 overflow-y-auto">
                                        {genres.map((genre) => (
                                            <div key={genre.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`genre-${genre.id}`}
                                                    checked={formData.selectedGenreIds.includes(genre.id)}
                                                    onChange={() => handleGenreToggle(genre.id)}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <label htmlFor={`genre-${genre.id}`} className="text-sm cursor-pointer select-none">
                                                    {genre.movieGenre}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit" className="w-full">Guardar Cliente</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre Completo</TableHead>
                                <TableHead>Documento</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Ciudad</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">Cargando...</TableCell>
                                </TableRow>
                            ) : customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay clientes registrados.</TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>{customer.id}</TableCell>
                                        <TableCell className="font-medium">
                                            {customer.firstName} {customer.secondName} {customer.firstLasName} {customer.secondLastName}
                                        </TableCell>
                                        <TableCell>
                                            {customer.documentType?.initials} {customer.documentNumber}
                                        </TableCell>
                                        <TableCell>{customer.user?.login}</TableCell>
                                        <TableCell>{customer.cities?.name}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Layout>
    );
};

export default Customers;
