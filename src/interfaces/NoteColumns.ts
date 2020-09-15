export default interface Columns {
    id: "id" | "description" | "created" | "status" | "department" | "type" | "subject" | "user";
    label: string;
    minWidth?: number;
    align?: "left" | "right";
    shortText?: boolean;
    component?: any;
  }