export default interface Columns {
  id: "id" | "name" | "slug" | "description" | "route" | "main" | "order" | "father" | "icons";
  label: string;
  minWidth?: number;
  align?: "left" | "right";
  component?: any;
}
