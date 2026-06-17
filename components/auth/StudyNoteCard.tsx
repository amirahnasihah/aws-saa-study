import type { StudyNote } from './studyNotes'

/** Glassy notification-style card for one study note in the animated list. */
export default function StudyNoteCard({ service, note, icon, color, tint }: StudyNote) {
  return (
    <figure className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-md">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${tint}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <figcaption className={`font-space-mono text-[0.58rem] font-bold uppercase tracking-widest ${color}`}>
          {service}
        </figcaption>
        <p className="mt-0.5 text-[0.78rem] leading-snug text-aws-text/90">{note}</p>
      </div>
    </figure>
  )
}
