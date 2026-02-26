export const slugify = (text: string) => text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
export const uniqueSlug = (title: string, existing: string[]) => {
  const base = slugify(title)
  let slug = base
  let idx = 1
  while (existing.includes(slug)) { slug = `${base}-${idx++}` }
  return slug
}
