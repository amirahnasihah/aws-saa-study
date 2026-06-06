# Backlog

Planned work — not shipped yet. Shipped items go in [`data/changelog.ts`](data/changelog.ts).

---

## Ambient background audio

**Status:** Planned  
**Priority:** Nice-to-have (study vibes)

Floating audio widget — user toggles on/off, persists preference in `localStorage`.

### Modes

| Mode | Content |
| --- | --- |
| **Lofi** | Study mood — loop or shuffle royalty-free / licensed tracks |
| **Quran** | Short surahs for calm focus — e.g. Al-Fatihah, Al-Ikhlas, Al-Falaq, An-Nas, Ya-Sin (pick subset) |
| **Off** | Default / silent |

### UI (sketch)

- Floating button near existing FABs (`FloatingSearch` area) — 🎧 / 🔇
- Small panel: mode toggle, surah picker (Quran mode), volume, play/pause
- Optional: auto-mute on `/practice` during quizzes

### Implementation notes

| Piece | Location |
| --- | --- |
| Player + state | `components/AmbientAudio.tsx` (client) |
| Playlist config | `data/ambientAudio.ts` |
| Global mount | `app/layout.tsx` or `Nav.tsx` |
| Audio files | `public/audio/` **or** external CDN URLs |

### Before building

- [ ] Decide audio source: self-hosted MP3s vs external URLs
- [ ] Source lofi tracks (royalty-free / CC / own loops — no unlicensed copyrighted music)
- [ ] Source Quran recitations + credit reciter names
- [ ] Confirm bundle size / deploy impact (Cloudflare Pages static assets)

### Technical reminders

- Browsers block autoplay until user interaction — first play must be explicit click
- `HTMLAudioElement` is enough; no extra dependency required
- Mobile/iOS may pause when tab is backgrounded (PWA caveat)

### Open questions

- Lofi only first, or Quran + lofi together?
- Which reciter / which surahs?
- Shuffle lofi or single loop?
