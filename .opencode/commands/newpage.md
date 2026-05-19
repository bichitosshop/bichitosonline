# newpage — Generate a New Page with SEO & Semantic HTML

Generates a complete new page following BICHITOS SHOP conventions.

## Template structure
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{Page Title} — BICHITOS SHOP</title>
    <meta name="description" content="{150–160 char SEO description}" />
    <link rel="canonical" href="https://bichitosshop.github.io/bichitosonline/{page}.html" />
    <meta property="og:title" content="..." />
    <meta property="og:description" content="..." />
    <link rel="stylesheet" href="css/style.css" />
</head>
<body>
    <header class="header">…</header>
    <main>
        <section class="page-header"><h1>{Page Title}</h1></section>
        <section class="{page}-page">{content}</section>
    </main>
    <footer class="footer">…</footer>
    <!-- Cart panel -->
    <script src="js/script.js"></script>
</body>
</html>
```

## Requirements
- SEO meta tags (title, description, canonical, OG)
- Semantic landmarks: `<header>`, `<main>`, `<footer>`
- Proper heading hierarchy (h1 → h2 → h3)
- Unique body class or page section class for CSS scoping
- Cart panel HTML (consistent with existing pages)
- Responsive CSS class conventions
- Uses design tokens only (no hardcoded colors)
