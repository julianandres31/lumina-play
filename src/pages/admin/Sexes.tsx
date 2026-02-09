import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sex {
    id: number;
    sexName: string;
}

const Sexes = () => {
    const [sexes, setSexes] = useState<Sex[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ sexName: "" });
    const [editingId, setEditingId] = useState<number | null>(null);
    const { toast } = useToast();

    const fetchSexes = async () => {
        try {
            const response = await api.get("/api/sex/findAll");
            const sorted = response.data.sort((a: Sex, b: Sex) => a.id - b.id);
            setSexes(sorted);
        } catch (error) {
            console.error("Error fetching sexes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSexes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put("/api/sex/update", { id: editingId, ...formData });
                toast({ title: "Registro actualizado" });
            } else {
                await api.post("/api/sex/create", formData);
                toast({ title: "Registro creado" });
            }
            setIsDialogOpen(false);
            setFormData({ sexName: "" });
            setEditingId(null);
            fetchSexes();
        } catch (error) {
            console.error("Error saving sex", error);
            toast({ variant: "destructive", title: "Error al guardar" });
        }
    };

    const handleEdit = (sex: Sex) => {
        setFormData({ sexName: sex.sexName });
        setEditingId(sex.id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este registro?")) return;
        try {
            await api.delete(`/api/sex/delete/${id}`);
            toast({ title: "Registro eliminado" });
            fetchSexes();
        } catch (error) {
            console.error("Error deleting", error);
            toast({ variant: "destructive", title: "Error al eliminar" });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 mt-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Sexo</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { setEditingId(null); setFormData({ sexName: "" }); }}>
                                <Plus className="w-4 h-4 mr-2" /> Nuevo Registro
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Editar" : "Crear"} Sexo</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Nombre</label>
                                    <Input
                                        value={formData.sexName}
                                        onChange={(e) => setFormData({ ...formData, sexName: e.target.value })}
                                        placeholder="Ej. Masculino"
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
                            ) : sexes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No hay registros.</TableCell>
                                </TableRow>
                            ) : (
                                sexes.map((sex) => (
                                    <TableRow key={sex.id}>
                                        <TableCell>{sex.id}</TableCell>
                                        <TableCell>{sex.sexName}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(sex)}>
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(sex.id)}>
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

export default Sexes;
