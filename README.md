# Pink Calculator

A browser calculator with a pink, early-2000s-inspired look. It includes a scientific keypad, a currency converter and a unit converter. The site is static, so there is no package install or build step.

## What it can do

- Handle arithmetic, brackets, powers, roots and factorials.
- Calculate trigonometric functions in degrees or radians, plus inverse trig and logarithms.
- Keep recent calculations in the browser.
- Convert between the currencies listed in the Currency tab.
- Convert length, mass, temperature, area, volume, speed, time, digital storage, pressure, energy and power.
- Remember the colour theme and the last saved currency rate on this device.

In the calculator, press **Enter** to calculate, **Backspace** to remove the last character and **Escape** to clear the display.

## Run locally

Clone or download the repository and open `index.html` in a browser. If you're working in VS Code, the Live Server extension is a handy way to preview changes.

There are no dependencies to install.

## Deploy with Cloudflare Pages

Connect this GitHub repository to Cloudflare Pages and use these settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | Leave blank |
| Build output directory | `/` |

Once the first deployment is complete, new commits to `main` will trigger another deployment.

## Exchange rates

The currency tab gets rates from [Frankfurter](https://www.frankfurter.dev/). These are published reference rates, not live trading prices. Your bank, card provider or transfer service may use a different rate and charge fees. If the rate service is unavailable, the app can show a previously saved rate and labels it as an offline fallback.

## Project layout

- `index.html` — page structure and calculator layout
- `css/` — main and responsive styles
- `js/calculator.js` — expression parsing and calculation
- `js/currency.js` — exchange-rate lookup and conversion
- `js/units.js` — unit conversion values and logic
- `js/history.js` and `js/storage.js` — calculation history and local preferences
- `assets/` — browser icon

Calculations and unit conversions happen in the browser. History, theme preference and the cached exchange rate are stored in local storage on the device.

---

Made for the browser, with a little pink.
