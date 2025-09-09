"use Client"

import { UserButton } from "@clerk/nextjs";

export default function userDropdown() {
    return (
        <UserButton showName appearance={{
            elements: {
                userButtonOuterIdentifier: {
                    color: "white"
                }
            }
        }} />
    );
}