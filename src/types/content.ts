export const CONTENT_SCHEMA_VERSION = 1

export const ARTICLE_STATUSES = ['draft', 'in_review', 'revision_required', 'approved', 'published', 'archived'] as const
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number]
export type SourceType = 'guideline' | 'journal' | 'systematic_review' | 'government' | 'organization' | 'textbook'

export interface MedicalReference { id: string; title: string; authors?: string; journal?: string; year?: number; doi?: string; url?: string; sourceType: SourceType }
export interface RevisionEntry { version: number; date: string; summary: string; editor?: string }
export interface ArticleSEO { title?: string; description?: string; canonicalSlug: string; medicalWebPage?: boolean }
export interface ContentCategory { id: string; slug: string; title: string; description: string; icon: string; articleCount: number }
export interface ContentPerson { id: string; name: string; role: string; credentials?: string }

interface BlockBase { id: string }
export interface ParagraphBlock extends BlockBase { type: 'paragraph'; text: string }
export interface HeadingBlock extends BlockBase { type: 'heading'; level: 2 | 3; text: string }
export interface ListBlock extends BlockBase { type: 'bullet_list' | 'numbered_list'; items: string[] }
export interface QuoteBlock extends BlockBase { type: 'quote'; text: string; attribution?: string }
export interface CalloutBlock extends BlockBase { type: 'callout'; title?: string; text: string }
export interface WarningBlock extends BlockBase { type: 'medical_warning'; text: string }
export interface KeyTakeawayBlock extends BlockBase { type: 'key_takeaway'; items: string[] }
export interface ImageBlock extends BlockBase { type: 'image'; src: string; alt: string; caption?: string }
export interface TableBlock extends BlockBase { type: 'table'; caption: string; headers: string[]; rows: string[][] }
export interface FAQBlock extends BlockBase { type: 'faq'; items: { question: string; answer: string }[] }
export interface ReferencesBlock extends BlockBase { type: 'references' }
export interface DisclaimerBlock extends BlockBase { type: 'disclaimer'; text?: string }
export interface EvidenceNoteBlock extends BlockBase { type: 'evidence_note'; text: string }
export type ArticleBlock = ParagraphBlock | HeadingBlock | ListBlock | QuoteBlock | CalloutBlock | WarningBlock | KeyTakeawayBlock | ImageBlock | TableBlock | FAQBlock | ReferencesBlock | DisclaimerBlock | EvidenceNoteBlock

export interface MedicalArticle {
  id: string; slug: string; title: string; subtitle?: string; excerpt: string; body: ArticleBlock[]
  categoryId: string; tags: string[]; keywords?: string[]; glossaryTerms?: string[]; authorId?: string
  medicalReviewerId?: string; status: ArticleStatus; featured: boolean; readingTime?: number
  createdAt: string; updatedAt: string; publishedAt?: string; lastReviewedAt?: string; nextReviewAt?: string
  references: MedicalReference[]; revisionHistory: RevisionEntry[]; seo: ArticleSEO
  relatedArticleIds: string[]; relatedJourneyStage?: string; editorialNotes?: string; archivedReplacementSlug?: string
}

export interface ValidationIssue { code: string; message: string; severity: 'error' | 'warning' }
export interface ValidationResult { errors: ValidationIssue[]; warnings: ValidationIssue[] }
