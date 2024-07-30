'use server'
import { cookies } from 'next/headers'

export async function delete_cookie(key: string) {
    cookies().delete(key)
    return true
}