export interface Button {
  id: string;
  buttonText: string;
  buttonLink: string;
  isExternal: boolean;
  variant: 'primary' | 'secondary';
  heroId: string;
}

export interface HeroData {
  id: string;
  title: string;
  paragraph: string;
  heroImageUrl: string;
  buttonLayout: 'none' | 'oneButton' | 'twoButtons';
  buttons: Button[];
}
