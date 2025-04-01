# Password Generator React Plugin

A simple and customizable password generator component built for React with TypeScript.

## 🚀 Features

- Generate secure passwords with customizable options.
- Copy passwords to clipboard.
- Adjust password length with a slider.
- Supports uppercase, lowercase, numbers, and symbols.

## 📦 Installation

Install the package via npm:

```sh
npm install your-package-name
```

or using yarn:

```sh
yarn add your-package-name
```

## 🔧 Usage

Import and use the `PasswordGenerator` component in your React project:

```tsx
import PasswordGenerator from "your-package-name";

export default function App() {
  return (
    <section className="flex justify-center items-center h-screen">
      <PasswordGenerator
        length={12}
        includeUppercase
        includeLowercase
        includeNumbers
        includeSymbols
      />
    </section>
  );
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

## 🛠 Contributing

Feel free to submit issues or pull requests to improve this package.

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.
