-- One-time public website import. Every document starts unapproved for editorial review.
begin;
insert into public.assistant_documents(title,category,source,content,approved)
select s.title,'Leistungen','https://www.loni-galabau.de/leistungen/'||s.slug,
 concat_ws(E'\n\n',s.title,nullif(s.short_text,''),nullif(s.long_text,'')),false
from public.services s
where s.active and not exists(select 1 from public.assistant_documents d
 where d.source='https://www.loni-galabau.de/leistungen/'||s.slug);
insert into public.assistant_documents(title,category,source,content,approved)
select 'Loni GalaBau – Unternehmensgrundlagen','Unternehmen','Freigegebene Website und bestätigte Unternehmensangaben, Stand 01.10.2026',
 'Loni GalaBau GmbH hat ihren Sitz in Hattersheim am Main bei Frankfurt und arbeitet deutschlandweit. Zu den Leistungen gehören Gartengestaltung, Pflasterarbeiten, Natursteinarbeiten, Bewässerungsanlagen, Zaunarbeiten, Rasenanlagen, Erdarbeiten und Entwässerung. Die Angabe „seit 2011 im Garten- und Landschaftsbau tätig“ bezeichnet Branchenerfahrung, nicht das Gründungsjahr der GmbH.',false
where not exists(select 1 from public.assistant_documents where title='Loni GalaBau – Unternehmensgrundlagen');
commit;
