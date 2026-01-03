
import { SocialFormat, BrandingConfig } from './types';

export const SOCIAL_FORMATS: SocialFormat[] = [
  {
    id: 'ig-post',
    name: 'Instagram Post',
    platform: 'Instagram',
    width: 1080,
    height: 1080,
    icon: '📸'
  },
  {
    id: 'circle-profile',
    name: 'Circular Profile',
    platform: 'Generic',
    width: 1000,
    height: 1000,
    icon: '⭕',
    isCircle: true
  },
  {
    id: 'ig-story',
    name: 'Instagram Story / WhatsApp Status',
    platform: 'Instagram',
    width: 1080,
    height: 1920,
    icon: '📱'
  },
  {
    id: 'li-banner',
    name: 'LinkedIn Banner',
    platform: 'LinkedIn',
    width: 1584,
    height: 396,
    icon: '💼'
  },
  {
    id: 'li-post',
    name: 'LinkedIn Post',
    platform: 'LinkedIn',
    width: 1200,
    height: 627,
    icon: '📄'
  },
  {
    id: 'wa-profile',
    name: 'WhatsApp Profile',
    platform: 'WhatsApp',
    width: 500,
    height: 500,
    icon: '💬'
  }
];

export const BRANDING: BrandingConfig = {
  logoTextPrimary: 'Autonomous',
  logoTextAccent: 'Hacks',
  accentColor: '#8CFF00' // Lime Green
};
