import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface FilmGenre {
  id: number;
  movieGenre: string;
}

interface Director {
  id: number;
  nameDirector: string;
  lasNameDirector: string;
}

interface AudiovisualContent {
  id: number;
  tittle: string;
  relaseDate: string;
  description: string;
  duration: number;
  ageRating: number;
  trailerURL: string;
  countryProduction: string;
  ratingPromedy: number;
  directorId: number;
  directorName?: string;
  filmGenres: FilmGenre[];
}

const AudiovisualContent = () => {
  const [contents, setContents] = useState<AudiovisualContent[]>([]);
  const [loading, setLoading] = useState(true);

  const [directors, setDirectors] = useState<Director[]>([]);
  const [genres, setGenres] = useState<FilmGenre[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    tittle: "",
    relaseDate: "",
    description: "",
    duration: "",
    ageRating: "",
    trailerURL: "",
    countryProduction: "",
    directorId: "",
    selectedGenreIds: [] as number[],
  });

  const { toast } = useToast();

  const [cast, setCast] = useState<any[]>([]);
  const [actors, setActors] = useState<any[]>([]);
  const [isCastDialogOpen, setIsCastDialogOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    null,
  );
  const [newCastMember, setNewCastMember] = useState({
    actorId: "",
    character: "",
    actorType: "Secondary",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contentRes, directorRes, genreRes, actorRes] = await Promise.all([
        api.get("/api/audiovisual/findAll"),
        api.get("/api/directors/findAll"),
        api.get("/api/film-genres/findAll"),
        api.get("/api/actors/findAll"),
      ]);

      setContents(
        contentRes.data.sort(
          (a: AudiovisualContent, b: AudiovisualContent) => a.id - b.id,
        ),
      );
      setDirectors(directorRes.data);
      setGenres(genreRes.data);
      setActors(actorRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCast = async (contentId: number) => {
    try {
      const response = await api.get("/api/actor-audiovisual/findAll");
      const contentCast = response.data.filter(
        (item: any) =>
          item.audiovisualContentId === contentId ||
          item.audiovisualContent.id === contentId,
      );
      setCast(contentCast);
    } catch (error) {
      console.error("Error fetching cast", error);
    }
  };

  const handleManageCast = (content: AudiovisualContent) => {
    setSelectedContentId(content.id);
    fetchCast(content.id);
    setIsCastDialogOpen(true);
  };

  const handleAddCastMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContentId) return;

    try {
      const payload = {
        actorId: Number(newCastMember.actorId),
        audiovisualContentId: selectedContentId,
        character: newCastMember.character,
        actorType: newCastMember.actorType,

        audiovisualContent: { id: selectedContentId },
        actor: { id: Number(newCastMember.actorId) },
      };

      await api.post("/api/actor-audiovisual/create", payload);
      toast({ title: "Actor añadido al reparto" });
      fetchCast(selectedContentId);
      setNewCastMember({ actorId: "", character: "", actorType: "Secondary" });
    } catch (error) {
      console.error("Error adding cast member", error);
      toast({ variant: "destructive", title: "Error al añadir actor" });
    }
  };

  const handleDeleteCastMember = async (actorId: number) => {
    if (!selectedContentId || !confirm("¿Eliminar actor del reparto?")) return;
    try {
      await api.delete(
        `/api/actor-audiovisual/${actorId}/${selectedContentId}`,
      );
      toast({ title: "Actor eliminado del reparto" });
      fetchCast(selectedContentId);
    } catch (error) {
      console.error("Error deleting cast member", error);
      toast({ variant: "destructive", title: "Error al eliminar actor" });
    }
  };

  const handleGenreToggle = (genreId: number) => {
    setFormData((prev) => {
      const currentIds = prev.selectedGenreIds;
      if (currentIds.includes(genreId)) {
        return {
          ...prev,
          selectedGenreIds: currentIds.filter((id) => id !== genreId),
        };
      } else {
        return { ...prev, selectedGenreIds: [...currentIds, genreId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.directorId) {
      toast({ variant: "destructive", title: "Debes seleccionar un director" });
      return;
    }

    if (formData.selectedGenreIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Debes seleccionar al menos un género",
      });
      return;
    }

    const payload = {
      tittle: formData.tittle,
      relaseDate: formData.relaseDate,
      description: formData.description,
      duration: parseInt(formData.duration),
      ageRating: parseFloat(formData.ageRating),
      trailerURL: formData.trailerURL,
      countryProduction: formData.countryProduction,
      directorId: parseInt(formData.directorId),
      filmGenres: formData.selectedGenreIds.map((id) => ({ id })),
    };

    try {
      if (editingId) {
        await api.put(`/api/audiovisual/${editingId}`, payload);
        toast({ title: "Contenido actualizado" });
      } else {
        await api.post("/api/audiovisual/create", payload);
        toast({ title: "Contenido creado" });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving content", error);
      toast({ variant: "destructive", title: "Error al guardar" });
    }
  };

  const resetForm = () => {
    setFormData({
      tittle: "",
      relaseDate: "",
      description: "",
      duration: "",
      ageRating: "",
      trailerURL: "",
      countryProduction: "",
      directorId: "",
      selectedGenreIds: [],
    });
    setEditingId(null);
  };

  const handleEdit = (content: AudiovisualContent) => {
    setFormData({
      tittle: content.tittle,
      relaseDate: content.relaseDate,
      description: content.description,
      duration: content.duration.toString(),
      ageRating: content.ageRating.toString(),
      trailerURL: content.trailerURL,
      countryProduction: content.countryProduction,
      directorId: content.directorId?.toString() || "",
      selectedGenreIds: content.filmGenres.map((g) => g.id),
    });
    setEditingId(content.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este contenido?")) return;
    try {
      await api.delete(`/api/audiovisual/${id}`);
      toast({ title: "Contenido eliminado" });
      fetchData();
    } catch (error) {
      console.error("Error deleting", error);
      toast({ variant: "destructive", title: "Error al eliminar" });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 lg:px-8 mt-20">
        {}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Contenido Audiovisual
          </h1>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Nuevo Contenido
              </Button>
            </DialogTrigger>
            {}
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar" : "Crear"} Contenido Audiovisual
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                {}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Título
                    </label>
                    <Input
                      value={formData.tittle}
                      onChange={(e) =>
                        setFormData({ ...formData, tittle: e.target.value })
                      }
                      placeholder="Ej. Inception"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Fecha de Estreno
                    </label>
                    <Input
                      type="date"
                      value={formData.relaseDate}
                      onChange={(e) =>
                        setFormData({ ...formData, relaseDate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Duración (minutos)
                    </label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="Ej. 148"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Clasificación de Edad
                    </label>
                    <Input
                      type="number"
                      value={formData.ageRating}
                      onChange={(e) =>
                        setFormData({ ...formData, ageRating: e.target.value })
                      }
                      placeholder="Ej. 13"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      País de Producción
                    </label>
                    <Input
                      value={formData.countryProduction}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          countryProduction: e.target.value,
                        })
                      }
                      placeholder="Ej. USA"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Director
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.directorId}
                      onChange={(e) =>
                        setFormData({ ...formData, directorId: e.target.value })
                      }
                      required
                    >
                      <option value="">Seleccione un director...</option>
                      {directors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nameDirector} {d.lasNameDirector}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Trailer URL
                  </label>
                  <Input
                    value={formData.trailerURL}
                    onChange={(e) =>
                      setFormData({ ...formData, trailerURL: e.target.value })
                    }
                    placeholder="https://youtube.com/..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Descripción
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Sinopsis de la película..."
                    rows={3}
                  />
                </div>

                {}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Géneros
                  </label>
                  <div className="flex flex-wrap gap-2 p-4 border rounded-md bg-muted/20 max-h-40 overflow-y-auto">
                    {genres.map((genre) => (
                      <div
                        key={genre.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          id={`genre-${genre.id}`}
                          type="checkbox"
                          checked={formData.selectedGenreIds.includes(genre.id)}
                          onChange={() => handleGenreToggle(genre.id)}
                          className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary cursor-pointer"
                        />
                        <label
                          htmlFor={`genre-${genre.id}`}
                          className="text-sm font-medium cursor-pointer select-none"
                        >
                          {genre.movieGenre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Guardar Contenido
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {}
          <Dialog open={isCastDialogOpen} onOpenChange={setIsCastDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Gestionar Reparto</DialogTitle>
              </DialogHeader>

              {}
              <form
                onSubmit={handleAddCastMember}
                className="flex gap-2 items-end mb-6 p-4 bg-muted/20 rounded-lg"
              >
                <div className="flex-1">
                  <label className="text-xs font-medium mb-1 block">
                    Actor
                  </label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    value={newCastMember.actorId}
                    onChange={(e) =>
                      setNewCastMember({
                        ...newCastMember,
                        actorId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Seleccione...</option>
                    {actors.map((actor: any) => (
                      <option key={actor.id} value={actor.id}>
                        {actor.nameActor} {actor.lastNameActor}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium mb-1 block">
                    Personaje
                  </label>
                  <Input
                    value={newCastMember.character}
                    onChange={(e) =>
                      setNewCastMember({
                        ...newCastMember,
                        character: e.target.value,
                      })
                    }
                    className="h-9"
                    placeholder="Ej. Jack Dawson"
                    required
                  />
                </div>
                <div className="w-32">
                  <label className="text-xs font-medium mb-1 block">Tipo</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    value={newCastMember.actorType}
                    onChange={(e) =>
                      setNewCastMember({
                        ...newCastMember,
                        actorType: e.target.value,
                      })
                    }
                  >
                    <option value="Protagonista">Protagonista</option>
                    <option value="Antagonista">Antagonista</option>
                    <option value="Secundario">Secundario</option>
                  </select>
                </div>
                <Button type="submit" size="sm">
                  Añadir
                </Button>
              </form>

              {}
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Actor</TableHead>
                      <TableHead>Personaje</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cast.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No hay actores en el reparto.
                        </TableCell>
                      </TableRow>
                    ) : (
                      cast.map((member: any) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            {member.actor?.nameActor}{" "}
                            {member.actor?.lastNameActor}
                          </TableCell>
                          <TableCell>{member.character}</TableCell>
                          <TableCell>{member.actorType}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteCastMember(
                                  member.actorId || member.actor?.id,
                                )
                              }
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Estreno</TableHead>
                <TableHead>Director</TableHead>
                <TableHead>Géneros</TableHead>
                <TableHead className="text-center">Reparto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : contents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No hay contenido registrado.
                  </TableCell>
                </TableRow>
              ) : (
                contents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell>{content.id}</TableCell>
                    <TableCell className="font-medium">
                      {content.tittle}
                    </TableCell>
                    <TableCell>{content.relaseDate}</TableCell>
                    <TableCell>
                      {content.directorName ||
                        directors.find((d) => d.id === content.directorId)
                          ?.nameDirector ||
                        content.directorId}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {content.filmGenres?.map((g) => (
                          <Badge
                            key={g.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {g.movieGenre}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageCast(content)}
                      >
                        <Users className="w-3 h-3 mr-1" /> Gestionar
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(content)}
                      >
                        <Pencil className="w-4 h-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(content.id)}
                      >
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

export default AudiovisualContent;
