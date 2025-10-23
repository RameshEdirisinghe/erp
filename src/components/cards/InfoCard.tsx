interface InfoCardProps {
  title: string;
  content: string;
}

export default function InfoCard({ title, content }: InfoCardProps) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p>{content}</p>
    </div>
  );
}