import WorkCard from "../../workPage/components/WorkCard";

export default function ProfileWorks() {
  // Моковые данные, можно заменить на реальные
  return (
    <div style={{ display: "flex", gap: 32 }}>
      <WorkCard />
      <WorkCard />
      <WorkCard />
    </div>
  );
}
