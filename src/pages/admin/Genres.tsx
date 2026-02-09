import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Genre {
    id: number;
    movieGenre: string;
}

const Genres = () => {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ movieGenre: "" });
    const [editingId, setEditingId] = useState<number | null>(null);
    const { toast } = useToast();

    const fetchGenres = async () => {
        try {
            const response = await api.get("/api/film-genres/findAll");
            const sorted = response.data.sort((a: Genre, b: Genre) => a.id - b.id);
            setGenres(sorted);
        } catch (error) {
            console.error("Error fetching genres", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        
        const normalize = (str: string) => str.trim().toLowerCase();
        const duplicate = genres.find(g =>
            normalize(g.movieGenre) === normalize(formData.movieGenre) &&
            g.id !== editingId
        );

        if (duplicate) {
            toast({ variant: "destructive", title: "Error: El género ya existe" });
            return;
        }

        try {
            if (editingId) {
                
                await api.put("/api/film-genres/update", { id: editingId, ...formData });
                toast({ title: "Género actualizado" });
            } else {
                await api.post("/api/film-genres/create", formData);
                toast({ title: "Género creado" });
            }
            setIsDialogOpen(false);
            setFormData({ movieGenre: "" });
            setEditingId(null);
            fetchGenres();
        } catch (error) {
            console.error("Error saving genre", error);
            toast({ variant: "destructive", title: "Error al guardar" });
        }
    };

    const handleEdit = (genre: Genre) => {
        setFormData({ movieGenre: genre.movieGenre });
        setEditingId(genre.id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este género?")) return;
        try {
            await api.delete(`/api/film-genres/delete/${id}`);
            toast({ title: "Género eliminado" });
            fetchGenres();
        } catch (error) {
            console.error("Error deleting", error);
            toast({ variant: "destructive", title: "Error al eliminar" });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 mt-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Géneros</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { setEditingId(null); setFormData({ movieGenre: "" }); }}>
                                <Plus className="w-4 h-4 mr-2" /> Nuevo Género
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Editar" : "Crear"} Género</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Nombre del Género</label>
                                    <Input
                                        value={formData.movieGenre}
                                        onChange={(e) => setFormData({ ...formData, movieGenre: e.target.value })}
                                        placeholder="Ej. Acción"
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
                                <TableHead>Género</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8">Cargando...</TableCell>
                                </TableRow>
                            ) : genres.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No hay géneros registrados.</TableCell>
                                </TableRow>
                            ) : (
                                genres.map((genre) => (
                                    <TableRow key={genre.id}>
                                        <TableCell>{genre.id}</TableCell>
                                        <TableCell>{genre.movieGenre}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(genre)}>
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(genre.id)}>
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

export default Genres;
