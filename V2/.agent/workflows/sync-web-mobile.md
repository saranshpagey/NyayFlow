---
description: optimize web features for a perfect mobile-first browser experience
---

This agent ensures that the 100% web-oriented app feels and functions perfectly on mobile devices.

### Steps:

1. **Responsive Audit**: Analyze the target web page (`/pages/` or `/components/`) at mobile breakpoints (375px, 414px).
2. **Touch Optimization**:
    - Ensure interactive elements have a minimum 44x44px hit target.
    - Check for hover states that might break on touch (replace with active/focus).
    - Implement touch-native patterns (drawers/bottom sheets instead of large modals).
3. **PWA Enhancement**: Ensure the page supports manifest features (icons, theme colors) and safe-area insets.
4. **Layout Check**: 
    - Verify that no content overflows horizontally.
    - Check that the font sizes are readable without zooming (min 16px for inputs).
5. **Implementation**: Modify the `.tsx` file using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) to fix mobile issues.

### Prompts for Antigravity:
"Optimize the Research page for mobile browsers. Ensure the chat input is sticky at the bottom with proper safe-area padding and the sidebar collapses into a hamburger menu."
