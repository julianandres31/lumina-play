import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Membership {
    id: number;
    membershipName: string;
    price: number;
    duration: number;
    description: string;
    imagen: string;
    imagenContentType: string;
}

const Memberships = () => {
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        membershipName: "",
        price: "",
        duration: "",
        description: "",
        imagen: "",
        imagenContentType: ""
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const { toast } = useToast();


    const fetchMemberships = async () => {
        try {
            const response = await api.get("/api/membreships/findAll");
            const sorted = response.data.sort((a: Membership, b: Membership) => a.id - b.id);
            setMemberships(sorted);
        } catch (error) {
            console.error("Error fetching memberships", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemberships();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({ variant: "destructive", title: "El archivo es demasiado grande. Máximo 5MB." });
                return;
            }

            // Image Compression Logic
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resize logic: Max dimension 800px
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    const base64Content = dataUrl.split(",")[1];

                    setFormData({
                        ...formData,
                        imagen: base64Content,
                        imagenContentType: 'image/jpeg' // Always convert to JPEG
                    });
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const priceValue = parseFloat(formData.price);
            const durationValue = parseInt(formData.duration);

            if (isNaN(priceValue) || isNaN(durationValue)) {
                toast({ variant: "destructive", title: "Error", description: "Por favor ingrese valores numéricos válidos para precio y duración." });
                return;
            }

            const payload = {
                ...formData,
                price: priceValue,
                duration: durationValue
            };

            console.log("Sending Payload:", payload); // DEBUG PAYLOAD

            if (editingId) {

                await api.put("/api/membreships/update", { id: editingId, ...payload });
                toast({ title: "Membresía actualizada" });
            } else {
                await api.post("/api/membreships/create", payload);
                toast({ title: "Membresía creada" });
            }
            setIsDialogOpen(false);
            setFormData({ membershipName: "", price: "", duration: "", description: "", imagen: "", imagenContentType: "" });
            setEditingId(null);
            fetchMemberships();
        } catch (error: any) {
            console.error("Error saving membership", error);
            console.log("Error details:", error.response);

            let errorMessage = error.response?.data?.message || "Error al guardar la membresía.";

            if (error.response?.status === 400 && error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                if (Array.isArray(validationErrors)) {
                    const messages = validationErrors.map((err: any) => `${err.field}: ${err.defaultMessage}`).join(", ");
                    errorMessage = `Error de validación: ${messages}`;
                }
            }

            // Specific check for 403 with image payload
            if (error.response?.status === 403 && formData.imagen) {
                errorMessage = "Error 403: El servidor rechazó la imagen. Es posible que el archivo sea demasiado grande para la configuración del servidor. Intenta con una imagen más pequeña.";
            } else if (error.response?.status === 403) {
                errorMessage = "Error 403: No tienes permisos para realizar esta acción.";
            }

            toast({ variant: "destructive", title: "Error", description: errorMessage });
        }
    };

    const handleEdit = (membership: Membership) => {
        setFormData({
            membershipName: membership.membershipName,
            price: membership.price.toString(),
            duration: membership.duration.toString(),
            description: membership.description,
            imagen: membership.imagen,
            imagenContentType: membership.imagenContentType
        });
        setEditingId(membership.id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar esta membresía?")) return;
        try {
            await api.delete(`/api/membreships/delete/${id}`);
            toast({ title: "Membresía eliminada" });
            fetchMemberships();
        } catch (error) {
            console.error("Error deleting", error);
            toast({ variant: "destructive", title: "Error al eliminar" });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 mt-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Membresías</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { setEditingId(null); setFormData({ membershipName: "", price: "", duration: "", description: "", imagen: "", imagenContentType: "" }); }}>
                                <Plus className="w-4 h-4 mr-2" /> Nueva Membresía
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Editar" : "Crear"} Membresía</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Nombre</label>
                                        <Input
                                            value={formData.membershipName}
                                            onChange={(e) => setFormData({ ...formData, membershipName: e.target.value })}
                                            placeholder="Ej. Plan Premium"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Precio</label>
                                        <Input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="Ej. 15000"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Duración (Días)</label>
                                        <Input
                                            type="number"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            placeholder="Ej. 30"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Imagen</label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Descripción</label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Descripción de los beneficios del plan..."
                                        rows={3}
                                    />
                                </div>
                                {formData.imagen && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium mb-1">Vista previa:</p>
                                        <img
                                            src={`data:${formData.imagenContentType || 'image/jpeg'};base64,${formData.imagen}`}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-md border border-border"
                                        />
                                    </div>
                                )}
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
                                <TableHead>Imagen</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Duración</TableHead>
                                <TableHead className="hidden md:table-cell">Descripción</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">Cargando...</TableCell>
                                </TableRow>
                            ) : memberships.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No hay membresías registradas.</TableCell>
                                </TableRow>
                            ) : (
                                memberships.map((membership) => (
                                    <TableRow key={membership.id}>
                                        <TableCell>{membership.id}</TableCell>
                                        <TableCell>
                                            {membership.imagen ? (
                                                <img
                                                    src={`data:${membership.imagenContentType};base64,${membership.imagen}`}
                                                    alt={membership.membershipName}
                                                    className="w-12 h-8 object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="w-12 h-8 bg-muted rounded-md flex items-center justify-center text-[10px] text-muted-foreground">N/A</div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{membership.membershipName}</TableCell>
                                        <TableCell>${membership.price}</TableCell>
                                        <TableCell>{membership.duration} días</TableCell>
                                        <TableCell className="hidden md:table-cell max-w-xs truncate text-muted-foreground" title={membership.description}>
                                            {membership.description}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(membership)}>
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(membership.id)}>
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

export default Memberships;
