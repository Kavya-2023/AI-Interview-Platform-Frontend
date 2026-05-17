export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#eef1fb] overflow-hidden">{children}</div>
  );
}
