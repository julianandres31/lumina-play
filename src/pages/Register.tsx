import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, FileText, MapPin, PersonStanding } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import api, { publicApi } from "@/lib/api";
import { City, DocType, Sex, RegisterPayload } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<RegisterPayload>({
    username: "",
    email: "",
    password: "",
    documentNumber: "",
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    documentTypeId: 0,
    sexId: 0,
    cityId: 0
  });

  const [cities, setCities] = useState<City[]>([]);
  const [docTypes, setDocTypes] = useState<DocType[]>([]);
  const [sexes, setSexes] = useState<Sex[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [cityRes, docRes, sexRes] = await Promise.all([
          publicApi.get("/api/cities/findAll"),
          publicApi.get("/api/document-types/findAll"),
          publicApi.get("/api/sex/findAll")
        ]);
        setCities(cityRes.data);
        setDocTypes(docRes.data);
        setSexes(sexRes.data);
      } catch (error) {
        console.error("Error fetching options", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las opciones de registro." });
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.endsWith("Id") ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.documentTypeId || !formData.sexId || !formData.cityId) {
      toast({ variant: "destructive", title: "Error", description: "Por favor complete todos los campos seleccionables." });
      return;
    }

    try {
      await register(formData);
      navigate("/login");
    } catch (error) {
      // Error is handled in context
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl">
          <div className="glass-card p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">Crea tu cuenta</h1>
              <p className="text-sm text-muted-foreground">Únete a Entertaiment y disfruta del mejor contenido</p>
            </div>

            {loadingOptions ? (
              <div className="text-center py-10">Cargando formulario...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Account Info */}
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-sm font-semibold mb-2 text-primary">Datos de Cuenta</h3>
                  </div>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      name="username"
                      placeholder="Nombre de usuario"
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Correo electrónico"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="relative col-span-1 md:col-span-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 bg-muted/50 border-border/50 focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Personal Info */}
                  <div className="col-span-1 md:col-span-2 mt-4">
                    <h3 className="text-sm font-semibold mb-2 text-primary">Datos Personales</h3>
                  </div>

                  <div>
                    <Input
                      name="firstName"
                      placeholder="Primer Nombre"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="bg-muted/50 border-border/50"
                    />
                  </div>
                  <div>
                    <Input
                      name="secondName"
                      placeholder="Segundo Nombre (Opcional)"
                      value={formData.secondName || ""}
                      onChange={handleChange}
                      className="bg-muted/50 border-border/50"
                    />
                  </div>
                  <div>
                    <Input
                      name="firstLastName"
                      placeholder="Primer Apellido"
                      value={formData.firstLastName}
                      onChange={handleChange}
                      required
                      className="bg-muted/50 border-border/50"
                    />
                  </div>
                  <div>
                    <Input
                      name="secondLastName"
                      placeholder="Segundo Apellido (Opcional)"
                      value={formData.secondLastName || ""}
                      onChange={handleChange}
                      className="bg-muted/50 border-border/50"
                    />
                  </div>

                  {/* Document Info */}
                  <div>
                    <select
                      name="documentTypeId"
                      value={formData.documentTypeId}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      required
                    >
                      <option value={0}>Tipo de Documento</option>
                      {docTypes.map(dt => (
                        <option key={dt.id} value={dt.id}>{dt.documentName} ({dt.initials})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Input
                      name="documentNumber"
                      placeholder="Número de Documento"
                      value={formData.documentNumber}
                      onChange={handleChange}
                      required
                      className="bg-muted/50 border-border/50"
                    />
                  </div>

                  {/* Location & Sex */}
                  <div>
                    <select
                      name="sexId"
                      value={formData.sexId}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      required
                    >
                      <option value={0}>Sexo</option>
                      {sexes.map(s => (
                        <option key={s.id} value={s.id}>{s.sexName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      name="cityId"
                      value={formData.cityId}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      required
                    >
                      <option value={0}>Ciudad</option>
                      {cities.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Crear Cuenta"}
                </Button>
              </form>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
