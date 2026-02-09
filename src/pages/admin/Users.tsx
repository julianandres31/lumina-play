import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface User {
    id: number;
    login: string;
    firstName: string;
    lastName: string;
    email: string;
    activated: boolean;
    langKey: string;
    imageUrl: string;
    authorities: string[];
}

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        login: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "", 
        langKey: "es",
        imageUrl: "",
        activated: true,
        authorities: [] as string[]
    });

    const { toast } = useToast();

    
    const AVAILABLE_ROLES = ["ROLE_ADMIN", "ROLE_USER"];

    const fetchUsers = async () => {
        try {
            const response = await api.get("/api/users/findAll");
            setUsers(response.data.sort((a: User, b: User) => a.id - b.id));
        } catch (error) {
            console.error("Error fetching users", error);
            
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleToggle = (role: string) => {
        setFormData(prev => {
            const currentRoles = prev.authorities;
            if (currentRoles.includes(role)) {
                return { ...prev, authorities: currentRoles.filter(r => r !== role) };
            } else {
                return { ...prev, authorities: [...currentRoles, role] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        
        if (!editingId && !formData.password) {
            toast({ variant: "destructive", title: "La contraseña es obligatoria para nuevos usuarios" });
            return;
        }

        const payload = {
            login: formData.login,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            langKey: formData.langKey,
            imageUrl: formData.imageUrl,
            activated: formData.activated,
            authorities: formData.authorities
        };

        try {
            if (editingId) {
                await api.put(`/api/users/${editingId}`, payload);

                
                
                

                toast({ title: "Usuario actualizado" });
            } else {
                await api.post("/api/users/create", payload);
                toast({ title: "Usuario creado" });
            }
            setIsDialogOpen(false);
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error("Error saving user", error);
            toast({ variant: "destructive", title: "Error al guardar usuario" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
        try {
            await api.delete(`/api/users/${id}`);
            toast({ title: "Usuario eliminado" });
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user", error);
            toast({ variant: "destructive", title: "Error al eliminar" });
        }
    };

    const handleEdit = (user: User) => {
        setFormData({
            login: user.login,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: "", 
            langKey: user.langKey,
            imageUrl: user.imageUrl,
            activated: user.activated,
            authorities: user.authorities || []
        });
        setEditingId(user.id);
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            login: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            langKey: "es",
            imageUrl: "",
            activated: true,
            authorities: []
        });
        setEditingId(null);
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 mt-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" /> Nuevo Usuario
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Editar" : "Crear"} Usuario</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Login (Username)</label>
                                        <Input
                                            value={formData.login}
                                            onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Email</label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Nombre</label>
                                        <Input
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Apellido</label>
                                        <Input
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {!editingId && (
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Contraseña</label>
                                        <Input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required={!editingId}
                                            placeholder="******"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-medium mb-1 block">Roles</label>
                                    <div className="flex gap-4 p-3 border rounded-md bg-muted/20">
                                        {AVAILABLE_ROLES.map(role => (
                                            <div key={role} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={role}
                                                    checked={formData.authorities.includes(role)}
                                                    onChange={() => handleRoleToggle(role)}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <label htmlFor={role} className="text-sm cursor-pointer select-none">
                                                    {role.replace("ROLE_", "")}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="activated"
                                        checked={formData.activated}
                                        onChange={(e) => setFormData({ ...formData, activated: e.target.checked })}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="activated" className="text-sm cursor-pointer select-none">
                                        Cuenta Activada
                                    </label>
                                </div>

                                <Button type="submit" className="w-full">Guardar Usuario</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Nombre Completo</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">Cargando...</TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No hay usuarios registrados.</TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell className="font-medium">{user.login}</TableCell>
                                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {user.authorities?.map(role => (
                                                    <Badge key={role} variant="outline" className="text-xs">
                                                        {role.replace("ROLE_", "")}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.activated ? "default" : "destructive"}>
                                                {user.activated ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
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

export default Users;
