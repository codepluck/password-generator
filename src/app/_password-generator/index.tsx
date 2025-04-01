"use client";
import * as React from "react";
import { PasswordGeneratorProps } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function PasswordGenerator({
    length = 10,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    includeUppercase = true
}: PasswordGeneratorProps) {
    const [password, setPassword] = React.useState("");
    const [passwordLength, setPasswordLength] = React.useState(length);
    const [copied, setCopied] = React.useState(false); // State to track copy status

    // Function to generate password based on selected options
    const generatePassword = () => {
        let chars = "";
        const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerCase = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+=-[]{}|;':\",.<>/?";

        if (includeLowercase) chars += lowerCase;
        if (includeUppercase) chars += upperCase;
        if (includeNumbers) chars += numbers;
        if (includeSymbols) chars += symbols;

        let newPassword = "";
        for (let i = 0; i < passwordLength; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        setPassword(newPassword);
        setCopied(false); // Reset copied status
    };

    // Function to copy password to clipboard
    const copyToClipboard = () => {
        if (!password) return;

        navigator.clipboard.writeText(password).then(() => {
            setCopied(true); // Show "Copied!" feedback
            setTimeout(() => setCopied(false), 2000); // Hide message after 2 seconds
        });
    };

    // Re-generate password whenever options change
    React.useEffect(() => {
        generatePassword();
    }, [includeLowercase, includeNumbers, includeSymbols, includeUppercase, passwordLength]);

    return (
        <section className="w-full max-w-96">
            <Card>
                <CardHeader>
                    <CardTitle>Generate Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="w-full flex flex-col space-y-3">
                        <section className="w-full flex space-x-2">
                            <Input value={password} readOnly />
                            <Button type="button" onClick={copyToClipboard}>
                                {copied ? "Copied!" : "Copy"}
                            </Button>
                        </section>

                        <section className="w-full flex flex-col space-y-4">
                            <label>Length</label>
                            <section className="flex space-x-2">
                                <Input
                                    className="w-20"
                                    type="number"
                                    value={passwordLength}
                                    onChange={(event) => setPasswordLength(Number(event.target.value))}
                                />
                                <Slider
                                    value={[passwordLength]}
                                    onValueChange={(value) => setPasswordLength(value[0])}
                                    max={100}
                                    step={1}
                                />
                            </section>
                        </section>

                        <section className="w-full flex items-center justify-center mt-4">
                            <Button type="button" className="w-full" onClick={generatePassword}>Generate Password</Button>
                        </section>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}
