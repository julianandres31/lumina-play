import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Director {
    id: number;
    nameDirector: string;
    lasNameDirector: string; 
    yearbirth: string; 
    picture: string; 
    pictureContentType: string;
}

const Directors = () => {
    const [directors, setDirectors] = useState<Director[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        nameDirector: "",
        lasNameDirector: "",
        yearbirth: "",
        picture: "",
        pictureContentType: ""
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const { toast } = useToast();

    const fetchDirectors = async () => {
        try {
            const response = await api.get("/api/directors/findAll");
            const sorted = response.data.sort((a: Director, b: Director) => a.id - b.id);
            setDirectors(sorted);
        } catch (error) {
            console.error("Error fetching directors", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDirectors();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64Content = base64String.split(",")[1];
                setFormData({
                    ...formData,
                    picture: base64Content,
                    pictureContentType: file.type
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/api/directors/${editingId}`, formData);
                toast({ title: "Director actualizado" });
            } else {
                await api.post("/api/directors/create", formData);
                toast({ title: "Director creado" });
            }
            setIsDialogOpen(false);
            setFormData({ nameDirector: "", lasNameDirector: "", yearbirth: "", picture: "", pictureContentType: "" });
            setEditingId(null);
            fetchDirectors();
        } catch (error) {
            console.error("Error saving director", error);
            toast({ variant: "destructive", title: "Error al guardar" });
        }
    };

    const handleEdit = (director: Director) => {
        setFormData({
            nameDirector: director.nameDirector,
            lasNameDirector: director.lasNameDirector,
            yearbirth: director.yearbirth,
            picture: director.picture,
            pictureContentType: director.pictureContentType
        });
        setEditingId(director.id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este director?")) return;
        try {
            await api.delete(`/api/directors/${id}`);
            toast({ title: "Director eliminado" });
            fetchDirectors();
        } catch (error) {
            console.error("Error deleting", error);
            toast({ variant: "destructive", title: "Error al eliminar" });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 mt-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Directores</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { setEditingId(null); setFormData({ nameDirector: "", lasNameDirector: "", yearbirth: "", picture: "", pictureContentType: "" }); }}>
                                <Plus className="w-4 h-4 mr-2" /> Nuevo Director
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Editar" : "Crear"} Director</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Nombre</label>
                                        <Input
                                            value={formData.nameDirector}
                                            onChange={(e) => setFormData({ ...formData, nameDirector: e.target.value })}
                                            placeholder="Ej. Christopher"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Apellido</label>
                                        <Input
                                            value={formData.lasNameDirector}
                                            onChange={(e) => setFormData({ ...formData, lasNameDirector: e.target.value })}
                                            placeholder="Ej. Nolan"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Fecha de Nacimiento</label>
                                    <Input
                                        type="date"
                                        value={formData.yearbirth}
                                        onChange={(e) => setFormData({ ...formData, yearbirth: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Foto</label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                    {formData.picture && (
                                        <div className="mt-2">
                                            <img
                                                src={`data:${formData.pictureContentType || 'image/jpeg'};base64,${formData.picture}`}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover rounded-md border border-border"
                                            />
                                        </div>
                                    )}
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
                                <TableHead>Foto</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Apellido</TableHead>
                                <TableHead>Fecha Nac.</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">Cargando...</TableCell>
                                </TableRow>
                            ) : directors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay directores registrados.</TableCell>
                                </TableRow>
                            ) : (
                                directors.map((director) => (
                                    <TableRow key={director.id}>
                                        <TableCell>{director.id}</TableCell>
                                        <TableCell>
                                            {director.picture ? (
                                                <img
                                                    src={`data:${director.pictureContentType};base64,${director.picture}`}
                                                    alt={director.nameDirector}
                                                    className="w-10 h-10 object-cover rounded-full"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                                            )}
                                        </TableCell>
                                        <TableCell>{director.nameDirector}</TableCell>
                                        <TableCell>{director.lasNameDirector}</TableCell>
                                        <TableCell>{director.yearbirth}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(director)}>
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(director.id)}>
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

export default Directors;
