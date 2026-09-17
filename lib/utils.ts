import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilidad para combinar clases de Tailwind CSS de forma segura,
 * evitando conflictos de especificidad.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
