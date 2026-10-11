-- Let the magazines bucket accept cover images as well as PDFs.
-- Admin > Magazines stores covers in the same bucket (covers/ folder), but the bucket
-- was set up in the dashboard to accept fewer file types, so cover uploads failed with
-- "mime type image/jpeg is not supported".

update storage.buckets
set allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
where id = 'magazines';
