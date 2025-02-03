# Configurator

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## 📚 Functionality

### ⚙️ **Frame**

- The choice of body material: **Steel** or **Polyester**.
- Activation of tabs based on the selected material.
  - When choosing **Polyester** The “grounding plate” icon is activated.
  - When choosing **Stainless steel** the icon "mounting plate».
- Dynamic update of the drawing when changing the size of the case.

### ⚙️ **Клеммы**

- Choosing a brand, color, size and number of terminals.
- Limiting the number of terminals based on the size of the case.
- Button **"Apply"**:
  - Active when filling out all parameters.
  - Deactivated after applying the changes.
- Button **«Add a new one +»**:
  - Activated after successfully adding terminals.
  - Deactivated with incomplete data.
- Support for dynamic reflection of terminals in the drawing.

### ⚙️ **Cable input**

- The ability to install inputs on four sides of the case: **A**, **B**, **C**, **D**.
- Choosing the type of input:
  - **Plug** (with the choice of material: plastic or metal).
  - **Cable input** (with a choice of type: armored, unaroused).
- Input parameters:
  - Size (М20, М25, М32, М40, М50).
  - Quantity (0-10).
  - Mood (chess or linear).
- Input restrictions depending on the size of the case.
- Automatic update of the drawing image.
- Button **«ADD»** to add additional inputs.

### ⚙️ **Interactive assistant**

- Redistribution of the button **"Further"** for better visibility on large screens.
- Improved navigation by the steps of configuration.

### ⚙️ **Dynamic dependencies and checks**

- When choosing certain materials and sizes, connected components are automatically activated or deactivated.
- A system of warning about inconsistencies in case of violation of restrictions on the size and number of components.

---

## 📊 **The logic of addictions**

1. The choice of body material affects the availability of accessories.
2. The size of the case limits the amount and size of the terminals and cable inputs.
3. Dynamic activation of buttons depending on the status of field filling.
4. Automatic synchronization of visual display with selected parameters.

---

## 📸 **Screenshots and demonstration**

[Link to a demo version](https://your-demo-link.com)

---

## 📧 **Contacts**

- **Name:** Mykhailo Hakman
- **Email:** deorfeal.it@gmail.com
- **Telegram:** @deorfeal

---

## 📜 **License**

The project is distributed under the license **MIT**.

---

This project demonstrates skills in working with **Vue 3**, **TypeScript** and the complex logic of dependencies and interactions of components in the dynamic interface. 🚀
