export default interface Columns {
  id:
    | "id"
    | "description"
    | "rate"
    | "currency"
    | "apply_main"
    | "apply_extension"
    | "apply_change_user";
  label: string;
  minWidth?: number;
  align?: "right";
  component?: any;
}
