# CS412 Dark System – Performance Innovative Task

Interactive Fortnite-inspired shop prototype that contrasts dark pattern purchasing flows with an ethical, user-protective experience. The project was built for our CS412 Performance Innovative Task to demonstrate how UI decisions influence player spending behavior.

## 🌀 Experience Overview
- **Dark Pattern Mode** – Instant-purchase flow that skips confirmation, flashes congratulatory messaging, and encourages impulse buys.
- **Ethical Mode** – Adds friction via a confirmation modal, hold-to-confirm mechanic, and clear balance impact before completing a purchase.
- **Responsive Item Grid** – Featured and Daily rotations, rarity styling, and quick-purchase badges for each cosmetic.
- **Rich Feedback** – Celebration modal for dark mode, secure modal for ethical mode, and toast notifications for errors or confirmations.
- **Local Asset Bundle** – Uses bundled `.webp` renders under `src/images/` for reliable offline demos.

## 📁 Key Files
```
CS412_Dark_System_Final_Req/
├─ fortnite_poc_unfinished.html   # Original single-file proof of concept (kept untouched)
├─ fortnite_poc.html              # Clean entry point wired to external CSS/JS
├─ css/
│  └─ fortnite.css                # All custom styling
├─ js/
│  └─ fortnite.js                 # Shop data + interaction logic
└─ src/images/                    # Item renders + V-Bucks icon
```

## 🚀 Running the Demo Locally
1. Clone or download this folder.
2. Open `fortnite_poc.html` directly in your browser (no build tools required).
3. Toggle between **Dark Pattern** and **Ethical** using the switch in the top bar, then click any price badge to experience the two flows.

## 🌐 Accessible via to GitHub Pages
Clink the [link](https://ustp-4th-year.github.io/CS412_Dark_System_Final_Req/fortnite_poc.html) to access the demo.
