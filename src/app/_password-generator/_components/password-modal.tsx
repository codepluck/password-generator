"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    Credenza,
    CredenzaBody,
    CredenzaClose,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "@/components/ui/credenza";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { deleteStoredPassword, fetchPasswords, updateStoredPassword } from "../_lib/actions";

interface PasswordEntry {
    timestamp: number;
    password: string;
}

interface StoredPasswordsProps {
    fingerprint: string | null;
    storePasswords: string;
    setStorePasswords: React.Dispatch<React.SetStateAction<string>>;
}

export default function StoredPasswords({ fingerprint, storePasswords, setStorePasswords }: StoredPasswordsProps) {
    const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
    const [showLatest, setShowLatest] = useState(false);
    const [open, setOpen] = useState(false);

    // Load stored passwords when fingerprint is available
    const loadPasswords = useCallback(async () => {
        if (!fingerprint) return;
        const stored = await fetchPasswords(fingerprint);
        setPasswords(stored);
    }, [fingerprint]);

    useEffect(() => {
        if (fingerprint) loadPasswords();
    }, [fingerprint, loadPasswords]);

    const handleDelete = useCallback(
        async (timestamp: number) => {
            if (!fingerprint) return;
            await deleteStoredPassword(fingerprint, timestamp);
            loadPasswords();
        },
        [fingerprint, loadPasswords]
    );

    const handleUpdate = useCallback(
        async (timestamp: number, newPassword: string) => {
            if (!fingerprint) return;
            await updateStoredPassword(fingerprint, timestamp, newPassword);
            loadPasswords();
        },
        [fingerprint, loadPasswords]
    );

    const tableRows = useMemo(
        () =>
            passwords.map((entry) => (
                <tr key={entry.timestamp} className="border">
                    <td className="p-2 border">{new Date(entry.timestamp).toLocaleString()}</td>
                    <td className="p-2 border">{entry.password}</td>
                    <td className="p-2 border flex space-x-2">
                        <Button size="sm" onClick={() => handleUpdate(entry.timestamp, "newPassword")}>
                            Update
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(entry.timestamp)}>
                            Delete
                        </Button>
                    </td>
                </tr>
            )),
        [passwords, handleDelete, handleUpdate]
    );

    // Memoized handler for radio group change
    const onRadioChange = useCallback((value: string) => {
        setStorePasswords(value);
    }, [setStorePasswords]);

    return (
        <div className="w-full flex items-center justify-center mt-4">
            <Credenza open={open} onOpenChange={setOpen}>
                {!open && (
                    <CredenzaTrigger asChild>
                        <Button onClick={() => setOpen(true)}>Manage Stored Passwords</Button>
                    </CredenzaTrigger>
                )}
                <CredenzaContent>
                    <CredenzaHeader>
                        <CredenzaTitle>Stored Passwords</CredenzaTitle>
                        <CredenzaDescription>Manage your stored passwords securely.</CredenzaDescription>
                    </CredenzaHeader>
                    <CredenzaBody>
                        <div className="w-full flex flex-col gap-4">
                            {/* Radio Group Section */}
                            <div className="flex flex-col gap-2">
                                <Label className="font-medium text-sm">Store Password?</Label>
                                <div className="flex items-center gap-2">
                                    <RadioGroup className="flex" value={storePasswords} onValueChange={onRadioChange}>
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem
                                                value="yes"
                                                id="yes"
                                                className="h-10 w-10 border rounded flex items-center justify-center"
                                            />
                                            <Label htmlFor="yes" className="h-10 flex items-center">
                                                Yes
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem
                                                value="no"
                                                id="no"
                                                className="h-10 w-10 border rounded flex items-center justify-center"
                                            />
                                            <Label htmlFor="no" className="h-10 flex items-center">
                                                No
                                            </Label>
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
                                                        Your last <strong>5 copied passwords</strong> are securely stored in your browser using{" "}
                                                        <span className="font-semibold">IndexedDB with encryption via CryptoJS</span>.
                                                    </p>
                                                    <p className="text-sm text-foreground opacity-80 leading-relaxed">
                                                        This means only <strong>you</strong> can access them—no one else, including us.
                                                    </p>
                                                    <p className="text-xs text-gray-500 italic">
                                                        Your data stays with you. We have zero access.
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>

                            {/* Checkbox for latest passwords */}
                            <div className="flex items-center gap-2 mb-2">
                                <Checkbox checked={showLatest} onCheckedChange={(checked) => setShowLatest(!!checked)} />
                                <span>Show Latest Passwords</span>
                            </div>

                            {/* Passwords Table */}
                            {passwords.length > 0 && storePasswords === "yes" && (
                                <table className="w-full border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border p-2">Date/Time</th>
                                            <th className="border p-2">Password</th>
                                            <th className="border p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>{tableRows}</tbody>
                                </table>
                            )}
                        </div>
                    </CredenzaBody>
                    <CredenzaFooter>
                        <CredenzaClose asChild>
                            <Button onClick={() => setOpen(false)}>Close</Button>
                        </CredenzaClose>
                    </CredenzaFooter>
                </CredenzaContent>
            </Credenza>
        </div>
    );
}
