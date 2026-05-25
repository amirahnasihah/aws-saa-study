const WHIZLAB_ID = /^wz-(\d{1,3})$/

export const parseWhizlabPageNumber = (id: string): number | undefined => {
  const match = WHIZLAB_ID.exec(id)
  return match ? Number(match[1]) : undefined
}

export const questionIdFromPage = (page: number): string =>
  `wz-${String(page).padStart(3, '0')}`

export const screenshotPathForQuestion = (id: string): string | undefined => {
  const page = parseWhizlabPageNumber(id)
  return page ? `/questions/${id}.png` : undefined
}

export const screenshotFileName = (page: number): string =>
  `${questionIdFromPage(page)}.png`
