Nishant Singh — Portfolio

Overview

This is a static portfolio website built with plain HTML, CSS, and JavaScript. The project features:

- Responsive layout (desktop, tablet, mobile)
- Light / dark theme toggle (persistent via localStorage)
- Off-canvas mobile navigation with keyboard support
- Typed roles animation, particle background (optional), and AOS scroll animations
- Project filters, animated stats, contact form (mailto fallback)

How to run

Open `index.html` in any modern browser. On Windows you can double-click the file or run:

```powershell
# from the project folder
start .\index.html
```

Notes & next steps

- I unified the name and contact links to the `Nishant Singh` identity that matches the social links and email present in the site.
- The particles background is guarded — if the CDN fails, the page will still work.

Possible improvements:

- Replace mailto contact with serverless form (Netlify Forms / Formspree) for better UX
- Add image assets and project pages for deeper case studies
- Add Lighthouse-based performance and accessibility optimizations

Files changed

- `index.html` — accessibility, skip link, ARIA attributes, unified content
- `style.css` — responsive tweaks and focus styles
- `Script.js` — robust JS, keyboard support, aria updates

If you'd like, I can also:

- Add a small icon set and `favicon.ico` properly generated
- Add a deployment guide (GitHub Pages or Netlify)
- Run a quick accessibility/audit checklist and fix any issues

Tell me what you'd like next and I'll continue.