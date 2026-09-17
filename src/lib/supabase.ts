import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, anon)

export type Project = {
  id: string
  title: string
  slug: string
  summary: string | null
  content: string | null
  category: 'data' | 'finance' | 'risk'
  tags: string[]
  cover_url: string | null
  attachments: { name: string; url: string }[]
  published: boolean
  featured: boolean
  created_at: string
  updated_at: string
}
