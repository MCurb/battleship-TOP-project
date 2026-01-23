
# ⚓ Battleship Project

A classic **Battleship strategy game** built with vanilla JavaScript.  
The main goal of this project was to **practice testing, architecture, and game state management**, while keeping the UI simple and functional.


## 🚀 Live Demo

🎮 **Play the game here:**  
👉 https://mcurb.github.io/battleship-TOP-project/
## ✨ Features

- 🤖 **Play against the computer**
- 🧠 **Smarter CPU logic**
- 🎲 **Random ship placement**
- 📊 **Clear game state & phase indicators**
- 🔄 **Restart anytime**
## 📸 Screenshots

### 🏠 Main View
![Main View](https://github.com/user-attachments/assets/19a85475-b685-4772-a694-34446d927574)

### ⚔️ Gameplay
![Gameplay](https://github.com/user-attachments/assets/b4cedc0a-65be-49aa-be56-26bf4a2b201f)

## ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MCurb/battleship-TOP-project.git
   ```
2. **Install dependencies**
   ```bash
    npm install
   ```
## 🕹️ How to Play

1. 🎲 Click **Random Ships** to place your fleet
2. ▶️ Click **Start**
3. 💥 Attack the enemy board
4. 🏆 Sink all enemy ships to win
5. 🔄 Use **Restart** to play again


## 💻 Tech Stack

#### Frontend
 - HTML
 - CSS
 - JavaScript (ES6+)

#### Tooling & Quality
 - 🧪 Jest (Testing)
 - 📦 Webpack
 - 🧹 ESLint
 - ✨ Prettier
 - 🔁 Babel


## 🗂️ Project Structure
````
battleship-TOP-project/
└── src/
    ├── index.js                  # Entry point
    ├── styles.css                # Global styles
    ├── template.html             # HTML template
    ├── fonts/
    ├── icons/
    ├── game-controller/
    │   └── game-controller.js    # Main game controller
    ├── gameboard/
    │   ├── gameboard-class.js
    │   └── gameboard-class.test.js
    ├── gameboard_ui/
    │   └── gameboard-ui.js
    ├── observer/
    │   └── observable.js         # Observer pattern
    ├── player/
    │   └── player-class.js
    ├── queue/
    │   └── queue.js
    ├── ship/
    │   ├── ship-class.js
    │   └── ship-class.test.js
    ├── ship_placement_ui/
    │   └── ship-placement.js
    ├── state/
    │   └── game-state.js
    └── utils/
        └── utils.js
````
## 🧠 What I Learned
- 🧪 How to properly test game logic with Jest
- 🧩 How design patterns (Observer, Controller) improve maintainability
- 🔨 Why refactoring during development is better than leaving it all for the end



## Acknowledgements

- 🎨 Icons by [Pixel Perfect]([https://www.flaticon.com/free-icons/close](https://www.flaticon.com/free-icons/close)) and [Freepik]([https://www.flaticon.com/free-icons/o](https://www.flaticon.com/free-icons/o)) from Flaticon
- 📘 [The Odin Project](https://www.theodinproject.com/) — structure, guidance, and discipline
- 📚 [MDN Web Docs](https://developer.mozilla.org/en-US/) — answers to every JavaScript doubt
## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/)


## Author

**Marcos Curbeco**

[The Odin Project Student](https://www.theodinproject.com/dashboard) | Web Developer in Progress
