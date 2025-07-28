export interface Color {
  id: string;
  hex: string;
  locked: boolean;
}

export interface ColorHistory {
  colors: Color[];
  timestamp: number;
}
