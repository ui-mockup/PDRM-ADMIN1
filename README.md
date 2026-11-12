# PDRM Joomla Administrator — HTML Design

A static HTML/CSS/JS design for a Joomla administrator panel, styled to match the PDRM portal (navy `#0b2744`, gold `#c9a227`, Montserrat and Poppins fonts).

It is a design preview only. Nothing is saved, and the login check runs in the browser, so it is not real security.

## Pages

| File | Page |
| --- | --- |
| `login.html` | Administrator login. Demo login is `admin` / `1234`, filled in and submitted automatically after 3 seconds (not after Log out). |
| `index.html` | Home Dashboard in the Joomla 5 layout (Quick Overview, System, Notifications, Latest Actions, Logged-in Users, Popular and Recently Added Articles) |
| `articles.html` | Articles list with filters, bulk actions and pagination |
| `article-edit.html` | Article editor with tabs (Content, Images, Options, Publishing, Permissions) |
| `categories.html` | Category tree |
| `menus.html` | Menus and menu items |
| `users.html` | User manager |
| `media.html` | Media manager (folders, upload area, file grid) |
| `extensions.html` | Extensions manager |
| `global-config.html` | Global Configuration (Site, System, Server, Logging, Permissions) |

## Structure

```
assets/css/admin.css   all styles (colour tokens at the top in :root)
assets/js/admin.js     builds the sidebar, top bar and footer, plus tabs, check-all, filters and toasts
assets/img/media/      sample images used on the Media page
```

Each page only contains its own content. The sidebar and top bar are added by `admin.js` from the `data-page`, `data-title` and `data-icon` attributes on `<body>`. To add a menu link, edit the `NAV` list at the top of `admin.js`.

There is no build step. Icons come from [Iconify](https://iconify.design/) (Lucide set) and fonts come from Google Fonts, both via CDN. The PDRM logo is loaded from the same URL the main PDRM site uses, and a "PD" badge is shown if it can't load.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Publish on GitHub Pages

1. Create a GitHub repository and push this folder to it.
2. In the repository, open **Settings → Pages**, set the source to **Deploy from a branch**, then choose `main` and `/ (root)`.
3. The site will be published at `https://<username>.github.io/<repo>/`.

All paths are relative, so the site works from a sub-folder URL.
