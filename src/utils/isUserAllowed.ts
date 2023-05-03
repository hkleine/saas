import { UserWithEmail } from "@/types/types";

export function isUserAllowed({user, minimalRoleRequired}:{user: UserWithEmail, minimalRoleRequired: number}) {
    return user.role.id <= minimalRoleRequired;
}