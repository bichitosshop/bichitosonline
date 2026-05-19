# audit — Accessibility, Performance & Visual Consistency Check

Run this after any UI change. Analyzes the full project.

## Checks performed
1. **Accessibility**: landmark elements, heading hierarchy, `alt` text, `aria-label`, contrast ratios, focus styles, `prefers-reduced-motion`
2. **Performance**: inline styles, render-blocking resources, image dimensions, long tasks
3. **Visual consistency**: hardcoded colors (vs CSS vars), hardcoded radii, spacing outliers, unused CSS rules
4. **Responsive**: verify layout at 375px, 768px, 1200px

## Output
- List of violations grouped by severity (critical/major/minor)
- For each: file path, line number, description, and fix suggestion
- Summary score: pass / needs work / fail
