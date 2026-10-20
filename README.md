# Personal academic website — Akhil S L

A static site (plain HTML/CSS/JS). It needs no build step, so GitHub Pages serves it as-is.

## Files
- `index.html` — all content (bio, research, publications, talks, background, contact)
- `assets/css/style.css` — styles (light/dark themes)
- `assets/js/main.js` — theme toggle, publication filters, hero animation
- `assets/cv/Akhil_SL_CV.pdf` — CV linked from the site
- `assets/img/profile.jpg` — **add your photo here** (square, at least 480×480). Until you do, an initials placeholder shows.

## Publish on GitHub Pages
1. On GitHub, create a **public** repository named exactly `sl-slakhil.github.io`.
2. Upload everything in this folder, including the hidden `.nojekyll` file, to the repository root.
   - Command line: `git init && git add . && git commit -m "Initial site" && git branch -M main && git remote add origin https://github.com/sl-slakhil/sl-slakhil.github.io.git && git push -u origin main`
3. In the repository, go to **Settings → Pages → Build and deployment**. Set Source to *Deploy from a branch*, Branch to `main` and folder to `/ (root)`.
4. After about a minute the site is live at **https://sl-slakhil.github.io**. Put that URL in your CV header.

## Updating
- **New paper:** in `index.html`, copy one `<li class="pub">` block in the Publications list. Set `data-type` to `journal`, `review` or `conference`. When an under-review paper is accepted, change it to `journal` and add a DOI link.
- **Google Scholar / ORCID / ResearchGate:** remove the comment markers around those links in the hero section and fill in your IDs.
- **CV:** replace `assets/cv/Akhil_SL_CV.pdf`, keeping the same file name.
- **Last updated date:** in the footer.

## Optional: custom domain
Buy a domain (e.g. `akhilsl.com`). Add it under Settings → Pages → Custom domain, then follow GitHub's DNS instructions.
