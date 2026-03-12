---
alwaysApply: true
---
# Cursor Rules for React + Next.js + MUI Projects

## chat rules
1. using simplified chinese

## General Guidelines
1. Always follow **industry best practices** for React and Next.js development.
2. Generate clean, maintainable, and well-structured code.
3. Use **ESLint** and **Prettier**-friendly syntax.
4. Keep imports organized and minimal. Remove unused imports automatically.

## General Philosophy
- The AI should **strictly follow user instructions** but may **autonomously apply best practices** when necessary for:
  - Code correctness or runtime stability
  - Maintainability and readability
  - Minimal, practical UI improvements (e.g., spacing, alignment)
- Do **not** add new features, logic, or UI elements unless they are clearly part of best practices or required for the code to function properly.
---

## Technology Stack
1. Use **React (with Hooks)** and **Next.js (App Router)** conventions.
2. UI components should primarily use **Material UI (MUI)**.
3. Do **not** introduce other UI frameworks or CSS libraries unless explicitly requested by the user.
4. Use **TypeScript** when possible unless the user specifies JavaScript.



---

## Styling Rules
1. Follow **modern, minimal, and accessible** design principles.
2. When the user does not specify a detailed design, use **simple, modern, and neutral styling**.
3. Avoid over-styled or overly decorative designs unless requested.
4. Use **mainGroceryColor = "#f59e0b";** at path C:\Users\***REMOVED***\Documents\gitlab\jobi-web\src\app\grocery\components\styled.ts. and other color design fit this color. unless the user explicitly asks for theme customization.
5. Use responsive design best practices by default.


---

## Code Behavior
1. Implement only what the user requests. Only implement **features explicitly requested by the user**.  
   Do **not** add features, components, or logic beyond what the user asks for. un less it is industy practices needed. 
2. Avoid speculative “improvements” or “creative additions” unless the user approves them. un less it is industy practices needed
3. Provide inline comments when you make design or logic choices that could use clarification.
4. Any additional logic should be small, essential, and easy to remove.
5. You may extend functionality slightly **if required for the requested feature to function properly** or align with industry best practices.
   - Example: Adding basic input validation or component reusability improvements is acceptable.

---

## File and Component Structure
1. Follow standard Next.js folder conventions:
   - `/app` for pages and layouts
   - `/components` for reusable UI components
   - `/styles` for global styles (if needed)
2. Use **functional components** with clear prop types.
3. Prefer small, focused components over large monolithic ones.
4. Use named exports unless default exports are necessary.


---

## MUI-Specific Rules
1. Use MUI components whenever possible (e.g., `Button`, `Card`, `Typography`, `Box`).
2. Use `sx` prop or `styled()` API for styling rather than raw CSS.
3. When replacing deprecated MUI props, follow the latest MUI documentation.
4. Keep theme and typography consistent with MUI best practices.


---

## Documentation & Comments
1. Include concise JSDoc or comment headers for non-trivial functions and components.
2. Explain any design or implementation decisions that might not be obvious.
3. Use clear, human-readable names for variables and components.


---

## Collaboration & Output Rules
1. When unsure about user intent, ask for clarification before proceeding.
2. Do not output unnecessary explanations or files unless requested.
3. Output complete, runnable code whenever possible.
4. Ensure generated code runs correctly in a **standard Next.js + MUI setup**.


---

## Example Rule Summary (TL;DR)
- ✅ Use: React + Next.js + MUI  
- ⚙️ Follow: Best practices, clean structure  
- 🎨 Style: Simple, modern, accessible  
- 🚫 Avoid: Extra features or fancy design  
- 💬 Add: Minimal helpful comments only  
