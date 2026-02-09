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

const Departments = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ departamentName: "" });
    const [editingId, setEditingId] = useState<number | null>(null);
    const { toast } = useToast();

    const fetchDepartments = async () => {
        try {
            const response = await api.get("/api/departaments/findAll");
            const sorted = response.data.sort((a: Department, b: Department) => a.id - b.id);
            setDepartments(sorted);
        } catch (error) {
            console.error("Error fetching departments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/api/departaments/${editingId}`, formData);
                toast({ title: "Departamento actualizado" });
            } else {
                await api.post("/api/departaments/create", formData);
                toast({ title: "Departamento creado" });
            }
            setIsDialogOpen(false);
            setFormData({ departamentName: "" });
            setEditingId(null);
            fetchDepartments();
        } catch (error) {
            console.error("Error saving department", error);
            toast({ variant: "destructive", title: "Error al guardar" });
        }
    };

    const handleEdit = (dept: Department) => {
        setFormData({ departamentName: dept.departamentName });
        setEditingId(dept.id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este departamento?")) return;
        try {
            await api.delete(`/api/departaments/${id}`);
            toast({ title: "Departamento eliminado" });
            fetchDepartments();
        } catch (error) {
            console.error("Error deleting", error);
            toast({ variant: "destructive", title: "Error al eliminar" });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 mt-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Departamentos</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { setEditingId(null); setFormData({ departamentName: "" }); }}>
                                <Plus className="w-4 h-4 mr-2" /> Nuevo Departamento
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Editar" : "Crear"} Departamento</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Nombre del Departamento</label>
                                    <Input
                                        value={formData.departamentName}
                                        onChange={(e) => setFormData({ ...formData, departamentName: e.target.value })}
                                        placeholder="Ej. Cundinamarca"
                                        required
                                    />
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
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8">Cargando...</TableCell>
                                </TableRow>
                            ) : departments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No hay departamentos registrados.</TableCell>
                                </TableRow>
                            ) : (
                                departments.map((dept) => (
                                    <TableRow key={dept.id}>
                                        <TableCell>{dept.id}</TableCell>
                                        <TableCell>{dept.departamentName}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(dept)}>
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)}>
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

export default Departments;
