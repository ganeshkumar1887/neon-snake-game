# NEON SNAKE

A colorful, playful, and responsive casual arcade Snake web game engineered with vanilla web technologies, the HTML5 Canvas API, and procedural Web Audio synthesis.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Game Modes](#game-modes)
- [Mobile Controls](#mobile-controls)
- [Theme Customization](#theme-customization)
- [Settings & Customization](#settings--customization)
- [Player Statistics & Achievements](#player-statistics--achievements)
- [Screenshots](#screenshots)
- [Project Architecture](#project-architecture)
- [Technologies Used](#technologies-used)
- [Getting Started & Local Execution](#getting-started--local-execution)
- [Gameplay & Scoring Rules](#gameplay--scoring-rules)
- [Responsive Design](#responsive-design)
- [Roadmap & Future Improvements](#roadmap--future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## About the Project

**NEON SNAKE** reimagines the classic arcade snake with a vibrant, modern aesthetic inspired by casual mobile hits. Built from the ground up with zero external framework dependencies, the application combines smooth rendering, procedural audio synthesis, responsive touch controls, and robust local state persistence.

The visual design embraces an inviting pastel color palette (lavender, peach, soft yellow, sky blue, mint green, and coral red) with rounded cards, soft drop shadows, and expressive cartoon character rendering.

---

## Key Features

- **Smooth 60 FPS Canvas Game Loop**: Powered by an accumulator loop inside `requestAnimationFrame` ensuring consistent gameplay pacing across devices with high refresh rates (60Hz, 120Hz, 144Hz).
- **Anti-Reversal Input Queue**: Fast keystrokes or quick finger taps are queued sequentially, eliminating accidental 180° self-collisions.
- **Expressive Character Art**: Features a cute snake character with rounded contours, animated blush cheeks, flicking tongue, dual catchlight cartoon eyes, and smooth 3D spherical body segments.
- **Juicy Collectibles**:
  - **Regular Food**: Rendered as a cartoon fruit with fresh leafy accents and a dynamic floor shadow.
  - **Bonus Star**: Spawns periodically with a countdown bar, awarding 50 points when collected before expiration.
- **Zero-Dependency Audio Synthesizer**: Uses the native Web Audio API to procedurally generate chimes, countdown sonar pings, star fanfares, and synth pulses without external audio files.
- **Zero Emojis in Core UI**: All navigation pills, mode tags, settings items, and profile elements use crisp vector SVG icons.

---

## Game Modes

NEON SNAKE features four distinct game modes selectable from the home screen grid:

### 1. Infinity Mode
- **Rules**: Screen borders wrap around seamlessly.
- **Speed**: Scales up gradually as the snake feeds and expands.
- **Objective**: Survive as long as possible; ends only when colliding with your own body.

### 2. Classic Mode
- **Rules**: Traditional boundary walls.
- **Difficulty Options**:
  - **Easy**: 135ms tick rate.
  - **Medium**: 95ms tick rate.
  - **Hard**: 68ms tick rate.
- **Objective**: Pure skill and reflex challenge; crashing into walls or your tail results in game over.

### 3. Time Attack Mode
- **Rules**: A 60-second live countdown timer challenge.
- **Bonus Frenzy**: High-frequency bonus star spawns for rapid score multiplication.
- **Objective**: Maximize your score before the clock reaches zero.

### 4. Obstacle Mode
- **Rules**: Navigate 10 progressive maze layouts constructed with pastel toy barrier blocks.
- **Progress**: Collect 5 food pellets per stage to open the exit portal to the next labyrinth.
- **Objective**: Complete all 10 sector maps without colliding with barriers or perimeter walls.

---

## Mobile Controls

The application offers dedicated mobile control options configurable in the settings modal:

- **Circular D-Pad Buttons**: Ergonomic on-screen directional buttons positioned below the game board with active touch depression and optional haptic vibration (`navigator.vibrate`).
- **Touch Swipes**: Native touch gesture detection allowing intuitive directional swiping directly across the canvas arena.
- **Flexible Layout Modes**: Choose between **D-Pad Only**, **Swipe Only**, or **Both Enabled** simultaneously.
- **Adjustable D-Pad Sizing**: Choose from **Compact**, **Normal**, or **Large** button sizes to suit different screen sizes and thumb ergonomics.

---

## Theme Customization

Players can customize their arena with six colorful world themes:

1. **Pastel World (Default)**: Balanced lavender (`#BFA5FF`), peach (`#FFC99F`), soft yellow, and coral red.
2. **Cotton Candy**: Bubblegum pink and soft lavender with sweet confectionery accents.
3. **Sky Lagoon**: Refreshing sky blue (`#A9E7EC`) paired with crisp ocean mint.
4. **Mint Garden**: Natural mint green (`#A9EDB0`) with sunny golden yellow highlights.
5. **Sunset Sherbet**: Warm apricot, melon, and coral tones.
6. **Retro Arcade**: Playful pastel handheld gaming palette with classic gameboy-inspired contrasts.

---

## Settings & Customization

The settings panel allows full personalization across five categorized tabs:

- **Audio**: Master audio toggle, individual SFX switch, ambient synth BGM toggle, and master volume slider (0% to 100%).
- **Gameplay**: Speed modifier adjustment (0.8x to 1.4x), subtle canvas grid line toggle, and food particle sparks toggle.
- **Mobile**: Haptic feedback switch, D-Pad size selection, and control layout selector.
- **Display**: Fullscreen toggle and high-quality shading options.
- **General**: Clear local high scores and factory settings reset options with confirmation prompts.

---

## Player Statistics & Achievements

### Lifetime Analytics
The game tracks and persists local player statistics in browser storage:
- Total games played
- Total food pellets collected
- Highest overall score
- Total accumulated playtime
- High score breakdown for each individual game mode
- Number of obstacle stages cleared

### Unlockable Badges
Players can unlock eight unique achievement badges:
- **First Food**: Collect your very first food item.
- **Snake Master**: Reach 100 points in any mode.
- **Speed Demon**: Score 150+ points on Hard difficulty.
- **Survivor**: Survive for 5 continuous minutes in a single run.
- **Time Champion**: Score 200+ points in Time Attack mode.
- **Obstacle Explorer**: Clear 10 obstacle sectors.
- **Chameleon**: Apply a custom world theme.
- **Infinity Legend**: Reach 300 points in Infinity Mode.

---

## Screenshots

> *Replace the placeholder links below with actual screenshots of your running instance.*

| Home Screen | Gameplay Arena |
| :---: | :---: |
| ![Home Screen Placeholder](docs/screenshots/home-screen.png) | ![Gameplay Placeholder](docs/screenshots/gameplay.png) |

| Mode Selection | Themes Modal |
| :---: | :---: |
| ![Modes Modal Placeholder](docs/screenshots/modes.png) | ![Themes Modal Placeholder](docs/screenshots/themes.png) |

---

## Project Architecture

```
neon-snake-game/
├── index.html            # Main HTML5 document, HUD, and modal dialogs
├── assets/
│   └── favicon.svg       # Custom SVG vector favicon
├── css/
│   ├── style.css         # Pastel design tokens, card styles, and animations
│   └── responsive.css    # Responsive breakpoints, D-Pad layout, and touch scaling
├── js/
│   ├── storage.js        # LocalStorage persistence for scores, settings, and badges
│   ├── themes.js         # Theme definitions, CSS variables, and canvas color palettes
│   ├── modes.js          # Game mode rules, timers, and barrier parameters
│   ├── obstacles.js      # Obstacle layout maps and collision detection
│   ├── audio.js          # Procedural Web Audio API sound effects and synthesizer
│   ├── food.js           # Food positioning, star bonus timers, and fruit rendering
│   ├── snake.js          # Snake body kinematics, head rotation, and cartoon rendering
│   ├── ui.js             # DOM interface, modal manager, HUD sync, and notifications
│   └── game.js           # Master game loop, state machine, and input coordination
├── .gitignore            # Git exclusions for OS, editor, and build artifacts
├── LICENSE               # MIT open-source license
└── README.md             # Project documentation
```

---

## Technologies Used

- **HTML5**: Semantic markup, accessible modal structures, and high-DPI `<canvas>`.
- **CSS3**: Custom properties (CSS variables), modern CSS Grid, Flexbox, keyframe animations, and `dvh` viewport units.
- **Vanilla JavaScript (ES6+)**: Modular IIFE architecture, Canvas 2D Context rendering, and local state management with zero external dependencies.
- **Web Audio API**: Real-time procedural audio synthesis using `AudioContext`, oscillators, gain nodes, and biquad filters.
- **SVG (Scalable Vector Graphics)**: Crisp resolution-independent iconography.

---

## Getting Started & Local Execution

### Prerequisites
A modern web browser supporting HTML5 Canvas and the Web Audio API (Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari).

### Running Locally

1. **Direct Launch**:
   Open `index.html` directly in your web browser by double-clicking the file or dragging it into a browser window.

2. **Using Python 3**:
   ```bash
   python -m http.server 8000
   ```
   Navigate to `http://localhost:8000` in your browser.

3. **Using Node.js (npx)**:
   ```bash
   npx serve .
   ```

4. **Using VS Code Live Server**:
   Right-click `index.html` inside VS Code and select **Open with Live Server**.

---

## Gameplay & Scoring Rules

### Desktop Keyboard Controls
- <kbd>W</kbd> or <kbd>↑</kbd>: Slither Up
- <kbd>S</kbd> or <kbd>↓</kbd>: Slither Down
- <kbd>A</kbd> or <kbd>←</kbd>: Slither Left
- <kbd>D</kbd> or <kbd>→</kbd>: Slither Right
- <kbd>Space</kbd>: Pause / Resume game
- <kbd>R</kbd>: Quick restart
- <kbd>M</kbd>: Mute / Unmute audio
- <kbd>F</kbd>: Toggle fullscreen

### Mobile Touch Controls
- **D-Pad**: Tap the directional circular buttons below the board.
- **Canvas Swipes**: Swipe in any of the four cardinal directions on the screen.

### Scoring
- **Regular Fruit Pellet**: **+10 Points** and expands snake length by 1 segment.
- **Golden Star Bonus**: **+50 Points** when eaten before the bonus timer expires.
- **Obstacle Sector Clear**: **+100 Points** bonus awarded upon completing 5 pellets in a sector.

---

## Responsive Design

The game layout dynamically adapts across all device formats:
- **Desktops & Laptops (>= 1024px)**: Full viewport utilization with keyboard shortcuts and a centered gaming arena.
- **Tablets (768px - 1023px)**: Scaled arena with touch-friendly navigation.
- **Smartphones (320px - 767px)**: Edge-to-edge 100dvh layout, thumb-friendly D-Pad, zero horizontal scrolling, and disabled bounce/pinch zoom.
- **Mobile Landscape**: Horizontal layout positioning controls alongside the board for comfortable two-hand play.

---

## Roadmap & Future Improvements

### Implemented
- [x] Four playable arcade game modes (Infinity, Classic, Time Attack, Obstacle).
- [x] Six pastel world themes with instant live preview.
- [x] Procedural Web Audio API sound synthesis and ambient BGM.
- [x] Responsive touch D-Pad and swipe gestures.
- [x] Local leaderboard and eight unlockable achievements.
- [x] Editable player profile nickname.

### Planned for Future Releases
- [ ] Online multi-player slither lobbies via WebSockets or WebRTC.
- [ ] Global online leaderboard sync with cloud backend.
- [ ] Additional obstacle map packs and custom map builder.
- [ ] Progressive Web App (PWA) manifest and service worker for full offline play.

---

## Contributing

Contributions, suggestions, and feedback are welcome!

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m "Add NewFeature"`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## License

This project is licensed under the [MIT License](LICENSE).
