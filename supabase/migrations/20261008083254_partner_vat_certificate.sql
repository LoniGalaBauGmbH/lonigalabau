alter table public.partner_applications
  add column vat_certificate_path text unique,
  add column vat_certificate_name text,
  add column vat_certificate_valid_until date,
  add constraint partner_vat_certificate_complete check (
    (vat_certificate_path is null and vat_certificate_name is null and vat_certificate_valid_until is null)
    or (vat_certificate_path is not null and vat_certificate_name is not null and vat_certificate_valid_until is not null
      and vat_certificate_path ~ '\.pdf$' and lower(vat_certificate_name) like '%.pdf')
  );
comment on column public.partner_applications.vat_certificate_path is 'Private USt 1 TG PDF; nullable only for legacy records. New public applications require both proofs.';
