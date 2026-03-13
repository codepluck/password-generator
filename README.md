# 🔐 Password Generator React Component

A secure and customizable password generator component built for React with TypeScript.

## 🚀 Features

- Generate strong, random passwords with customizable options.
- Copy passwords to clipboard instantly.
- Adjust password length with a user-friendly slider.
- Supports uppercase, lowercase, numbers, and symbols.
- Provides a password strength meter for better security awareness.
- User-friendly UI with tooltips for enhanced experience.

## 📦 Installation

Copy the `PasswordGenerator.tsx` file into your React project.

## 🔧 Usage

Import and use the `PasswordGenerator` component in your React project:

```tsx
import PasswordGenerator from "./PasswordGenerator";

function App() {
    return <PasswordGenerator />;
}
```

## ⚙️ Props

| Prop Name          | Type    | Default | Description                                 |
| ------------------ | ------- | ------- | ------------------------------------------- |
| `length`           | number  | 10      | Length of the generated password.           |
| `includeUppercase` | boolean | true    | Include uppercase letters in the password.  |
| `includeLowercase` | boolean | true    | Include lowercase letters in the password.  |
| `includeNumbers`   | boolean | true    | Include numbers in the password.            |
| `includeSymbols`   | boolean | true    | Include special characters in the password. |

## 🛠 Functions & API

### `generatePassword()`
Generates a random password based on selected criteria.

### `copyToClipboard()`
Copies the generated password to the clipboard and stores it if enabled.

### `getPasswordStrength(password: string)`
Returns the strength of the generated password (Weak, Intermediate, Strong).

## 🔄 Actions

- **Generate Password:** Click the "Generate" button to create a new password.
- **Copy Password:** Click the "Copy" button to save it to your clipboard.
- **Adjust Strength:** Modify the length and character set to create a stronger password.
- **Enable Storage:** Choose whether to store passwords securely in your browser.

## 🛠 Contributing

Feel free to submit issues or pull requests to enhance this component.

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.
