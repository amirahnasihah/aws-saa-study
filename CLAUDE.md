# Project guidelines

When working in this repository, follow these standards:

## TypeScript

- Use `unknown` instead of `any` for type safety
- Prefer type-driven design—let types guide the implementation
- Avoid `switch` statements; use pattern matching or object maps instead

## Control flow

- Minimize `for` loops; prefer `map`, `filter`, `reduce`, `forEach`, or recursion where appropriate

## General

- Follow existing code patterns in the codebase
- Keep changes minimal and focused
- Ensure no sensitive information, typos, or debugging code in commits

## Mobile inputs

- Any `<input>`/`<textarea>` must render at ≥16px on mobile — iOS Safari auto-zooms the viewport on focus when the computed font-size is below that. Use the `text-base sm:text-[<desktop-size>]` pattern (e.g. `text-base sm:text-[0.8rem]`) so the field is 16px on small screens and keeps the smaller mono aesthetic from `sm:`/`md:` up.
