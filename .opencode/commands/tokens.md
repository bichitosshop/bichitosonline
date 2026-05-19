# tokens — Find Hardcoded Values & Convert to Design Variables

Scans CSS and JS for hardcoded values that should use design tokens.

## What it detects

### CSS
- Hex/rgb/hsl color values NOT referencing `var(--...)`:
  - Colors outside `:root` block
  - `background`, `color`, `border-color`, `box-shadow` with raw values
- Hardcoded `border-radius` that doesn't match any `--radius-*` variable
- Hardcoded `box-shadow` that could be `var(--shadow)`
- Hardcoded `font-family` (should be system stack)
- Spacing values > 4px that could be rem-based

### JavaScript
- Hardcoded CSS values in template literals (`.toLocaleString`, inline styles)
- Hardcoded URLs (WhatsApp number, Google Sheets, etc.)
- Magic numbers (300 debounce, 1.35 margin, etc.)

## Output
For each finding: file:line — current value → suggested token/variable
