// wz-001 (set 1) or wz2-001, wz3-001 (multi-set)
const WHIZLAB_ID = /^(wz\d*)-(\d{1,3})$/

export const parseWhizlabPageNumber = (id: string): number | undefined => {
  const m = id.match(WHIZLAB_ID)
  return m ? Number(m[2]) : undefined
}

export const parseWhizlabSetId = (id: string): string | undefined => {
  const m = id.match(WHIZLAB_ID)
  return m ? m[1] : undefined
}

export const questionIdFromPage = (page: number, setId = 'wz'): string =>
  `${setId}-${String(page).padStart(3, '0')}`

export const screenshotPathForQuestion = (id: string): string | undefined => {
  const page = parseWhizlabPageNumber(id)
  const setId = parseWhizlabSetId(id)
  if (!page || !setId) return undefined
  // set 1 kept in /questions/ root; others in /questions/{setId}/
  return setId === 'wz'
    ? `/questions/${id}.png`
    : `/questions/${setId}/${id}.png`
}

export const screenshotFileName = (page: number): string =>
  `${questionIdFromPage(page)}.png`
