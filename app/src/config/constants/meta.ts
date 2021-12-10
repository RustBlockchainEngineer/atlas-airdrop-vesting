import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'AtlasDex',
  description:
    'Atlas Dex Token Vesting and Claim',
    image: '%PUBLIC_URL%/logo192.png',
  }

export const customMeta: { [key: string]: PageMeta } = {
  '/': {
    title: 'Home',
  }
}
