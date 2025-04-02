"use client";
import * as React from "react";
import { PasswordGeneratorProps } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCheck, Copy, Info, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { browserFinterPrint } from "./utils";
import { storePassword } from "./store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";

export default function PasswordGenerator({
    length = 10,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    includeUppercase = true,
}: PasswordGeneratorProps) {
    // Local state for password and options
    const [password, setPassword] = React.useState("");
    const [passwordLength, setPasswordLength] = React.useState(length);
    const [copied, setCopied] = React.useState(false);
    const [fingerprint, setFingerprint] = React.useState<string | null>(null);
    const [storePasswords, setStorePasswords] = React.useState("yes");

    React.useEffect(() => {
        const fetchFingerprint = async () => {
            const print = await browserFinterPrint();
            setFingerprint(print);
        };

        fetchFingerprint();
    }, []);
    console.log(fingerprint, 'fingerprint');


    // Local states for each character option
    const [useLowercase, setUseLowercase] = React.useState(includeLowercase);
    const [useUppercase, setUseUppercase] = React.useState(includeUppercase);
    const [useNumbers, setUseNumbers] = React.useState(includeNumbers);
    const [useSymbols, setUseSymbols] = React.useState(includeSymbols);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Simple password strength function
    const getPasswordStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length >= 8) score += 1;
        if (pwd.length >= 12) score += 1;
        const categories = [
            /[a-z]/.test(pwd),
            /[A-Z]/.test(pwd),
            /[0-9]/.test(pwd),
            /[^A-Za-z0-9]/.test(pwd),
        ];
        score += categories.filter(Boolean).length;

        if (score <= 3) return { label: "Weak", color: "red-500" };
        else if (score <= 5) return { label: "Intermediate", color: "yellow-500" };
        else return { label: "Strong", color: "green-500" };
    };

    // Generate password based on the local states
    const generatePassword = () => {
        if (passwordLength <= 0) {
            toast.error("Error", {
                description: "Password length must be greater than 0.",
                cancel: true,
                closeButton: true
            });
            return;
        }
        let chars = "";
        const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
        const numberChars = "0123456789";
        const symbolChars = "!@#$%^&*()_+=-[]{}|;':\",.<>/?";

        if (useLowercase) chars += lowerCaseChars;
        if (useUppercase) chars += upperCaseChars;
        if (useNumbers) chars += numberChars;
        if (useSymbols) chars += symbolChars;

        let newPassword = "";
        for (let i = 0; i < passwordLength; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPassword);
        setCopied(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Copy password to clipboard and select input text
    const copyToClipboard = () => {
        if (passwordLength <= 0) {
            toast.error("Error", {
                description: "Password length must be greater than 0.",
                cancel: true,
                closeButton: true
            });
            return;
        }
        if (inputRef.current) {
            inputRef.current.select();
        }
        navigator.clipboard.writeText(password).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                // storePassword(fingerprint, password)
                if (storePasswords === "yes") {
                    storePassword(fingerprint, password);
                }
            }, 2000);
        });
    };
    React.useEffect(() => {
        if (!useLowercase && !useUppercase && !useNumbers && !useSymbols) {
            setUseLowercase(true);
        }
        generatePassword();
    }, [useLowercase, useUppercase, useNumbers, useSymbols, passwordLength]);

    // Get strength info for current password
    const strength = getPasswordStrength(password);

    return (
        <section className="w-full max-w-96">
            <Card className={`shadow-md h-full rounded`}>
                <CardHeader>
                    <CardTitle>Generate Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="w-full flex flex-col space-y-4">
                        {/* Display generated password and copy option */}
                        <section className="w-full flex flex-col space-y-2">
                            <div className="flex space-x-2">
                                <Input
                                    onClick={(e) => {
                                        e.currentTarget.select();
                                    }}
                                    value={password}
                                    ref={inputRef}
                                    readOnly
                                />
                                <Button variant="outline" type="button" onClick={copyToClipboard}>
                                    {copied ? (
                                        <CheckCheck size={16} className="text-green-500 transition-colors duration-300" />
                                    ) : (
                                        <Copy size={16} className="transition-colors duration-300" />
                                    )}
                                    <span>Copy</span>
                                </Button>
                            </div>
                            {/* Strength Meter */}
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm">Strength: {strength.label}</label>
                                <div className="w-full h-2 rounded">
                                    <div className={`bg-${strength.color} h-full rounded`} style={{ width: "100%" }} />
                                </div>
                            </div>
                        </section>
                        <section className="w-full flex flex-col space-y-2">
                            <label className="font-medium text-sm">Store Password?</label>
                            <div className="flex items-center space-x-2">
                                <RadioGroup className="flex" value={storePasswords} onValueChange={setStorePasswords}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="yes" id="yes" />
                                        <Label htmlFor="yes">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="no" />
                                        <Label htmlFor="no">No</Label>
                                    </div>
                                </RadioGroup>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info size={16} className="text-gray-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <Card className="p-2 w-96">
                                            <CardContent className="space-y-2">
                                                <p className="text-base font-semibold text-gray-800">🔒 Your Security Matters!</p>
                                                <p className="text-sm text-foreground opacity-80 leading-relaxed">
                                                    Your last <strong>5 copied passwords</strong> are securely stored in your browser using
                                                    <span className="font-semibold"> IndexedDB with encryption via CryptoJS</span>.
                                                </p>
                                                <p className="text-sm text-foreground opacity-80 leading-relaxed">
                                                    This means only <strong>you </strong>
                                                    can access them—no one else, including us.
                                                </p>
                                                <p className="text-xs text-gray-500 italic">Your data stays with you. We have zero access.</p>
                                            </CardContent>
                                        </Card>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </section>
                        {/* Password Length Control */}
                        <section className="w-full flex flex-col space-y-2">
                            <label className="font-medium text-sm">Password Length</label>
                            <div className="flex space-x-2">
                                <Slider
                                    value={[passwordLength]}
                                    onValueChange={(value) => setPasswordLength(value[0])}
                                    max={100}
                                    step={1}
                                />
                            </div>
                        </section>

                        {/* Character Options with Checkboxes */}
                        <section className="w-full flex flex-col space-y-2">
                            <label className="font-medium text-sm">Character Options</label>
                            <div className="flex flex-col space-y-1">
                                <label className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={useLowercase}
                                        onCheckedChange={(checked) => {
                                            if (typeof checked === "boolean") setUseLowercase(checked);
                                        }}
                                    />
                                    <span className="text-foreground opacity-80 text-sm">lowercase</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={useUppercase}
                                        onCheckedChange={(checked) => {
                                            if (typeof checked === "boolean") setUseUppercase(checked);
                                        }}
                                    />
                                    <span className="text-foreground opacity-80 text-sm">UPPERCASE</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={useNumbers}
                                        onCheckedChange={(checked) => {
                                            if (typeof checked === "boolean") setUseNumbers(checked);
                                        }}
                                    />
                                    <span className="text-foreground opacity-80 text-sm">Numbers(0-9)</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={useSymbols}
                                        onCheckedChange={(checked) => {
                                            if (typeof checked === "boolean") setUseSymbols(checked);
                                        }}
                                    />
                                    <span className="text-foreground opacity-80 text-sm">Symbols($%)</span>
                                </label>
                            </div>
                        </section>

                        {/* Generate Password Button */}
                        <section className="w-full flex items-center justify-center mt-4">
                            <Button
                                type="button"
                                className="w-full flex items-center justify-center gap-2 cursor-pointer"
                                onClick={generatePassword}
                            >
                                <RefreshCcw
                                    className="transition-transform duration-300 ease-in-out hover:rotate-180"
                                    size={18}
                                />
                                Re-Generate
                            </Button>
                        </section>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}
