import ClientApp, { type Page as PageType } from "../ClientApp";

export function generateStaticParams() {
  return [];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const path = slug[0];
  const eventId = slug.length > 1 && path === "events" ? slug[1] : undefined;
  
  let initialPage: PageType = "home";
  
  if (path === "events" && eventId) {
      initialPage = "event-details";
  } else if (["events", "team", "schedule", "help", "privacy", "terms", "cookies", "admin", "gallery"].includes(path)) {
      initialPage = path as PageType;
  }

  return <ClientApp initialPage={initialPage} initialEventId={eventId} />;
}
