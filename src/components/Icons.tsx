import { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

const base = (size = 20) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export const IconMail = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
)
export const IconClose = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const IconShare = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 3v12" /><path d="m8 7 4-4 4 4" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /></svg>
)
export const IconTools = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
)
export const IconGrid = IconTools
export const IconList = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" strokeWidth="2.5" /></svg>
)
export const IconFile = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></svg>
)
export const IconExternal = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M14 4h6v6" /><path d="m20 4-9 9" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg>
)
export const IconArrowRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
)
export const IconArrowLeft = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></svg>
)
export const IconArrowUp = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></svg>
)
export const IconArrowDown = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 5v14" /><path d="m18 13-6 6-6-6" /></svg>
)
export const IconChevronRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m9 6 6 6-6 6" /></svg>
)
export const IconChevronLeft = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m15 6-6 6 6 6" /></svg>
)
export const IconChevronDown = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m6 9 6 6 6-6" /></svg>
)
export const IconPlus = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const IconMinus = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 12h14" /></svg>
)
export const IconMenu = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
export const IconFilter = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 6h16M7 12h10M10 18h4" /></svg>
)
export const IconSearch = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
)
export const IconPin = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></svg>
)
export const IconPhone = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
)
export const IconBriefcase = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 12h18" /></svg>
)
export const IconGlobe = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z" /></svg>
)
export const IconWhatsapp = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 20l1.3-3.8A8 8 0 1 1 8.2 19z" /><path d="M9.5 9.5c0 3 2 5 5 5l1-1.5-1.8-.9-.8.8c-1-.3-1.7-1-2-2l.8-.8-.9-1.8z" /></svg>
)
export const IconCheck = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m5 12 4 4L19 6" /></svg>
)
export const IconDownload = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 3v12" /><path d="m8 11 4 4 4-4" /><path d="M5 19h14" /></svg>
)
export const IconTag = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.2" /></svg>
)
export const IconEdit = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17z" /><path d="m13.5 6.5 3 3" /></svg>
)
export const IconTrash = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 7h16" /><path d="M10 11v6M14 11v6" /><path d="M6 7l1 13h10l1-13" /><path d="M9 7V4h6v3" /></svg>
)
export const IconCopy = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>
)
export const IconEye = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="2.5" /></svg>
)
export const IconUpload = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 16V4" /><path d="m8 8 4-4 4 4" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
)
export const IconLogout = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" /><path d="M14 8l4 4-4 4" /><path d="M18 12H9" /></svg>
)
export const IconLanguage = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 5h9M8.5 3v2M6 9c1.5 3 4 5 6.5 6.5" /><path d="M11 9c-1 3-3 5.5-6 7" /><path d="m13 20 3.5-8 3.5 8M14.2 17.5h4.6" /></svg>
)
export const IconLayers = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /></svg>
)
export const IconStar = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m12 3 2.8 5.9 6.2.8-4.5 4.4 1.1 6.4L12 17.5 6.4 20.5l1.1-6.4L3 9.7l6.2-.8z" /></svg>
)
export const IconUser = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
)
export const IconHome = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m3 11 9-7 9 7" /><path d="M5 10v10h14V10" /></svg>
)
