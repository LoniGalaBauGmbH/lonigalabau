import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ProjectInquiryForm } from "@/components/site/ProjectInquiryForm";
import { FAQ } from "@/components/site/FAQ";
import { getProjectsByService, getRelatedServices, getServiceBySlug } from "@/lib/site.functions";
import { getServiceImage } from "@/lib/service-images";
import { absoluteUrl } from "@/lib/company";
import { useSiteImages } from "@/hooks/useSiteImages";

const slugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    queryFn: () => getServiceBySlug({ data: { slug } }),
  });
const projectQuery = (serviceId: string) =>
  queryOptions({
    queryKey: ["projects-by-service", serviceId],
    queryFn: () => getProjectsByService({ data: { serviceId } }),
  });
const relatedQuery = (excludeSlug: string) =>
  queryOptions({
    queryKey: ["related-services", excludeSlug],
    queryFn: () => getRelatedServices({ data: { excludeSlug } }),
  });

export const Route = createFileRoute("/leistungen/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(slugQuery(params.slug));
    if (!data) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(projectQuery(data.id)),
      context.queryClient.ensureQueryData(relatedQuery(params.slug)),
    ]);
    return data;
  },
  head: ({ loaderData: data, params }) => {
    const title = data?.meta_title?.trim() || `${data?.title ?? params.slug} | Loni GalaBau GmbH`;
    const description =
      data?.meta_description?.trim() ||
      data?.short_text?.slice(0, 160) ||
      "Arbeiten an Garten und Außenanlage.";
    const image = absoluteUrl(getServiceImage(params.slug, data?.hero_image));
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { name: "twitter:image", content: image },
      ],
    };
  },
  component: Page,
  notFoundComponent: () => (
    <PageShell>
      <section className="site-width section-space">
        <h1 className="home-heading">Leistung nicht gefunden</h1>
        <Link to="/leistungen" className="text-link mt-8">
          Zur Leistungsübersicht
        </Link>
      </section>
    </PageShell>
  ),
});
function Page() {
  const service = Route.useLoaderData();
  const { customImages } = useSiteImages();
  const { data: projects } = useSuspenseQuery(projectQuery(service.id));
  const { data: related } = useSuspenseQuery(relatedQuery(service.slug));
  const image =
    service.hero_image || customImages.service_detail_bg || getServiceImage(service.slug);
  return (
    <PageShell>
      <section className="site-width pt-8 pb-16">
        <nav aria-label="Brotkrümelnavigation" className="text-sm text-foreground/65">
          <Link to="/leistungen" className="underline">
            Leistungen
          </Link>
          <span className="mx-3">/</span>
          {service.title}
        </nav>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center mt-10">
          <div>
            <h1 className="home-heading">{service.title}</h1>
            <p className="mt-6 text-lg leading-relaxed">{service.short_text}</p>
            <a href="#anfrage" className="primary-link mt-8">
              Vorhaben anfragen <ArrowUpRight size={18} />
            </a>
          </div>
          <img
            src={image}
            alt={service.title}
            width={768}
            height={576}
            fetchPriority="high"
            className="w-full aspect-[4/3] object-cover"
          />
        </div>
      </section>
      {service.long_text && (
        <section className="site-width pb-16">
          <div className="max-w-3xl whitespace-pre-line leading-relaxed text-foreground/80">
            {service.long_text}
          </div>
        </section>
      )}
      {service.custom_benefits?.length > 0 && (
        <section className="site-width pb-16 grid md:grid-cols-3 gap-8">
          {service.custom_benefits.map((item, index) => (
            <div key={index} className="border-t border-brand/20 pt-5">
              <h2 className="font-semibold text-xl">{item.t}</h2>
              <p className="leading-relaxed mt-3">{item.d}</p>
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section className="site-width pb-16">
          <h2 className="home-heading mb-8">Passende Projekte</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {projects.map((project) => (
              <article key={project.id}>
                {project.images?.[0] && (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    loading="lazy"
                    className="aspect-[4/3] object-cover w-full mb-5"
                  />
                )}
                <p className="text-sm text-foreground/60">{project.location}</p>
                <h3 className="text-2xl mt-2">{project.title}</h3>
                <p className="mt-3 leading-relaxed">{project.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}
      {service.custom_faqs?.length > 0 ? (
        <section className="site-width pb-16">
          <h2 className="home-heading mb-8">Häufige Fragen</h2>
          {service.custom_faqs.map((item, index) => (
            <details key={index} className="py-5 border-b border-brand/20">
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <p className="mt-4 max-w-3xl leading-relaxed">{item.a}</p>
            </details>
          ))}
        </section>
      ) : (
        <FAQ />
      )}
      <section id="anfrage" className="site-width section-space scroll-mt-24">
        <ProjectInquiryForm />
      </section>
      <section className="site-width pb-20">
        <h2 className="text-2xl mb-6">Weitere Leistungen</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
          {related.map((item) => (
            <Link
              key={item.id}
              to="/leistungen/$slug"
              params={{ slug: item.slug }}
              className="flex justify-between py-5 border-t border-brand/20 gap-4"
            >
              {item.title}
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
