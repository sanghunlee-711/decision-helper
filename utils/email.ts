export function getEmailUsername(email: string): string {
    return email.split("@")[0];
}

