---
description: generate premium, accessible (WCAG AA) components with Framer Motion and Tailwind
---

This agent is responsible for creating state-of-the-art UI components that provide a "WOW" factor while maintaining strict accessibility standards.

### Steps:

1. **Analysis**: Analyze the user's request for a new component or a refactor.
2. **Design tokens**: Ensure the component uses the project's premium color palette (Indigo/Zinc/Emerald) and typography (Inter/Lora).
3. **Drafting**: Create the component in `components/ui/[ComponentName].tsx`.
4. **Visual Excellence**:
    - Use `framer-motion` for subtle entrances and hover animations.
    - Implement "glassmorphism" using `backdrop-filter: blur()`.
    - Use `lucide-react` for consistent, crisp iconography.
5. **Accessibility (Critical)**:
    - Add `aria-label` to all interactive elements.
    - Ensure keyboard navigability (tabIndex, onKeyDown).
    - Maintain 4.5:1 contrast ratio.
6. **Usage**: Import and demonstrate the component in the requested page or `/pages/LandingPage.tsx`.

### Prompts for Antigravity:
"Build a premium [component name] that feels fluid and expensive. Use glassmorphism, subtle indigo gradients, and Framer Motion for entrance animations. Ensure it is fully keyboard accessible."
