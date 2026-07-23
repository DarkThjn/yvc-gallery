import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventForm from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) notFound();

  return (
    <div>
      <h1 className="text-2xl mb-8">Sửa sự kiện</h1>
      <EventForm event={event} />
    </div>
  );
}
