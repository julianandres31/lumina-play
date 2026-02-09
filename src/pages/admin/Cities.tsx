import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface Department {
    id: number;
    departamentName: string;
}

interface City {
    id: number;
    name: string;
    departamentId?: number;
    departamentName?: string; 
}

const Cities = () => {
    const [cities, setCities] = useState<City[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]); 
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", departamentId: "" });
    const [editingId, setEditingId] = useState<number | null>(null);
    const { toast } = useToast();

    
    const fetchCities = async () => {
        try {
            const response = await api.get("/api/cities/findAll");
            const sorted = response.data.sort((a: City, b: City) => a.id - b.id);
            setCities(sorted);
        } catch (error) {
            console.error("Error fetching cities", error);
        } finally {
            setLoading(false);
        }
    };

    
    const fetchDepartments = async () => {
        try {
            const response = await api.get("/api/departaments/findAll");
            const sorted = response.data.sort((a: Department, b: Department) => a.id - b.id);
            setDepartments(sorted);
        } catch (error) {
            console.error("Error fetching departments", error);
        }
    };

    useEffect(() => {
        fetchCities();
        fetchDepartments(); 
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.departamentId) {
            toast({ variant: "destructive", title: "Debes seleccionar un departamento" });
            return;
        }

        const payload = {
            name: formData.name,
            departamentId: Number(formData.departamentId)
        };

        try {
            if (editingId) {
                await api.put(`/api/cities/${editingId}`, payload);
                toast({ title: "Ciudad actualizada" });
            } else {
                await api.post("/api/cities/create", payload);
                toast({ title: "Ciudad creada" });
            }
            setIsDialogOpen(false);
            setFormData({ name: "", departamentId: "" });
            setEditingId(null);
            fetchCities();
        } catch (error) {
            console.error("Error saving city", error);
            toast({ variant: "destructive", title: "Error al guardar" });
        }
    };

    const handleEdit = (city: City) => {
        setFormData({
            name: city.name,
            departamentId: city.departamentId?.toString() || ""
        });
        setEditingId(city.id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar esta ciudad?")) return;
        try {
            await api.delete(`/api/cities/${id}`);
            toast({ title: "Ciudad eliminada" });
            fetchCities();
        } catch (error) {
            console.error("Error deleting", error);
            toast({ variant: "destructive", title: "Error al eliminar" });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 mt-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Ciudades</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { setEditingId(null); setFormData({ name: "", departamentId: "" }); }}>
                                <Plus className="w-4 h-4 mr-2" /> Nueva Ciudad
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Editar" : "Crear"} Ciudad</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Nombre</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ej. Medellín"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Departamento</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.departamentId}
                                        onChange={(e) => setFormData({ ...formData, departamentId: e.target.value })}
                                        required
                                    >
                                        <option value="">Seleccione un departamento...</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.departamentName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Button type="submit" className="w-full">Guardar</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Departamento</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">Cargando...</TableCell>
                                </TableRow>
                            ) : cities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No hay ciudades registradas.</TableCell>
                                </TableRow>
                            ) : (
                                cities.map((city) => (
                                    <TableRow key={city.id}>
                                        <TableCell>{city.id}</TableCell>
                                        <TableCell>{city.name}</TableCell>
                                        <TableCell>
                                            {}
                                            {city.departamentName || departments.find(d => d.id === city.departamentId)?.departamentName || city.departamentId || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(city)}>
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(city.id)}>
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

export default Cities;
