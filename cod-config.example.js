/**
 * Local development: copy to cod-config.js and paste your COD Network seller API token.
 * Do not commit cod-config.js (see .gitignore).
 *
 * GitHub Pages: add repository secret COD_NETWORK_TOKEN with your JWT.
 * The deploy-pages workflow generates cod-config.js during CI (see .github/workflows/deploy-pages.yml).
 * In repo Settings → Pages, set "Build and deployment" source to GitHub Actions.
 */
window.COD_CONFIG = {
    token: 'PASTE_YOUR_JWT_HERE',
    debug: true
};
