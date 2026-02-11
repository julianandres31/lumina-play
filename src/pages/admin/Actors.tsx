import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Actor {
    id: number;
    nameActor: string;
    lastNameActor: string;
    picture: string;
    pictureContentType: string;
}

const Actors = () => {
    const [actors, setActors] = useState<Actor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        nameActor: "",
        lastNameActor: "",
        picture: "",
        pictureContentType: ""
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const { toast } = useToast();

    const fetchActors = async () => {
        try {
            const response = await api.get("/api/actors/findAll");
            const sorted = response.data.sort((a: Actor, b: Actor) => a.id - b.id);
            setActors(sorted);
        } catch (error) {
            console.error("Error fetching actors", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActors();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({ variant: "destructive", title: "El archivo es demasiado grande. Máximo 5MB." });
                return;
            }
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
                await api.put(`/api/actors/${editingId}`, formData);
                toast({ title: "Actor actualizado" });
            } else {
                await api.post("/api/actors/create", formData);
                toast({ title: "Actor creado" });
            }
            setIsDialogOpen(false);
            setFormData({ nameActor: "", lastNameActor: "", picture: "", pictureContentType: "" });
            setEditingId(null);
            fetchActors();
        } catch (error: any) {
            console.error("Error saving actor", error);
            console.log("Error details:", error.response); // DEBUG
            let errorMessage = error.response?.data?.message || "Error al guardar el actor.";

            // Specific check for 403 with image payload
            if (error.response?.status === 403 && formData.picture) {
                errorMessage = "Error 403: El servidor rechazó la imagen. Es posible que el archivo sea demasiado grande para la configuración del servidor (límite usual: 1MB). Intenta con una imagen más pequeña.";
            } else if (error.response?.status === 403) {
                errorMessage = "Error 403: No tienes permisos para realizar esta acción.";
            }

            toast({ variant: "destructive", title: "Error", description: errorMessage });
        }
    };

    const handleEdit = (actor: Actor) => {
        setFormData({
            nameActor: actor.nameActor,
            lastNameActor: actor.lastNameActor,
            picture: actor.picture,
            pictureContentType: actor.pictureContentType
        });
        setEditingId(actor.id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este actor?")) return;
        try {
            await api.delete(`/api/actors/${id}`);
            toast({ title: "Actor eliminado" });
            fetchActors();
        } catch (error) {
            console.error("Error deleting", error);
            toast({ variant: "destructive", title: "Error al eliminar" });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 mt-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Actores</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { setEditingId(null); setFormData({ nameActor: "", lastNameActor: "", picture: "", pictureContentType: "" }); }}>
                                <Plus className="w-4 h-4 mr-2" /> Nuevo Actor
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Editar" : "Crear"} Actor</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Nombre</label>
                                        <Input
                                            value={formData.nameActor}
                                            onChange={(e) => setFormData({ ...formData, nameActor: e.target.value })}
                                            placeholder="Ej. Leonardo"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Apellido</label>
                                        <Input
                                            value={formData.lastNameActor}
                                            onChange={(e) => setFormData({ ...formData, lastNameActor: e.target.value })}
                                            placeholder="Ej. DiCaprio"
                                            required
                                        />
                                    </div>
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
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Cargando...</TableCell>
                                </TableRow>
                            ) : actors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hay actores registrados.</TableCell>
                                </TableRow>
                            ) : (
                                actors.map((actor) => (
                                    <TableRow key={actor.id}>
                                        <TableCell>{actor.id}</TableCell>
                                        <TableCell>
                                            {actor.picture ? (
                                                <img
                                                    src={`data:${actor.pictureContentType};base64,${actor.picture}`}
                                                    alt={actor.nameActor}
                                                    className="w-10 h-10 object-cover rounded-full"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                                            )}
                                        </TableCell>
                                        <TableCell>{actor.nameActor}</TableCell>
                                        <TableCell>{actor.lastNameActor}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(actor)}>
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(actor.id)}>
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

export default Actors;
