/** Practice "Jump to question" picker — FloatingBar listens and hides on mobile while open. */
export const PRACTICE_QUESTION_PICKER_EVENT = 'practice-question-picker'

export function setPracticeQuestionPickerOpen(open: boolean): void {
  window.dispatchEvent(
    new CustomEvent(PRACTICE_QUESTION_PICKER_EVENT, { detail: { open } }),
  )
}
