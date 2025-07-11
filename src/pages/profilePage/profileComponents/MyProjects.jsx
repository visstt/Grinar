import Card from "../../../shared/ui/components/Card/Card";
import useMyProfile from "../hooks/useMyProfile";

export default function MyProjects() {
  const { profile, loading, error } = useMyProfile();

  if (loading) return <div>Загрузка...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>
        Ошибка: {typeof error === "string" ? error : error?.message || "Ошибка"}
      </div>
    );
  if (!profile?.projects?.length) return <div>Нет проектов</div>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
      {profile.projects.map((project) => (
        <Card
          key={project.id}
          project={{
            projectPhotoName: project.photoName,
            name: project.name,
            userLogoPhotoName: profile.logoFileName,
            fullName: profile.fullName,
            specialization: profile.specialization,
          }}
        />
      ))}
    </div>
  );
}
