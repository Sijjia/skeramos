# Sprint Change Proposal — Skeramos v2

**Date:** 2026-01-29
**Trigger:** Client meeting feedback
**Scope:** MAJOR
**Backup:** `git tag backup-before-v2-20260129`

---

## Decisions

| Question | Decision |
|----------|----------|
| S-thread animation | Developer discretion |
| Icons | Lucide library |
| Background textures | Select ourselves |
| Priority | Phase 1 → 2 → 3 → 4 |

---

## Phase 1: Colors, Fonts, Texts

### 1.1 Font
- [x] Replace all fonts with Montserrat (Cyrillic support)
- [x] Ensure font works across RU/KG/EN languages

### 1.2 Colors
- [x] Swap MK ↔ Hotel colors
- [x] New MK color: `#A93B24` (terracotta)
- [x] New Hotel color: `#216B5E` (emerald)

### 1.3 Light Theme
- [x] Lighten site background (EXCEPT split-screen and zone switcher)
- [x] MK background: saman texture (milky)
- [x] Hotel background: linen/bedsheet texture

### 1.4 Text Changes
| Location | Old | New | Status |
|----------|-----|-----|--------|
| Split screen left | Творчество | Творческая Арт-студия | ✅ |
| Split screen right | Отель | Бутик-отель | ✅ |
| Split screen - remove emojis | Yes | | ✅ |
| MK subtitle | Гончарная мастерская | Творческая мастерская | ✅ |
| Hotel subtitle | Уютный мини-отель | Проживание в Бутик-отеле | ✅ |
| MK slogan | (добавлен) | Лепим счастье своими руками | ✅ |
| Hotel slogan | (добавлен) | Уют и творчество в каждом мгновении | ✅ |
| Hotel hero | Мини-отель в центре Бишкека | Бутик-отель в сердце Кыргызстана | ✅ |
| Hotel section | Особенности отеля | Преимущества отеля | ⏳ |

---

## Phase 2: Page Structure & Blocks

### 2.1 New Pages
- [ ] Mission & Goals page (beautifully styled)
- [ ] Additional Services page (admin editable)
- [ ] Company History page (slider with year/month/description)
- [ ] Afisha/Events page (info only, no booking)

### 2.2 Remove Pages
- [ ] Cinema page (move to Advantages or MK Services)

### 2.3 New Blocks
- [ ] "What you get" block for MK (~8 points with icons)
- [ ] "Security" block for MK (safes, cameras, guards, keys)

### 2.4 Update Existing Blocks
- [ ] MK Advantages: 6 points + Lucide ceramic/vase icons
- [ ] Hotel Advantages: 6 points + Lucide bed/hotel icons

### 2.5 Navigation Structure
**MK Header:**
Главная → О нас → Услуги → Мастера → Афиша → Галерея → Контакты

**Main Page Sections:**
Hero → О нас → Услуги → Преимущества → Галерея → Мастера → Отзывы → FAQ → Футер

**About Page:**
О нас info + Преимущества

---

## Phase 3: Admin Panel Extension

### 3.1 Services
- [ ] Add link field for "Подробнее" button (if empty, hide button)
- [ ] Add tags as column list (editable per service)

### 3.2 Footer
- [ ] Social links: Facebook, Yandex Maps, 2GIS, YouTube, VK (hide if empty)
- [ ] Phone number editable
- [ ] Add 2GIS mini map

### 3.3 Gallery
- [ ] Full admin control: categories + photos

### 3.4 History
- [ ] Admin entries: photo, year, month, description

### 3.5 Masters
- [ ] Full card with achievements
- [ ] WhatsApp manager link (admin editable)

### 3.6 Advantages
- [ ] MK advantages editable (6 items + icons)
- [ ] Hotel advantages editable (6 items + icons)

### 3.7 Reviews
- [ ] Add source link field

### 3.8 Afisha
- [ ] Create/edit events in admin

---

## Phase 4: Complex Animations

### 4.1 S-Thread Animation
- [ ] Letter S as thread connecting descriptions on hover
- [ ] Unravels and weaves between sections

### 4.2 Parallax Hero
- [ ] Dynamic image change on scroll
- [ ] 2 photos transition animation

---

## Deferred (Post-Visual)

- [ ] Exely integration for Hotel rooms
- [ ] Altegio integration for MK bookings
- [ ] Text updates (ongoing as provided)

---

## Status

| Phase | Status |
|-------|--------|
| Phase 1 | 🔄 In Progress |
| Phase 2 | ⏳ Pending |
| Phase 3 | ⏳ Pending |
| Phase 4 | ⏳ Pending |
