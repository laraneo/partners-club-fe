export default interface MasterTableColumns {
    id: "id" | "description" | "slug";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: number) => string;
    component?: any;
  }