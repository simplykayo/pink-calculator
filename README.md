# Pink Calculator ✿

A glossy Y2K-inspired calculator with scientific functions, currency exchange and unit conversion. Built with plain HTML, CSS and JavaScript—no build step or framework required.

## Features

- **Scientific calculator:** arithmetic, parentheses, powers, roots, factorials, trigonometry, inverse trigonometry, logarithms, constants, percent/modulo, DEG/RAD mode, answer memory and MC/MR/M+/M−/MS.
- **Keyboard support:** type expressions, press Enter to calculate, Backspace to delete and Escape to clear.
- **Calculation history:** recent results are stored locally in your browser.
- **Currency converter:** a broad currency list with reference rates from the Frankfurter API. Rates are fetched when the Currency tab is opened and can be refreshed.
- **Unit converter:** length, mass, temperature, area, volume, speed, time, digital storage, pressure, energy and power.
- **Preferences:** dark mode and history are saved locally.
- **Responsive design:** desktop, tablet and mobile layouts.

## Run locally

Open `index.html` in a browser, or use the VS Code Live Server extension. No installation or build command is needed.

## Deploy to Cloudflare Pages

1. Open **Cloudflare Dashboard → Workers & Pages**.
2. Choose **Create application → Pages → Connect to Git**.
3. Select this GitHub repository.
4. Set the production branch to `main`.
5. Choose **None** as the framework preset.
6. Leave the build command empty.
7. Set the build output directory to `/`.
8. Save and deploy.

Every push to `main` will trigger a new deployment.

## Currency data

Currency rates are supplied by [Frankfurter](https://www.frankfurter.dev/), an API for reference exchange rates. These are informational published rates and may not match bank, card, or money-transfer prices. A previously fetched rate may be used as an explicitly labelled offline fallback.

## Notes

- Calculator expressions are parsed locally; they are not sent to a server.
- Unit conversions run locally in the browser.
- History, theme preference and cached reference rates are stored in local browser storage.
- Google Fonts are loaded from Google Fonts when internet access is available; the interface falls back to system fonts otherwise.

Made with ♥ and a little math.