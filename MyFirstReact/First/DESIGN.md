# Calculator Application Design Document

## 1. Purpose of this Document

This document is intended to help new developers understand the architecture, data flow, core components, assumptions, dependencies, and extension points of the React scientific calculator application.

It is meant to be a single source of truth for:
- why the application exists
- how the application is organized
- how data moves through the app
- which components are critical and why
- what assumptions and constraints are in place
- what external dependencies the application relies on

---

## 2. Architecture Diagram

The application is small and single-page, so its architecture is intentionally simple.

```
  +-----------------------------+
  | Browser / User              |
  |  - clicks buttons           |
  |  - presses keyboard keys    |
  +-------------+---------------+
                |
                v
  +-------------+---------------+
  | React UI Layer               |
  |  - App.tsx                   |
  |  - Render display            |
  |  - Render buttons            |
  +-------------+---------------+
                |
                v
  +-------------+---------------+
  | App State / Logic            |
  |  - display state             |
  |  - input handling            |
  |  - keyboard handling         |
  |  - button click handling     |
  +-------------+---------------+
                |
                v
  +-------------+---------------+
  | Expression Evaluation        |
  |  - parse display text        |
  |  - map symbols to JS math    |
  |  - compute result with JS    |
  +-------------+---------------+
                |
                v
  +-------------+---------------+
  | Presentation / Feedback      |
  |  - updated display text      |
  |  - error state              |
  |  - visual button style       |
  +-----------------------------+
```

---

## 3. Critical Design Components

### 3.1 `App.tsx`

This is the core component.

Responsibilities:
- Maintain calculator state.
- Render screen and button grid.
- Handle user interaction from both mouse and keyboard.
- Convert scientific inputs into executable expressions.
- Trigger result calculation and error handling.

Why it is critical:
- It contains the functional application logic.
- UI and state are tightly coupled here.
- Most feature changes happen in this file.

### 3.2 `display` state

- Defined with `const [display, setDisplay] = useState('0')`.
- Represents the visible calculator expression / result.
- All user actions update this state.
- It is the single source of truth for calculator content.

### 3.3 Input handling functions

Key functions:
- `appendValue(value: string)`
- `clearAll()`
- `deleteLast()`
- `calculateResult()`
- `handleKeyboard(event: KeyboardEvent)`

Why they are critical:
- They encapsulate calculator behavior.
- They enforce valid expression structure.
- They define support for scientific functions and keyboard input.

### 3.4 Expression evaluation logic

The calculator uses a conversion-based evaluation approach:
- Translate UI operators into JavaScript-compatible expressions.
- Replace `×`/`÷` with `*`/`/`.
- Replace scientific symbols with `Math` functions.
- Evaluate with `Function("use strict"; return (...))()`.

Why this matters:
- It avoids a full expression parser while enabling advanced math.
- It is simple and effective for this application size.
- It also introduces a security assumption around controlled input.

### 3.5 Styling and layout (`index.css`)

Responsibility:
- Defines grid layout for buttons.
- Differentiates function buttons, operators, and standard buttons.
- Provides a clean calculator look and feel.

Why it matters:
- A clear layout reduces UI confusion.
- Responsive 5-column grid supports scientific functionality.
- Styling separates visual concerns from logic.

---

## 4. High-Level Data Flow

### 4.1 User interaction path

1. User clicks a button or presses a key.
2. The event handler in `App.tsx` receives the input.
3. `appendValue`, `deleteLast`, `clearAll`, or `calculateResult` runs.
4. The `display` state is updated.
5. React re-renders the calculator screen.

### 4.2 Keyboard flow

- `useEffect` attaches a global `keydown` event listener.
- `handleKeyboard` maps the keyboard key to a calculator action.
- The same state-updating functions run as if the user clicked buttons.

### 4.3 Expression evaluation flow

1. `calculateResult()` is invoked.
2. Display text is transformed:
   - `×` → `*`
   - `÷` → `/`
   - `^` → `**`
   - `√(` → `Math.sqrt(`
   - `sin(` → `Math.sin(`
   - `cos(` → `Math.cos(`
   - `tan(` → `Math.tan(`
   - `ln(` → `Math.log(`
   - `log(` → `Math.log10(`
   - `exp(` → `Math.exp(`
   - `π` → `Math.PI`
   - `e` → `Math.E`
3. The expression is evaluated via JavaScript.
4. Result is stored back to `display`.
5. If evaluation fails, `display` becomes `Error`.

---

## 5. Assumptions

- The application is client-only and runs entirely in the browser.
- No server-side API or database is required.
- Inputs are limited to button presses and simple keyboard keys.
- Scientific function syntax is typed as `sin(`, `cos(`, `tan(`, `log(`, `ln(`, `√(`, `exp(`.
- The expression evaluator is sufficient for standard scientific calculations.
- Security risk is minimal because user input is constrained to calculator chars.
- The app is a single-page application with one core component.

---

## 6. Dependencies

### Runtime dependencies
- `react` - UI rendering library.
- `react-dom` - DOM rendering support.

### Development dependencies
- `typescript` - provides type safety.
- `vite` - development server and build tool.
- `@vitejs/plugin-react` - React support for Vite.
- `eslint` and plugins - static analysis and code quality.
- `@types/react` / `@types/react-dom` - Type definitions for TypeScript.

### Project scripts
- `npm run dev` - starts the Vite dev server.
- `npm run build` - builds production assets.
- `npm run preview` - previews the production build.
- `npm run lint` - runs ESLint.

---

## 7. Critical Developer Notes

### 7.1 Where to extend functionality

- Add new scientific buttons in `buttons` array.
- Extend `buttonValueMap` for new function translations.
- Update `calculateResult()` to map any new symbols to JavaScript.
- Add keyboard mappings in `handleKeyboard()` for new input keys.

### 7.2 Where to improve UI

- Move calculator layout into separate component files.
- Add accessibility support for button labels and keyboard focus.
- Add a history panel to record previous calculations.
- Improve button grid responsiveness.

### 7.3 Testing guidance

- Add component tests for `App.tsx` using React Testing Library.
- Verify `appendValue`, `calculateResult`, and `handleKeyboard` behavior.
- Confirm the display updates correctly for valid and invalid expressions.

---

## 8. Suggested Future Architecture Improvements

- Split `App.tsx` into smaller components:
  - `CalculatorDisplay`
  - `CalculatorButtons`
  - `CalculatorLogic`
- Move evaluation logic into a dedicated utility module.
- Add a parser if expression complexity grows beyond simple replacement.
- Add unit tests for both UI and logic layers.
- Consider storing calculation history in local state or localStorage.

---

## 9. Quick onboarding checklist

- `npm install`
- `npm run dev`
- Review `src/App.tsx` as the primary application source.
- Review `src/index.css` for visual layout.
- Understand that `display` is the only state used for calculations.
- Follow the `buttonValueMap` and `calculateResult` transformation pipeline when adding features.
