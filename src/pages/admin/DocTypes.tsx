import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentType {
    id: number;
    initials: string;
    documentName: string;
}

const DocTypes = () => {
    const [types, setTypes] = useState<DocumentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ initials: "", documentName: "" });
    const [editingId, setEditingId] = useState<number | null>(null);
    const { toast } = useToast();

    const fetchTypes = async () => {
        try {
            const response = await api.get("/api/document-types/findAll");
            const sorted = response.data.sort((a: DocumentType, b: DocumentType) => a.id - b.id);
            setTypes(sorted);
        } catch (error) {
            console.error("Error fetching types", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put("/api/document-types/update", { id: editingId, ...formData });
                toast({ title: "Tipo de documento actualizado" });
            } else {
                await api.post("/api/document-types/create", formData);
                toast({ title: "Tipo de documento creado" });
            }
            setIsDialogOpen(false);
            setFormData({ initials: "", documentName: "" });
            setEditingId(null);
            fetchTypes();
        } catch (error) {
            console.error("Error saving type", error);
            toast({ variant: "destructive", title: "Error al guardar" });
        }
    };

    const handleEdit = (type: DocumentType) => {
        setFormData({ initials: type.initials, documentName: type.documentName });
        setEditingId(type.id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este tipo de documento?")) return;
        try {
            await api.delete(`/api/document-types/delete/${id}`);
            toast({ title: "Eliminado correctamente" });
            fetchTypes();
        } catch (error) {
            console.error("Error deleting", error);
            toast({ variant: "destructive", title: "Error al eliminar" });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 mt-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Tipos de Documento</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { setEditingId(null); setFormData({ initials: "", documentName: "" }); }}>
                                <Plus className="w-4 h-4 mr-2" /> Nuevo Tipo
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Editar" : "Crear"} Tipo de Documento</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Siglas (Iniciales)</label>
                                    <Input
                                        value={formData.initials}
                                        onChange={(e) => setFormData({ ...formData, initials: e.target.value })}
                                        placeholder="Ej. CC"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Nombre Completo</label>
                                    <Input
                                        value={formData.documentName}
                                        onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
                                        placeholder="Ej. Cédula de Ciudadanía"
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
                                <TableHead>Siglas</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">Cargando...</TableCell>
                                </TableRow>
                            ) : types.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No hay registros.</TableCell>
                                </TableRow>
                            ) : (
                                types.map((type) => (
                                    <TableRow key={type.id}>
                                        <TableCell>{type.id}</TableCell>
                                        <TableCell>{type.initials}</TableCell>
                                        <TableCell>{type.documentName}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(type)}>
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(type.id)}>
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

export default DocTypes;
