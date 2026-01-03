
export interface SocialFormat {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: string;
  platform: 'LinkedIn' | 'Instagram' | 'WhatsApp' | 'Generic';
  isCircle?: boolean;
}

export interface BrandingConfig {
  logoTextPrimary: string;
  logoTextAccent: string;
  accentColor: string;
}
