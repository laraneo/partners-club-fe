export default interface ShareTypeColumns {
    id: "id" | "description" | "code" | "access";
    label: string;
    minWidth?: number;
    align?: "left" | "right";
    component?: any;
  }