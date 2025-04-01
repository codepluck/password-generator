
export type PasswordStrength = {
    easy: string,
    medium: string,
    hard: string
}
export type PasswordGeneratorProps = {
    length: number,
    includeUppercase: boolean,
    includeLowercase: boolean,
    includeNumbers: boolean,
    includeSymbols: boolean
}